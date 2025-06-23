
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { scheduleService } from "@/services/scheduleService";
import { Schedule, ScheduleOptions, CreateScheduleData, UpdateScheduleData } from "@/types/index";

interface ScheduleState {
  schedules: Schedule[];
  scheduleOptions: ScheduleOptions | null;
  loading: boolean;
  error?: string;
  selectedSchedule: Schedule | null;
}

const initialState: ScheduleState = {
  schedules: [],
  scheduleOptions: null,
  loading: false,
  error: undefined,
  selectedSchedule: null,
};

export const fetchScheduleOptions = createAsyncThunk(
  "schedule/fetchScheduleOptions",
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const response = await scheduleService.fetchScheduleByTeacherId(teacherId);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch schedule options";
      return rejectWithValue(message);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData: CreateScheduleData, { rejectWithValue }) => {
    try {
      const response = await scheduleService.addSchedule(scheduleData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create schedule";
      return rejectWithValue(message);
    }
  }
);

export const updateSchedules = createAsyncThunk(
  "schedule/updateSchedules",
  async (payload: { id: string; schedule: UpdateScheduleData[] }, { rejectWithValue }) => {
    try {
      const response = await scheduleService.updateSchedule(payload.id, payload.schedule);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update schedule";
      return rejectWithValue(message);
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedule/deleteSchedule",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await scheduleService.deleteSchedule(id);
      return { id, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete schedule";
      return rejectWithValue(message);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSelectedSchedule: (state, action: PayloadAction<Schedule | null>) => {
      state.selectedSchedule = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleOptions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchScheduleOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload || [];
        state.scheduleOptions = {
          subjects: action.payload?.subjects || [],
          classes: action.payload?.classes || [],
          sections: action.payload?.sections || [],
          periods: action.payload?.periods || [],
        };
      })
      .addCase(fetchScheduleOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSchedules.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateSchedules.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSchedule = action.payload;
        const index = state.schedules.findIndex((s: { _id: any; }) => s._id === updatedSchedule._id);
        if (index !== -1) {
          state.schedules[index] = updatedSchedule;
        }
      })
      .addCase(updateSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.schedules = state.schedules.filter((s: { _id: string; }) => s._id !== deletedId);
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSchedule, clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
