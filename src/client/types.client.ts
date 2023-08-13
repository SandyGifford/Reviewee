import { StoreData } from "../server/store";

/**
 * Creates type `T` which is constrained to type `U`
 */
export type Satisfies<U, T extends U> = T;

export type ReviewsByResponse = {
  submittedAt: string;
  login: string;
  id: string;
};

export type WSEventName = "MAIN_DATA";

export type WSEventDataMap = Satisfies<
  Record<WSEventName, unknown>,
  {
    MAIN_DATA: StoreData;
  }
>;
