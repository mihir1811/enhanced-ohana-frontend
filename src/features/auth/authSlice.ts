import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  userName: string
  role: 'seller' | 'user' | 'admin'
  profilePicture?: string
}

interface AuthState {
  role: User['role'] | null
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  role: null,
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user
      state.role = action.payload.user.role
      state.token = action.payload.token
    },
    logout: (state) => {
      state.user = null
      state.role = null
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
