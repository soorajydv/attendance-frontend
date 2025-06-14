import type { Section } from "@/types";
import { Api } from "@/configs/api.config";

class SectionsService {
  async getSections(params: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await Api.get(`/sections?${queryParams.toString()}`);
    const result = response.data.data;
    return { sections: result.sections, pagination: result.pagination };
  }

  async getSectionById(id: string) {
    const response = await Api.get(`/sections/${id}`);
    return response.data;
  }

  async createSection(data: { name: string; classId: string }) {
    const response = await Api.post("/sections", data);
    return response.data;
  }

  async updateSection(id: string, data: Partial<Section>) {
    const response = await Api.patch(`/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: string) {
    const response = await Api.delete(`/sections/${id}`);
    return response.data;
  }
}

export const sectionsService = new SectionsService();
