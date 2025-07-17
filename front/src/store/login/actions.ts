// types.ts (최종 확인)

import type { Action } from "redux"; // Redux에서 Action 타입을 'type' 임포트합니다.

// State 타입 정의
export type AuthState = {
  loginId: string | null;
  id: number | null;
};

// SetLoginIdAction 정의
export interface SetLoginIdAction extends Action<"@auth/setLoginId"> {
  // type 리터럴을 명시적으로 제네릭으로 전달
  payload: string;
}

// SetUserIdAction 정의 (이전 SetIdAction의 이름을 변경하고 일관성 유지)
export interface SetUserIdAction extends Action<"@auth/setUserId"> {
  // type 리터럴을 명시적으로 제네릭으로 전달
  payload: number;
}

// 모든 액션 타입의 유니온.
// 만약 다른 리듀서가 있다면 해당 리듀서의 모든 액션 타입도 이곳에 포함되어야 합니다.
export type Actions = SetLoginIdAction | SetUserIdAction;
