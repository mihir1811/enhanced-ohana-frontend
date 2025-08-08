import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  global: boolean;
  pages: Record<string, boolean>;
}

const initialState: LoadingState = {
  global: false,
  pages: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<{ page: string; loading: boolean }>) => {
      if (action.payload.loading) {
        state.pages[action.payload.page] = true;
      } else {
        delete state.pages[action.payload.page];
      }
    },
  },
});

export const { setGlobalLoading, setPageLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
