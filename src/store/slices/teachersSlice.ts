import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Teacher } from "@/types";
import { teachersService } from "@/services/teachersService";

interface TeachersState {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: TeachersState = {
  teachers: [],
  currentTeacher: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (params: { page?: number; limit?: number; search?: string; gender?: string; isVerified?: boolean }, { rejectWithValue }) => {
    try {
      const response = await teachersService.getTeachers(params);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch teachers";
      return rejectWithValue(message);
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  "teachers/fetchTeacherById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teachersService.getTeacherById(id);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);

export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (teacherData: any, { rejectWithValue }) => {
    try {
      const response = await teachersService.createTeacher(teacherData);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to create teacher";
      return rejectWithValue(message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await teachersService.updateTeacher(id, data);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update teacher";
      return rejectWithValue(message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async (id: string, { rejectWithValue }) => {
    try {
      await teachersService.deleteTeacher(id);
      return id;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete teacher";
      return rejectWithValue(message);
    }
  }
);

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTeacher: (state, action: PayloadAction<Teacher | null>) => {
      state.currentTeacher = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teachers = action.payload.teachers;
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 1,
        };
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeacher = action.payload.data || action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create teacher
      .addCase(createTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        const newTeacher = action.payload.data || action.payload;
        state.teachers.push(newTeacher);
        state.currentTeacher = newTeacher;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update teacher
      .addCase(updateTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTeacher = action.payload.data || action.payload;
        const index = state.teachers.findIndex((t) => t._id === updatedTeacher._id);
        if (index !== -1) {
          state.teachers[index] = updatedTeacher;
        }
        if (state.currentTeacher?._id === updatedTeacher._id) {
          state.currentTeacher = updatedTeacher;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete teacher
      .addCase(deleteTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.teachers = state.teachers.filter((t) => t._id !== deletedId);
        if (state.currentTeacher?._id === deletedId) {
          state.currentTeacher = null;
        }
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentTeacher } = teachersSlice.actions;
export default teachersSlice.reducer;