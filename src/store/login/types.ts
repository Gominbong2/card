import type { Action } from "redux";

// State 타입 정의
export type AuthState = {
  loginId: string | null;
  id: number | null;
};

// Action 타입 정의
export type SetLoginIdAction = Action<"@auth/setLoginId"> & {
  payload: string;
};

export type SetIdAction = Action<"@auth/setUserId"> & {
  payload: number;
};

// 전체 액션 타입 정의
export type Actions = SetLoginIdAction | SetIdAction;
