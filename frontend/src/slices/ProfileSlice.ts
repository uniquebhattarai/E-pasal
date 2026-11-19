import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

export interface ProfileState {
  user: User | null;
  loading: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = ProfileSlice.actions;

export default ProfileSlice.reducer;
