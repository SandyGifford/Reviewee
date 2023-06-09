import { graphql } from "@octokit/graphql";
import { AUTH_TOKEN } from "./consts.server";
import type { GQLQuery } from "./types.server";

const gqlClient = graphql.defaults({
  headers: {
    authorization: `token ${AUTH_TOKEN}`,
  },
});

export const gqlRequest = (...args: Parameters<typeof gqlClient>) =>
  gqlClient(...args) as Promise<GQLQuery>;
