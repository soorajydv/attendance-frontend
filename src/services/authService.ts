import type { AuthState, LoginFormData, SignupFormData, User } from "@/types"
import { BACKEND_URL } from "@/configs/api.config"
import axios from "axios"

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials)
    return response.data // assumes response contains { user, token }
  },

  signup: async (userData: SignupFormData) => {
    const response = await axios.post(`${BACKEND_URL}/auth/signup`, userData)
    console.log("response",response);
    
    return response.data
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