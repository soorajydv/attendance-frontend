
import type { Bus } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

class BusesService {
  async getBuses(): Promise<Bus[]> {
  const response = await Api.get<Bus[]>(API_ENDPOINTS.BUSES)
  return response.data
  }

  async getBusById(id: number): Promise<Bus> {
  const response = await Api.get<Bus>(`${API_ENDPOINTS.BUSES}/${id}`)
  return response.data
  }

  async createBus(busData: Omit<Bus, "id">): Promise<Bus> {
  const response = await Api.post<Bus>(API_ENDPOINTS.BUSES, busData)
  return response.data
  }

  async updateBus(id: number, data: Partial<Bus>): Promise<Bus> {
  const response = await Api.put<Bus>(`${API_ENDPOINTS.BUSES}/${id}`, data)
  return response.data
  }

  async deleteBus(id: number): Promise<void> {
  const response = await Api.delete<void>(`${API_ENDPOINTS.BUSES}/${id}`)
  return response.data
  }
}

export const busesService = new BusesService()
