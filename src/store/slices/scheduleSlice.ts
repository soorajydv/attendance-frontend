import { teachersService } from "@/services/teachersService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ScheduleState {
  subjects: [];
  classes: [];
  sections: [];
  periods: []
  loading: boolean;
  error?: string;
}

const initialState: ScheduleState = {
  subjects: [],
  classes: [],
  sections: [],
  periods: [],
  loading: false,
};

export const fetchScheduleOptions = createAsyncThunk(
  "schedule/fetchScheduleOptions",
  async (id: string, { rejectWithValue }) => {
    console.log("id",id);
    
    try {
          const res = await teachersService.fetchSchedule(id)
          console.log("res.data",res.data);
          
          return res.data
    } catch (error:any) {
    return rejectWithValue(error.message || "Failed to fetch schedule")
    }
  }
)

// Async thunk to update schedules
export const updateSchedules = createAsyncThunk(
  'schedule/updateSchedules',
  async (payload: { id: string; schedule: any[] }, { rejectWithValue }) => {
    try {
      const response = await teachersService.updateSchedule(payload.id, { schedule: payload.schedule });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleOptions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchScheduleOptions.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload", action.payload);

        state.subjects = action.payload.subjects;
        state.classes = action.payload.classes;
        state.periods = action.payload.periods;

        // Extract unique section names
        const sectionsSet = new Set(action.payload.classes.map((cls:any) => cls.section));
        state.sections = Array.from(sectionsSet) as any;
      })

      .addCase(fetchScheduleOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default scheduleSlice.reducer;
