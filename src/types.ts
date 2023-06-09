export type GQLConnection<
  K extends string,
  E extends GQLEdge<string, unknown>
> = GQLObj<K> & {
  edges?: E[];
};

export type GQLEdge<K extends string, T> = GQLObj<K> & {
  node?: T;
};

export type GQLObj<K extends string> = {
  __typename?: K;
};

export type GQLQuery = GQLObj<"Query"> & {
  repository?: Repository;
};

export type Issue = GQLObj<"Issue"> & {
  title: string;
};

export type IssueEdge = GQLEdge<"IssueEdge", Issue>;
export type IssueConnection = GQLConnection<"IssueConnection", IssueEdge>;

export type PullRequest = GQLObj<"PullRequest"> & {
  title?: string;
  reviews?: ReviewConnection;
};

export type PullRequestEdge = GQLEdge<"PullRequestEdge", PullRequest>;
export type PullRequestConnection = GQLConnection<
  "PullRequestConnection",
  PullRequestEdge
>;

export type Review = GQLObj<"Review"> & {
  author?: Actor;
  createdAt?: string;
};

export type ReviewEdge = GQLEdge<"ReviewEdge", Review>;
export type ReviewConnection = GQLConnection<"ReviewConnection", ReviewEdge>;

export type Actor = User;

export type User = GQLObj<"User"> & {
  login?: string;
};

export type Repository = GQLObj<"Repository"> & {
  issues?: IssueConnection;
  pullRequests?: PullRequestConnection;
};
