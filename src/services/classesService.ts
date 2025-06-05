import type { Class } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

class ClassesService {
  async getClasses(): Promise<Class[]> {
  const response = await Api.get<Class[]>(API_ENDPOINTS.CLASSES)
  return response.data
  }

  async getClassById(id: number): Promise<Class> {
  const response = await Api.get<Class>(`${API_ENDPOINTS.CLASSES}/${id}`)
  return response.data
  }

  async createClass(classData: Omit<Class, "id">): Promise<Class> {
  const response = await Api.post<Class>(API_ENDPOINTS.CLASSES, classData)
  return response.data
  }

  async updateClass(id: number, data: Partial<Class>): Promise<Class> {
  const response = await Api.put<Class>(`${API_ENDPOINTS.CLASSES}/${id}`, data)
  return response.data
  }

  async deleteClass(id: number): Promise<void> {
  const response = await Api.delete<void>(`${API_ENDPOINTS.CLASSES}/${id}`)
  return response.data
  }
}

export const classesService = new ClassesService()
