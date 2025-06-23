import type { Subject } from "@/types"
import { Api } from "@/configs/api.config"

class SubjectsService {
  async getSubjects(params: { page?: number; limit?: number; search?: string}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

    const response = await Api.get(`/subjects?${queryParams.toString()}`)
    return response.data
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
