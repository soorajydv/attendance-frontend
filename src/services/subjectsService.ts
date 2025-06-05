import type { Subject } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

class SubjectsService {
  async getSubjects(): Promise<Subject[]> {
    const response = await Api.get<Subject[]>(API_ENDPOINTS.SUBJECTS)
    return response.data
  }

  async getSubjectById(id: number): Promise<Subject> {
    const response = await Api.get<Subject>(`${API_ENDPOINTS.SUBJECTS}/${id}`)
    return response.data
  }

  async createSubject(subjectData: Omit<Subject, "id">): Promise<Subject> {
    const response = await Api.post<Subject>(API_ENDPOINTS.SUBJECTS, subjectData)
    return response.data
  }

  async updateSubject(id: number, data: Partial<Subject>): Promise<Subject> {
    const response = await Api.put<Subject>(`${API_ENDPOINTS.SUBJECTS}/${id}`, data)
    return response.data
  }

  async deleteSubject(id: number): Promise<void> {
    const response = await Api.delete<void>(`${API_ENDPOINTS.SUBJECTS}/${id}`)
    return response.data
  }
}

export const subjectsService = new SubjectsService()
