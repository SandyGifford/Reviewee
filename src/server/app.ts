import express from "express";
import { filterFalsy } from "../client/utils.client";
import api from "./api.server";
import { ORG, REPO } from "./consts.server";
import { gqlMutate, gqlQuery } from "./gqlClient";
import routing from "./routing";
import { gql } from "./utils.server";
import webhooks from "./webhooks";

throw "ARE YOU SURE YO MEAN TO RUN THIS";

const app = express();

app.use("/api", api);
app.use("/", routing);
app.use(webhooks);

export default app;

(async () => {
  const getCommentsResponse = await gqlQuery(
    gql`
      query getComments($ORG: String!, $REPO: String!) {
        repository(owner: $ORG, name: $REPO) {
          pullRequest(number: 3898) {
            id
            files(first: 100) {
              nodes {
                path
              }
            }
            reviews(first: 100) {
              nodes {
                comments(first: 100) {
                  nodes {
                    author {
                      login
                    }
                    body
                    path
                    startLine
                    line
                    outdated
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

  if (!getCommentsResponse.repository?.pullRequest)
    throw "Something went very wrong";

  const { files, reviews } = getCommentsResponse.repository.pullRequest;

  const fileMap =
    files?.nodes?.reduce((map, { path }) => {
      if (path) map[path] = true;
      return map;
    }, {} as Record<string, true>) || {};

  const addReviewResponse = await gqlMutate(gql`
    mutation {
      addPullRequestReview(input: { pullRequestId: "PR_kwDODRZ3Xs5hQG-G" }) {
        pullRequestReview {
          id
        }
      }
    }
  `);

  const pullRequestReviewId =
    addReviewResponse.addPullRequestReview?.pullRequestReview?.id;

  //   const pullRequestReviewId = "PRR_kwDODRZ3Xs5qAHHm";

  if (!pullRequestReviewId) throw new Error("No review created");

  const comments = filterFalsy(
    reviews?.nodes?.flatMap(({ comments }) =>
      comments?.nodes?.filter(
        ({ author, outdated, path }) =>
          author?.login === "SandyGifford" &&
          !!outdated &&
          path &&
          !!fileMap[path]
      )
    ) || []
  );

  async function repostComment(i: number) {
    console.log("=>", comments[i]);
    if (!comments[i]) return;
    const { body, line, startLine, path } = comments[i];

    const subjectType = !!line ? "LINE" : "FILE";

    const r = await gqlMutate(
      gql`
        mutation (
          $line: Int
          $startLine: Int
          $subjectType: PullRequestReviewThreadSubjectType!
          $path: String!
          $body: String!
          $pullRequestReviewId: ID!
        ) {
          addPullRequestReviewThread(
            input: {
              subjectType: $subjectType
              line: $line
              startLine: $startLine
              path: $path
              body: $body
              pullRequestReviewId: $pullRequestReviewId
            }
          ) {
            __typename
          }
        }
      `,
      {
        line,
        startLine,
        subjectType,
        path,
        body,
        pullRequestReviewId,
      }
    );

    console.log("=>", `posted ${subjectType} comment to ${path}`);

    setTimeout(() => repostComment(i + 1), 500);
  }

  void repostComment(0);
})();
