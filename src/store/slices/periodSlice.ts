import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { periodService } from "@/services/periodService"
import { BaseEntity } from "@/types"

export interface Period extends BaseEntity{
  data: any
  isActive(isActive: any): import("react").ReactNode
  name: string
  startTime: string
  endTime: string
}

interface PeriodState {
  periods: Period[]
  loading: boolean
  error: string | null
  selectedPeriod: Period | null
  pagination:{
    page:number
    limit:number
    total:number
    totalPages:number
  } | null
}

const initialState: PeriodState = {
  periods: [],
  loading: false,
  error: null,
  selectedPeriod: null,
  pagination: null
}

// Thunks
export const fetchPeriodById = createAsyncThunk(
  "period/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await periodService.getPeriodById(id)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const fetchPeriods = createAsyncThunk(
  "period/fetchAll",
  async (params:{page?:number,limit?:number,search?:string}, { rejectWithValue }) => {
    try {
      return await periodService.getPeriods(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const createPeriod = createAsyncThunk(
  "period/create",
  async (data: Period, { rejectWithValue }) => {
    try {
      return await periodService.createPeriod(data)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const updatePeriod = createAsyncThunk(
  "period/update",
  async ({ id, data }: { id: string; data: Partial<Period> }, { rejectWithValue }) => {
    try {
      return await periodService.updatePeriod(id, data)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const deletePeriod = createAsyncThunk(
  "period/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await periodService.deletePeriod(id)
      return id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const periodSlice = createSlice({
  name: "period",
  initialState,
  reducers: {
    clearSelectedPeriod(state) {
      state.selectedPeriod = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeriodById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPeriodById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPeriod = action.payload
      })
      .addCase(fetchPeriodById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchPeriods.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPeriods.fulfilled, (state, action) => {
        state.loading = false
        state.periods = action.payload?.data?.periods
        state.pagination = action.payload?.data?.pagination
      })
      .addCase(fetchPeriods.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(createPeriod.fulfilled, (state, action) => {
        state.periods.push(action.payload)
      })
      .addCase(updatePeriod.fulfilled, (state, action) => {
        const index = state.periods.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.periods[index] = action.payload
      })
      .addCase(deletePeriod.fulfilled, (state, action) => {
        state.periods = state.periods.filter(p => p._id !== action.payload)
      })
  },
})

export const { clearSelectedPeriod } = periodSlice.actions
export default periodSlice.reducer
