
import type { Bus } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

export const busesService = {
  getBuses: async (params: { page?: number; limit?: number; search?: string, isVerified?: boolean }) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

  const response = await Api.get(`/buses?${queryParams.toString()}`)
  return response.data.data
  },

  getBusById: async(id: number): Promise<Bus> =>{
  const response = await Api.get<Bus>(`${API_ENDPOINTS.BUSES}/${id}`)
  return response.data
  },

  createBus:async(busData: Partial<Bus>) =>{
  const response = await Api.post(`/buses`, busData)
  return response.data.data
  },

  updateBus: async(id: string, data: Partial<Bus>) =>{
  const response = await Api.patch(`/buses/${id}`, data)
  return response.data.data
  },

  deleteBus: async(id: string)=>{
  const response = await Api.delete(`buses/${id}`)
  return response.data.data
  },

  getDrivers: async() =>{
  const response = await Api.get(`buses/drivers`)
  console.log("response",response.data);
  
  return response.data.data
  }
}
