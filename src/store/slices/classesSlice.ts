import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Class } from "@/types"
import { classesService } from "@/services/classesService"

interface ClassesState {
  classes: Class[]
  isLoading: boolean
  error: string | null
}

const initialState: ClassesState = {
  classes: [],
  isLoading: false,
  error: null,
}

export const fetchClasses = createAsyncThunk("classes/fetchClasses", async (_, { rejectWithValue }) => {
  try {
    const response = await classesService.getClasses()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch classes")
  }
})

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false
        state.classes = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = classesSlice.actions
export default classesSlice.reducer
