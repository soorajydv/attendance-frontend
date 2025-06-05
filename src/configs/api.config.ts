// src/configs/api.config.ts
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

import { getCookie } from "@/utils/cookies.utils"
import axios from "axios"

export const Api = axios.create({
  baseURL: BACKEND_URL,
})

// Add the token automatically
Api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getCookie("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
