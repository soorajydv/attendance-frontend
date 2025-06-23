
import { Api } from "@/configs/api.config";
import { Schedule, CreateScheduleData, UpdateScheduleData, ScheduleFilters } from "@/types/index";

class ScheduleService {
  getSchedules = async (params: {
    organizationId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    day?: string;
  }) => {
    const { organizationId, page = 1, limit = 10, search, status, day } = params;
    const query = new URLSearchParams({
      organizationId,
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(day && { day }),
    });
    const response = await Api.get(`/schedules?${query}`);
    const result = response.data;
    return { schedules: result.schedules, pagination: result.pagination };
  };

  getScheduleById = async (id: string) => {
    const response = await Api.get(`/schedules/${id}`);
    return response.data;
  };

  addSchedule = async (scheduleData: CreateScheduleData) => {
    const response = await Api.post("/schedules", scheduleData);
    return response.data;
  };

  updateSchedule = async (id: string, data: UpdateScheduleData[]) => {
    const response = await Api.patch(`/schedules/${id}`, data);
    return response.data;
  };

  deleteSchedule = async (id: string) => {
    const response = await Api.delete(`/schedules/${id}`);
    return response.data;
  };

  fetchScheduleByTeacherId = async (teacherId: string) => {
    const response = await Api.get(`/schedules/${teacherId}`);
    return response.data;
  };
}

export const scheduleService = new ScheduleService();
