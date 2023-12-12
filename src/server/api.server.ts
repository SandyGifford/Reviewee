import { addMilliseconds } from "date-fns";
import express from "express";
import { MS_PER_MINUTE } from "../client/consts.client";
import type { ReviewsByResponse } from "../client/types.client";
import { assertChain } from "../client/utils.client";
import { ORG, REPO } from "./consts.server";
import { gqlQuery } from "./gqlClient";
import { gql } from "./utils.server";
import { store } from "./store";

const api = express();

const cache: Record<string, { d: Date; data: unknown }> = {};

type MakeCachedGetOptions<T> = {
  staleDataTOMS?: number;
  afterUpdate?: (data: T) => unknown;
};

const makeCachedGet = <T>(
  path: string,
  cb: () => Promise<T>,
  options: MakeCachedGetOptions<T> = {}
): void => {
  const { staleDataTOMS = MS_PER_MINUTE, afterUpdate } = options;

  api.get(path, async (req, res) => {
    let data: T;
    const d = new Date();
    const toD = addMilliseconds(d, staleDataTOMS);
    const c = cache[path];

    if (c && c.d.getTime() < toD.getTime()) {
      data = c.data as T;
    } else {
      data = await cb();
      cache[path] = { d, data };
      afterUpdate?.(data);
    }

    res.json(data);
  });
};

makeCachedGet<ReviewsByResponse[]>(
  "/reviewsBy",
  async () => {
    const gqlResponse = await gqlQuery(
      gql`
        query lastIssues($ORG: String!, $REPO: String!, $PR_COUNT: Int) {
          repository(owner: $ORG, name: $REPO) {
            pullRequests(
              last: $PR_COUNT
              orderBy: { field: UPDATED_AT, direction: ASC }
            ) {
              nodes {
                reviews(last: 100) {
                  nodes {
                    id
                    submittedAt
                    author {
                      ... on Actor {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        ORG,
        REPO,
        PR_COUNT: 30,
      }
    );

    const prNodes = assertChain(
      gqlResponse?.repository?.pullRequests?.nodes,
      () => new Error("Could not find PR edges in response")
    );

    return prNodes.flatMap((prNode) => {
      const reviewNodes = assertChain(
        prNode?.reviews?.nodes,
        () => new Error("Could not find review edges in response")
      );

      return reviewNodes.flatMap(({ submittedAt, author, id }) => ({
        submittedAt: assertChain(
          submittedAt,
          () => new Error("Could not find 'submittedAt' in review")
        ),
        login: assertChain(
          author?.login,
          () => new Error("Could not find 'login' in review")
        ),
        id: assertChain(id, () => new Error("Could not find 'id' in review")),
      }));
    });
  },
  {
    afterUpdate: store.set,
  }
);

export default api;
