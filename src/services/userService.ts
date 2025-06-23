
import type { User } from "@/types"
import { Api } from "@/configs/api.config"

export const userService = {
  getUserById: async(id: string) =>{
  const response = await Api.get(`/users/${id}`)
  return response.data
  },

  createUser:async(user: Partial<User>) =>{
  const response = await Api.post(`/auth/register`, user)
  return response.data
  },

  updateUser: async(id: string, data: Partial<User>) =>{
  const response = await Api.patch(`/users/${id}`, data)
  return response.data
  },

  deleteUser: async(id: string)=>{
  const response = await Api.delete(`users/${id}`)
  return response.data
  },
}
