import type { AuthState, LoginFormData, SignupFormData, User } from "@/types"
import { Api } from "@/configs/api.config"

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await Api.post(`/auth/login`, credentials)
    return response.data.data;
  },

  signup: async (userData: SignupFormData) => {
    const response = await Api.post(`/auth/signup`, userData)
    return response.data.data
  },

  logout: async () => {
    // Optional: You can make a backend call or just clear client state
    return null
  },
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}