import * as T from "./types";

const initialState: T.AuthState = {
  loginId: null,
  id: null,
};

export const reducer = (
  state: T.AuthState = initialState,
  action: T.Actions | any
): T.AuthState => {
  switch (action.type) {
    // 유저 로그인 아이디
    case "@auth/setLoginId":
      return {
        ...state,
        loginId: action.payload,
      };
    // 유저 기본키값
    case "@auth/setUserId":
      return {
        ...state,
        id: action.payload,
      };

    default:
      return state;
  }
};
