import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SellerData } from '../auth/authSlice';
import { userService } from '@/services/user.service';
import { sellerService, UpdateSellerInfoPayload } from '@/services/sellerService';
// Fetch seller info using new API
export const fetchSellerInfo = createAsyncThunk(
  'seller/fetchSellerInfo',
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const response = await sellerService.getSellerInfo(sellerId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch seller info');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch seller info');
    }
  }
);

// New thunk for updating seller info with files (companyLogo, panCard, gstNumber)
export const updateSellerInfo = createAsyncThunk(
  'seller/updateSellerInfo',
  async (
    { data, token }: { data: UpdateSellerInfoPayload; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await sellerService.updateSellerInfo(data, token);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update seller info');
      }
    } catch (error) {
      return rejectWithValue('Failed to update seller info');
    }
  }
);

type SellerProfile = Omit<SellerData, 'taxId' | 'businessRegistration'> | SellerData | undefined | null;
interface SellerState {
  profile: SellerProfile;
  isLoading: boolean;
  error: string | null;
}

const initialState: SellerState = {
  profile: null,
  isLoading: false,
  error: null,
};


const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerProfile(state) {
      state.profile = null;
      state.error = null;
    },
    setSellerProfile(state, action: PayloadAction<any>) {
      state.profile = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSellerInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  // ...existing code...
  },
});

export const { clearSellerProfile } = sellerSlice.actions;
export default sellerSlice.reducer;
