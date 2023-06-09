import { graphql } from "@octokit/graphql";
import { AUTH_TOKEN, ORG, REPO } from "./consts";
import { gql } from "./utils";
import { GQLQuery } from "./types";
console.clear();

const request = graphql.defaults({
  headers: {
    authorization: `token ${AUTH_TOKEN}`,
  },
});

const gqlRequest = (...args: Parameters<typeof request>) =>
  request(...args) as Promise<GQLQuery>;

(async () => {
  const resp = await gqlRequest(
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
    }
  );

  console.log(
    resp.repository?.pullRequests?.edges?.flatMap((prEdge) =>
      prEdge.node?.reviews?.edges?.flatMap(({ node: reviewNode }) => ({
        created: reviewNode?.createdAt,
        login: reviewNode?.author?.login,
      }))
    )
  );
})();

setInterval(() => {}, 5000);
