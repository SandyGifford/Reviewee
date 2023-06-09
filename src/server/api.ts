import express from "express";
import { gqlRequest } from "./gqlClient";
import { gql } from "./utils";
import { ORG, REPO } from "./consts";
import { addMilliseconds } from "date-fns";
import { MS_PER_MINUTE } from "../client/consts";

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

makeCachedGet("/reviewsBy", async () => {
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

	return gqlResponse.repository?.pullRequests?.edges?.flatMap((prEdge) =>
		prEdge.node?.reviews?.edges?.flatMap(({ node: reviewNode }) => ({
			created: reviewNode?.createdAt,
			login: reviewNode?.author?.login,
		})),
	);
});

export default api;
