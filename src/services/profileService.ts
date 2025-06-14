import { Api } from "@/configs/api.config"

export const profileService = {
    getProfile: async(params:{id:string}) =>{
        const response = await Api.get(`/profile/${params.id}`);
        return response.data;
    }
}