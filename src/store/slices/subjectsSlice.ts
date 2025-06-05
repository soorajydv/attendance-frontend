import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Subject } from "@/types"
import { subjectsService } from "@/services/subjectsService"

interface SubjectsState {
  subjects: Subject[]
  isLoading: boolean
  error: string | null
}

const initialState: SubjectsState = {
  subjects: [],
  isLoading: false,
  error: null,
}

export const fetchSubjects = createAsyncThunk("subjects/fetchSubjects", async (_, { rejectWithValue }) => {
  try {
    const response = await subjectsService.getSubjects()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch subjects")
  }
})

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
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.subjects = action.payload
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = subjectsSlice.actions
export default subjectsSlice.reducer
