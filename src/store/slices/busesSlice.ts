import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Bus } from "@/types"
import { busesService } from "@/services/busesService"

interface BusesState {
  buses: Bus[]
  isLoading: boolean
  error: string | null
}

const initialState: BusesState = {
  buses: [],
  isLoading: false,
  error: null,
}

export const fetchBuses = createAsyncThunk("buses/fetchBuses", async (_, { rejectWithValue }) => {
  try {
    const response = await busesService.getBuses()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch buses")
  }
})

const busesSlice = createSlice({
  name: "buses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.isLoading = false
        state.buses = action.payload
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = busesSlice.actions
export default busesSlice.reducer
