import { Api } from "@/configs/api.config"
import type { Teacher } from "@/types"

export const teachersService = {
  getTeachers: async (params: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

    const endpoint = `/teachers?${queryParams.toString()}`
    const response = await Api.get(endpoint)
    return response.data
  },

  getTeacherById: async (id: number): Promise<Teacher> => {
    const response = await Api.get(`/teachers/${id}`)
    return response.data
  },

  createTeacher: async (teacherData: Omit<Teacher, "id">): Promise<Teacher> => {
    const response = await Api.post(`/teachers`, teacherData)
    return response.data
  },

  updateTeacher: async (id: number, data: Partial<Teacher>): Promise<Teacher> => {
    const response = await Api.put(`/teachers/${id}`, data)
    return response.data
  },

  deleteTeacher: async (id: number): Promise<void> => {
    const response = await Api.delete(`/teachers/${id}`)
    return response.data
  }
}
