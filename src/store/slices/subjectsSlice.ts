import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Subject } from "@/types"
import { subjectsService } from "@/services/subjectsService"

interface SubjectsState {
  subjects: Subject[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: SubjectsState = {
  subjects: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await subjectsService.getSubjects()
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch subjects"
      return rejectWithValue(errorMessage)
    }
  },
)

export const addSubject = createAsyncThunk(
  "subjects/addSubject",
  async (data: Subject, { rejectWithValue }) => {
    try {
      const response = await subjectsService.addSubject(data)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add subject"
      return rejectWithValue(errorMessage)
    }
  },
)

export const editSubject = createAsyncThunk(
  "subjects/editSubject",
  async (data: { id: string; payload: Subject }, { rejectWithValue }) => {
    try {
      const response = await subjectsService.updateSubject(data.id, data.payload)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to edit subject"
      return rejectWithValue(errorMessage)
    }
  },
)

export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subjectsService.deleteSubject(id)
      return { id, response }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete subject"
      return rejectWithValue(errorMessage)
    }
  },
)

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.subjects = action.payload.subjects
        state.pagination = action.payload.pagination
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // add subject
      .addCase(addSubject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.isLoading = false
        // Don't modify state here - let fetchSubjects handle the refresh
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // edit subject
      .addCase(editSubject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(editSubject.fulfilled, (state, action) => {
        state.isLoading = false
        // Don't modify state here - let fetchSubjects handle the refresh
      })
      .addCase(editSubject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.isLoading = false
        // Don't modify state here - let fetchSubjects handle the refresh
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = subjectsSlice.actions
export default subjectsSlice.reducer
