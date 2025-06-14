import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Bus, User } from "@/types"
import { busesService } from "@/services/busesService"

interface BusesState {
  buses: Bus[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  drivers: User[]
}

const initialState: BusesState = {
  buses: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  drivers: []
}

export const addBus = createAsyncThunk("buses/addBus",
  async (data: { busNumber: string; route: string; capacity: number; driverId?: string }, { rejectWithValue }) => {
    try {
      const response = await busesService.createBus(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch buses")
    }
  })

export const fetchBuses = createAsyncThunk("buses/fetchBuses",
  async (params: { page: number, limit: number, search?: string }, { rejectWithValue }) => {
    try {
      const response = await busesService.getBuses(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch buses")
    }
  })

export const updateBus = createAsyncThunk(
  "buses/updateBus",
  async (
    payload: { id: string; busNumber: string; route: string; capacity: number; driverId?: string },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...updateData } = payload;
      const response = await busesService.updateBus(id, updateData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update bus");
    }
  }
);

export const getDrivers = createAsyncThunk(
  "buses/getDrivers",
  async (_, { rejectWithValue }
  ) => {
    try {
      const response = await busesService.getDrivers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update bus");
    }
  }
);

export const deleteBus = createAsyncThunk("buses/deleteBus",
  async (params: { id: string }, { rejectWithValue }) => {
    try {
      const response = await busesService.deleteBus(params.id);
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete bus")
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

      // Fetch all Buses
      .addCase(fetchBuses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.isLoading = false
        state.buses = action.payload.buses
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.buses = [];
      })

      // Update bus
      .addCase(updateBus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBus.fulfilled, (state, action) => {
        state.isLoading = false
        state.buses = action.payload.buses
        state.pagination = action.payload.pagination
      })
      .addCase(updateBus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete bus
      .addCase(deleteBus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBus.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedBusId = action.meta.arg; // the ID passed to deleteBus thunk
        state.buses = state.buses.filter(bus => bus._id !== deletedBusId.id);
      })
      .addCase(deleteBus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete bus";
      })

      // Fetch all drivers
      .addCase(getDrivers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.isLoading = false
        state.drivers = action.payload.drivers
        state.pagination = action.payload.pagination
      })
      .addCase(getDrivers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.drivers = [];
      })
  },
})

export const { clearError } = busesSlice.actions
export default busesSlice.reducer