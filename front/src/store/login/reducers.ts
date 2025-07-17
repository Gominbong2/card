// login/reducers.ts (수정된 코드)

import * as T from "./types";
// import { Reducer, AnyAction } from 'redux'; // 기존
import { Reducer, UnknownAction } from "redux"; // 변경: AnyAction 대신 UnknownAction 사용

const initialState: T.AuthState = {
  loginId: null,
  id: null,
};

// Reducer의 액션 타입을 UnknownAction으로 변경합니다.
export const reducer: Reducer<T.AuthState, UnknownAction> = (
  // 변경
  state: T.AuthState = initialState,
  action: UnknownAction // 변경
): T.AuthState => {
  switch (action.type) {
    // 유저 로그인 아이디
    case "@auth/setLoginId":
      // UnknownAction을 사용하면 여기서 action.payload에 직접 접근하기 전에
      // 타입 단언(as T.SetLoginIdAction)이 필요할 수 있습니다.
      // TypeScript는 switch/case 문을 통해 action.type을 좁히지만,
      // UnknownAction은 payload의 존재 여부를 미리 알 수 없기 때문입니다.
      return {
        ...state,
        loginId: (action as T.SetLoginIdAction).payload, // 타입 단언
      };
    // 유저 기본키값
    case "@auth/setUserId":
      return {
        ...state,
        id: (action as T.SetUserIdAction).payload, // 타입 단언
      };

    default:
      return state;
  }
};
