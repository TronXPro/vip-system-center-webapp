import { createSlice } from "@reduxjs/toolkit";

const INIT_STATE = {
  username: '',
  walletAddress: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: INIT_STATE,
  reducers: {
    loginReducer:(state, action) => {
      return {...state, ...action.payload};
    },
    logoutReducer:(state, action) => INIT_STATE
  }
})

export const { loginReducer, logoutReducer } = userSlice.actions;

export default userSlice.reducer








