import { ReviewsByResponse } from "../client/types.client";

export type StoreData = readonly Readonly<ReviewsByResponse>[];

let storeData: StoreData = [];

export type StoreListener = (data: StoreData) => unknown;

export const listeners = new Set<StoreListener>();

export const store = Object.freeze({
  addListener: (cb: StoreListener) => {
    listeners.add(cb);
    cb(storeData);
  },
  removeListener: (cb: StoreListener) => void listeners.delete(cb),
  set: (data: StoreData): void => {
    storeData = data.map((data) => ({ ...data }));
    listeners.forEach((cb) => cb(data));
  },
  get: (): StoreData => storeData,
});
