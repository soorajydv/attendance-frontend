import type { Student, PaginatedResponse } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

class StudentsService {
  async getStudents(params: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Student>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

    const endpoint = `${API_ENDPOINTS.STUDENTS}?${queryParams.toString()}`
  const response = await Api.get<PaginatedResponse<Student>>(endpoint)
  return response.data
  }

  async getStudentById(id: number): Promise<Student> {
  const response = await Api.get<Student>(`${API_ENDPOINTS.STUDENTS}/${id}`)
  return response.data
  }

  async createStudent(studentData: Omit<Student, "id">): Promise<Student> {
  const response = await Api.post<Student>(API_ENDPOINTS.STUDENTS, studentData)
  return response.data
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
  const response = await Api.put<Student>(`${API_ENDPOINTS.STUDENTS}/${id}`, data)
  return response.data
  }

  async deleteStudent(id: number): Promise<void> {
  const response = await Api.delete<void>(`${API_ENDPOINTS.STUDENTS}/${id}`)
  return response.data
  }
}

export const studentsService = new StudentsService()
