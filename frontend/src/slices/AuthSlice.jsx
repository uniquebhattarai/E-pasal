import { createSlice } from "@reduxjs/toolkit";

// Token is now stored in an httpOnly cookie — NOT in localStorage.
// We keep a boolean `isLoggedIn` flag in Redux (derived from user presence)
// so the app knows if the user is authenticated after a page refresh.
const initialState = {
  signupData: null,
  loading: false,
  token: null,  // no longer read from localStorage
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setToken, setSignupData, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;