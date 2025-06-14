import type { Subject } from "@/types"
import { API_ENDPOINTS } from "@/constants"
import { Api } from "@/configs/api.config"

class SubjectsService {
  async getSubjects() {
    const response = await Api.get('/subjects')
    const result = response.data.data
    return { subjects: result.subjects, pagination:result.pagination }
  }

  async getSubjectById(id: string){
    const response = await Api.get(`/subjects/${id}`)
    return response.data
  }

  async addSubject(subjectData: Subject) {
    const response = await Api.post('/subjects', subjectData)
    return response.data
  }

  async updateSubject(id: string, data: Partial<Subject>){
    const response = await Api.patch(`/subjects/${id}`, data)
    return response.data
  }

  async deleteSubject(id: string): Promise<void> {
    const response = await Api.delete(`/subjects/${id}`)
    return response.data
  }
}

export const subjectsService = new SubjectsService()
