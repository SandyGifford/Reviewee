export type GQLConnection<
  K extends string,
  T,
  EK extends string,
  E extends GQLEdge<EK, T>
> = GQLObj<K> & {
  edges?: E[];
  nodes?: T[];
  totalCount?: number;
  pageInfo?: GQLPageInfo;
};

export type GQLPageInfo = GQLObj<"PageInfo"> & {
  endCursor?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string;
};

export type GQLEdge<K extends string, T> = GQLObj<K> & {
  node?: T;
  cursor?: string;
};

export type GQLObj<K extends string> = {
  __typename?: K;
};

export type GQLObjWithId<K extends string> = {
  __typename?: K;
  id?: string;
};

export type GQLQuery = GQLObj<"Query"> & {
  repository?: Repository;
};

export type Issue = GQLObjWithId<"Issue"> & {
  title: string;
};

export type IssueEdge = GQLEdge<"IssueEdge", Issue>;
export type IssueConnection = GQLConnection<
  "IssueConnection",
  Issue,
  "IssueEdge",
  IssueEdge
>;

export type PullRequest = GQLObjWithId<"PullRequest"> & {
  title?: string;
  reviews?: ReviewConnection;
};

export type PullRequestEdge = GQLEdge<"PullRequestEdge", PullRequest>;
export type PullRequestConnection = GQLConnection<
  "PullRequestConnection",
  PullRequest,
  "PullRequestEdge",
  PullRequestEdge
>;

export type Review = GQLObjWithId<"Review"> & {
  author?: Actor;
  createdAt?: string;
  submittedAt?: string;
};

export type ReviewEdge = GQLEdge<"ReviewEdge", Review>;
export type ReviewConnection = GQLConnection<
  "ReviewConnection",
  Review,
  "ReviewEdge",
  ReviewEdge
>;

export type Actor = User;

export type User = GQLObjWithId<"User"> & {
  login?: string;
};

export type Repository = GQLObjWithId<"Repository"> & {
  issues?: IssueConnection;
  pullRequests?: PullRequestConnection;
};
