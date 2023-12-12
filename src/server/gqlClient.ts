import { graphql } from "@octokit/graphql";
import { AUTH_TOKEN } from "./consts.server";
import type { GQLMutation, GQLQuery } from "./types.server";

const gqlClient = graphql.defaults({
  headers: {
    authorization: `token ${AUTH_TOKEN}`,
  },
});

export const gqlQuery = (...args: Parameters<typeof gqlClient>) =>
  gqlClient(...args) as Promise<GQLQuery>;

export const gqlMutate = (...args: Parameters<typeof gqlClient>) =>
  gqlClient(...args) as Promise<GQLMutation>;
