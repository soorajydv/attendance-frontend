import type { Student } from "@/types"
import { Api } from "@/configs/api.config"

class StudentsService {
  async getStudents(params: {
    page?: number
    limit?: number
    search?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

  const endpoint = `/students?${queryParams.toString()}`
  const response = await Api.get(endpoint);
  return response.data.data
  }

  async getStudentById(id: string): Promise<Student> {
  const response = await Api.get<Student>(`/students/${id}`)
  return response.data
  }

  async createStudent(studentData: Omit<Student, "id">): Promise<Student> {
  const response = await Api.post<Student>(`/students`, studentData)
  return response.data
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  const response = await Api.put<Student>(`/students}/${id}`, data)
  return response.data
  }

  async deleteStudent(id: string): Promise<void> {
  const response = await Api.delete<void>(`/students/${id}`)
  return response.data
  }
}

export const studentsService = new StudentsService()
