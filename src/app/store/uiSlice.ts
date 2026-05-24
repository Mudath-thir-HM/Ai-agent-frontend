import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  sidebarCollapsed: boolean;
  isCanvasOpen: boolean;
}

const THEME_KEY = "astra_theme";

function loadTheme(): "light" | "dark" {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "dark";
}

const initialState: UIState = {
  theme: loadTheme(),
  sidebarCollapsed: false,
  isCanvasOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, state.theme);
      } catch {}
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
      try {
        localStorage.setItem(THEME_KEY, action.payload);
      } catch {}
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setCanvasOpen(state, action: PayloadAction<boolean>) {
      state.isCanvasOpen = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setCanvasOpen } = uiSlice.actions;
export default uiSlice.reducer;
