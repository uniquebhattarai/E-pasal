import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthModalMode = "login" | "signup" | "verify-email";

export interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
}

export interface AuthState {
  signupData: any;
  loading: boolean;
  token: string | null;
  authModal: AuthModalState;
}

const initialState: AuthState = {
  signupData: null,
  loading: false,
  token: null,
  authModal: {
    isOpen: false,
    mode: "login",
  },
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setSignupData(state, action: PayloadAction<any>) {
      state.signupData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    openAuthModal(state, action: PayloadAction<AuthModalMode | undefined>) {
      state.authModal = {
        isOpen: true,
        mode: action.payload || "login",
      };
    },
    closeAuthModal(state) {
      state.authModal.isOpen = false;
    },
    setAuthModalMode(state, action: PayloadAction<AuthModalMode>) {
      state.authModal.mode = action.payload;
    },
  },
});

export const {
  setToken,
  setSignupData,
  setLoading,
  openAuthModal,
  closeAuthModal,
  setAuthModalMode,
} = AuthSlice.actions;

export default AuthSlice.reducer;
