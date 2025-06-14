import { Api } from "@/configs/api.config"

export const adminService = {
    getDashboardSummary : async() =>{
        const response = await Api.get('/admin/dashboard');
        return response.data.data;
    }
}