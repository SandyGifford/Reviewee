import express from "express";
import { gqlRequest } from "./gqlClient";
import { gql } from "./utils.server";
import { ORG, REPO } from "./consts.server";
import { addMilliseconds } from "date-fns";
import { MS_PER_MINUTE } from "../client/consts.client";
import type { ReviewsByResponse } from "../client/types.client";
import { assertChain } from "../client/utils.client";

const api = express();

const cache: Record<string, { d: Date; data: unknown }> = {};

type MakeCachedGetOptions = {
  staleDataTOMS?: number;
};

const makeCachedGet = <T>(
	path: string,
	cb: () => Promise<T>,
	options: MakeCachedGetOptions = {},
): void => {
	const { staleDataTOMS = MS_PER_MINUTE } = options;

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
		}

		res.json(data);
	});
};

makeCachedGet<ReviewsByResponse[]>("/reviewsBy", async () => {
	const gqlResponse = await gqlRequest(
		gql`
      query lastIssues($ORG: String!, $REPO: String!, $PR_COUNT: Int) {
        repository(owner: $ORG, name: $REPO) {
          pullRequests(last: $PR_COUNT) {
            edges {
              node {
                reviews(last: 100) {
                  edges {
                    node {
											id
                      createdAt
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
        }
      }
    `,
		{
			ORG,
			REPO,
			PR_COUNT: 30,
		},
	);

	const prEdges = assertChain(gqlResponse?.repository?.pullRequests?.edges, () => new Error("Could not find PR edges in response"));

	return prEdges.flatMap((prEdge) => {
		const reviewEdges = assertChain(prEdge?.node?.reviews?.edges, () => new Error("Could not find review edges in response"));

		return reviewEdges.flatMap(({ node: reviewNode }) => {
			const createdAt = assertChain(reviewNode?.createdAt, ()=> new Error("Could not find 'createdAt' in review"));
			const login = assertChain(reviewNode?.author?.login, ()=> new Error("Could not find 'login' in review"));
			const id = assertChain(reviewNode?.id, ()=> new Error("Could not find 'id' in review"));

			return {
				createdAt,
				login,
				id,
			};
		});
	});
});

export default api;
