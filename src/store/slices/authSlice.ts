import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User, LoginFormData, SignupFormData } from "@/types"
import { authService, initialState } from "@/services/authService"

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed")
    }
  }
)

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: SignupFormData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Signup failed")
    }
  }
)

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Signup failed")
    }
  }
)

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({email, otp, newPassword}:any, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(email,otp,newPassword)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Signup failed")
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
  },
})

export const { clearError, setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
