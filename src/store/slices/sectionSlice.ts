import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Section } from "@/types";
import { sectionsService } from "@/services/secionService";

interface SectionsResponse {
  sections: Section[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SectionsState {
  sections: Section[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: SectionsState = {
  sections: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchSections = createAsyncThunk<SectionsResponse, { page?: number; limit?: number; search?: string }>(
  "sections/fetchSections",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await sectionsService.getSections({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch sections");
    }
  }
);

export const addSection = createAsyncThunk<Section, { name: string; classId: string }>(
  "sections/addSection",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sectionsService.createSection(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create section");
    }
  }
);

export const updateSection = createAsyncThunk<Section, { id: string; payload: { name: string; classId: string } }>(
  "sections/updateSection",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await sectionsService.updateSection(id, payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update section");
    }
  }
);

export const deleteSection = createAsyncThunk<string, { id: string }>(
  "sections/deleteSection",
  async ({ id }, { rejectWithValue }) => {
    try {
      await sectionsService.deleteSection(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete section");
    }
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = action.payload.sections;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(addSection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections.push(action.payload);
        state.pagination.total += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(addSection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = state.sections.map((sec) =>
          sec._id === action.payload._id ? action.payload : sec
        );
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = state.sections.filter((sec) => sec._id !== action.payload);
        state.pagination.total -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = sectionsSlice.actions;
export default sectionsSlice.reducer;
