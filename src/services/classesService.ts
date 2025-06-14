import type { Class } from "@/types"
import { Api } from "@/configs/api.config"

class ClassesService {
  async getClasses(params:{page:number | undefined,limit:number | undefined, search:string | undefined}){
        const queryParams = new URLSearchParams()
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)

  const response = await Api.get(`/classes?${queryParams.toString()}`)
  const result =  response.data.data
  return { classes: result.classes, pagination: result.pagination }
  }

  async getClassById(id: string) {
  const response = await Api.get(`/classes/${id}`)
  return response.data
  }

  async createClass(classData: {name:string,code?:string}) {
  const response = await Api.post('/classes', classData)
  return response.data
  }

  async updateClass(id: string, data: Partial<Class>) {
  const response = await Api.patch(`/classes/${id}`, data)
  return response.data
  }

  async deleteClass(id: string) {
  const response = await Api.delete(`/classes/${id}`)
  return response.data
  }
}

export const classesService = new ClassesService()
