import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Class } from "@/types";
import { classesService } from "@/services/classesService";

// Define the shape of the API response for classes
interface ClassesResponse {
  classes: Class[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Define the state shape
interface ClassesState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ClassesState = {
  classes: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Fetch classes with pagination
export const fetchClasses = createAsyncThunk<ClassesResponse, { page?: number; limit?: number, search?:string }>(
  "classes/fetchClasses",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await classesService.getClasses({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch classes");
    }
  }
);

// Create a new class
export const addClass = createAsyncThunk<Class, { name: string; code?: string }>(
  "classes/addClass",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await classesService.createClass(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create class");
    }
  }
);

//Update class
export const updateClass = createAsyncThunk<Class, { id: string; payload: { name: string; code?: string; userId?: string } }>(
  "classes/updateClass",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await classesService.updateClass(id, payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update class");
    }
  }
);

// Delete a class
export const deleteClass = createAsyncThunk<string, { id: string }>(
  "classes/deleteClass",
  async ({ id }, { rejectWithValue }) => {
    try {
      await classesService.deleteClass(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete class");
    }
  }
);

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload.classes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Class
      .addCase(addClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes.push(action.payload); // Append the new class
        state.pagination.total += 1; // Update total count
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(addClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = state.classes.map((cls) =>
          cls._id === action.payload._id ? action.payload : cls
        );
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = state.classes.filter((cls) => cls._id !== action.payload); // Remove the deleted class
        state.pagination.total -= 1; // Update total count
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = classesSlice.actions;
export default classesSlice.reducer;