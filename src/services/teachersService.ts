import { Api } from "@/configs/api.config"
import type { Teacher } from "@/types"

export const teachersService = {
  getTeachers: async (params: { page?: number; limit?: number; search?: string, isVerified?: boolean }) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)
    if (params.isVerified !== undefined) queryParams.set("isVerified", String(params.isVerified))

    const endpoint = `/teachers?${queryParams.toString()}`
    const response = await Api.get(endpoint)
    const result = response.data.data
    
    return {
      teachers: result.teachers,
      pagination:result.pagination
    }
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    const response = await Api.get(`/teachers/${id}`)
    return response.data
  },

  createTeacher: async (teacherData: Omit<Teacher, "id">): Promise<Teacher> => {
    const response = await Api.post(`/teachers`, teacherData)
    return response.data
  },

  updateTeacher: async (id: string, data: Partial<Teacher>): Promise<Teacher> => {
    const response = await Api.put(`/teachers/${id}`, data)
    return response.data
  },

  deleteTeacher: async (id: string): Promise<void> => {
    const response = await Api.delete(`/teachers/${id}`)
    return response.data
  },

  fetchSchedule: async (id: string) => {
    const response = await Api.get(`/teachers/schedule/options`)
    return response.data
  },

  updateSchedule: async (teacherId: string, scheduleData: any): Promise<any> => {
    const response = await Api.patch(`/teachers/${teacherId}/schedule`, scheduleData)
    return response.data
  }
}
