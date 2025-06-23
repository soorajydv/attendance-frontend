import { Api } from "@/configs/api.config"

export const periodService = {

    getPeriodById: async (id: string) => {
        const response = await Api.get(`/periods/${id}`)
        return response.data
    },

    getPeriods: async (params: { page?: number; limit?: number; search?: string }) => {
        
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        if (params.search) queryParams.append("search", params.search)

        const response = await Api.get(`/periods?${queryParams.toString()}`)
        return response.data
    },

    createPeriod: async (period: any) => {
        const response = await Api.post(`/periods`, period)
        return response.data
    },

    updatePeriod: async (id: string, data: any) => {
        const response = await Api.patch(`/periods/${id}`, data)
        return response.data
    },

    deletePeriod: async (id: string) => {
        const response = await Api.delete(`periods/${id}`)
        return response.data
    },
}
