export const filterFalsy = <T>(items?: T[]) =>
  (items?.filter((i) => !!i) || []) as Exclude<
    T,
    null | undefined | false | 0 | ""
  >[];

export const assertChain = <T>(val: T, error: () => Error): NonNullable<T> => {
  if (val === undefined) throw error();
  return val as NonNullable<T>;
};

export const mapObject = <T extends {}, KR extends string, KV>(
  obj: T,
  predicate: (entry: [key: keyof T, val: T[keyof T]]) => [KR, KV]
): Record<KR, KV> =>
  typedEntries(obj).reduce((acc, entry) => {
    const [key, value] = predicate(entry);
    acc[key] = value;
    return acc;
  }, {} as Record<KR, KV>);

/**
 * Creates an object by mapping over an array
 * @param arr The array to map over
 * @param cb A function which returns a [key, value] pair
 * @returns An object
 */
export const mapToObject = <T, K extends string, V>(
  arr: readonly T[],
  cb: (item: T) => [K, V]
): { [KEY in K]: V } =>
  arr.reduce((map, item) => {
    const [key, value] = cb(item);
    map[key] = value;
    return map;
  }, {} as { [KEY in K]: V });

/**
 * Creates an Map by mapping over an array
 * @param arr The array to map over
 * @param cb A function which returns a [key, value] pair
 * @returns An Map
 */
export const mapToMap = <T, K, V>(
  arr: readonly T[],
  cb: (item: T) => [K, V]
): Map<K, V> => new Map(arr.map(cb));

/**
 * The same as Object.keys but with strongly typed return
 * @param obj The object to get the keys of
 * @returns The keys of the object (strongly typed)
 */
export const typedKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];
/**
 * The same as Object.values but with strongly typed return
 * @param obj The object to get the values of
 * @returns The values of the object (strongly typed)
 */
export const typedValues = <T extends object>(obj: T) =>
  Object.values(obj) as T[keyof T][];
/**
 * The same as Object.entries but with strongly typed return
 * @param obj The object to get the entries of
 * @returns The entries of the object (strongly typed)
 */
export const typedEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];
