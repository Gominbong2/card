import type * as T from "./types";

export const setLoginId = (payload: string): T.SetLoginIdAction => ({
  type: "@auth/setLoginId",
  payload,
});

export const setUserId = (payload: number): T.SetIdAction => ({
  type: "@auth/setUserId",
  payload,
});
