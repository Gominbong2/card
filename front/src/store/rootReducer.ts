// reducers.ts
import { combineReducers } from "@reduxjs/toolkit";
import * as L from "./login"; // login 리듀서를 가져옵니다.

const rootReducer = combineReducers({
  login: L.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
