export type GQLConnection<
  K extends string,
  T,
  EK extends string,
  E extends GQLEdge<EK, T>
> = GQLObj<K> & {
  readonly edges?: E[];
  readonly nodes?: T[];
  readonly totalCount?: number;
  readonly pageInfo?: GQLPageInfo;
};

export type GQLPageInfo = GQLObj<"PageInfo"> & {
  readonly endCursor?: string;
  readonly hasNextPage?: boolean;
  readonly hasPreviousPage?: boolean;
  readonly startCursor?: string;
};

export type GQLEdge<K extends string, T> = GQLObj<K> & {
  readonly node?: T;
  readonly cursor?: string;
};

export type GQLObj<K extends string> = {
  readonly __typename?: K;
};

export type GQLObjWithId<K extends string> = {
  readonly __typename?: K;
  readonly id?: string;
};

export type GQLQuery = GQLObj<"Query"> & {
  readonly repository?: Repository;
};

export type GQLMutation = GQLObj<"Mutation"> & {
  readonly addPullRequestReview?: AddPullRequestReviewPayload;
};

export type AddPullRequestReviewPayload =
  GQLObj<"AddPullRequestReviewPayload"> & {
    readonly clientMutationId?: string;
    readonly pullRequestReview?: PullRequestReview;
    readonly reviewEdge?: PullRequestReviewEdge;
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

export type PullRequestReview = GQLObjWithId<"PullRequestReview"> & {
  readonly author?: Actor;
};

export type PullRequestReviewEdge = GQLEdge<
  "PullRequestReviewEdge",
  PullRequestReview
>;
export type PullRequestReviewConnection = GQLConnection<
  "PullRequestReviewConnection",
  PullRequestReview,
  "PullRequestReviewEdge",
  PullRequestReviewEdge
>;

export type PullRequest = GQLObjWithId<"PullRequest"> & {
  readonly title?: string;
  readonly reviews?: ReviewConnection;
  readonly files?: PullRequestChangedFileConnection;
};

export type PullRequestEdge = GQLEdge<"PullRequestEdge", PullRequest>;
export type PullRequestConnection = GQLConnection<
  "PullRequestConnection",
  PullRequest,
  "PullRequestEdge",
  PullRequestEdge
>;

export type PullRequestChangedFile = GQLObjWithId<"PullRequestChangedFile"> & {
  readonly path?: string;
};

export type PullRequestChangedFileEdge = GQLEdge<
  "PullRequestChangedFileEdge",
  PullRequestChangedFile
>;
export type PullRequestChangedFileConnection = GQLConnection<
  "PullRequestChangedFileConnection",
  PullRequestChangedFile,
  "PullRequestChangedFileEdge",
  PullRequestChangedFileEdge
>;

export type IssueComment = GQLObjWithId<"IssueComment"> & {
  readonly author?: Actor;
  readonly body?: string;
  readonly bodyHTML?: string;
  readonly bodyText?: string;
  readonly path?: string;
  readonly startLine?: number | null;
  readonly line?: number | null;
  readonly outdated?: boolean;
};

export type IssueCommentEdge = GQLEdge<"IssueCommentEdge", IssueComment>;
export type IssueCommentConnection = GQLConnection<
  "IssueCommentConnection",
  IssueComment,
  "IssueCommentEdge",
  IssueCommentEdge
>;

export type Review = GQLObjWithId<"Review"> & {
  readonly author?: Actor;
  readonly createdAt?: string;
  readonly submittedAt?: string;
  readonly comments?: IssueCommentConnection;
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
  readonly login?: string;
  readonly avatarUrl?: string;
  readonly resourcePath?: string;
  readonly url?: string;
};

export type Repository = GQLObjWithId<"Repository"> & {
  readonly issues?: IssueConnection;
  readonly pullRequests?: PullRequestConnection;
  readonly pullRequest?: PullRequest;
};
