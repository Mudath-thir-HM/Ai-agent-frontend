import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../types";

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "AgentCee_access_token";

function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  accessToken: loadToken(),
  user: null,
  isAuthenticated: !!loadToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ access_token: string; user: UserProfile }>,
    ) {
      state.accessToken = action.payload.access_token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      try {
        localStorage.setItem(TOKEN_KEY, action.payload.access_token);
      } catch {}
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {}
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
