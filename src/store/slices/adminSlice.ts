import { adminService } from "@/services/adminService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AdminState {
  isLoading: boolean
  error: string | null
  students: number
  teachers: number
  staffs:number
  classes: number
  buses: number
  maleStudents:number
  femaleStudents:number
  attendanceToday: {}
  recentNotifications: []
}

const initialState:AdminState = {
    error: null,
    isLoading: false,
    students: 0,
    teachers: 0,
    staffs: 0,
    classes: 0,
    buses: 0,
    maleStudents: 0,
    femaleStudents: 0,
    attendanceToday: {},
    recentNotifications: []
}

export const fetchAdminDashboardDetails = createAsyncThunk("/admin/dashboard", async (_, { rejectWithValue }) => {
    try {
        const response = await adminService.getDashboardSummary();
        return response;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch")
    }
})

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAdminDashboardDetails.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAdminDashboardDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.attendanceToday = action.payload.attendanceToday
                state.recentNotifications = action.payload.recentNotifications
                state.buses = action.payload.buses || 0
                state.classes = action.payload.classes || 0
                state.staffs = action.payload.staff || 0
                state.teachers = action.payload.teachers || 0
                state.students = action.payload.students || 0
                state.maleStudents = action.payload.maleStudents || 0
                state.femaleStudents = action.payload.femaleStudents || 0
            })
            .addCase(fetchAdminDashboardDetails.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as any
            })
    },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer