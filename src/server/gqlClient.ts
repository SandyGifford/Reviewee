import { AUTH_TOKEN } from "./consts";
import type { GQLQuery } from "./types";
import { graphql } from "@octokit/graphql";

const gqlClient = graphql.defaults({
	headers: {
		authorization: `token ${AUTH_TOKEN}`,
	},
});

export const gqlRequest = (...args: Parameters<typeof gqlClient>) =>
	gqlClient(...args) as Promise<GQLQuery>;
