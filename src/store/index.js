import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";


export default configureStore({
  reducer: {
    // 用户信息
    user: userReducer
  }
})











