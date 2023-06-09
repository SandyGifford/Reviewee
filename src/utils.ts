export const filterFalsy = <T>(items?: T[]) =>
  (items?.filter((i) => !!i) || []) as Exclude<
    T,
    null | undefined | false | 0 | ""
  >[];

export const gql = String.raw;
