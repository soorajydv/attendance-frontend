import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Teacher } from "@/types"
import { teachersService }  from "@/services/teachersService"

interface TeachersState {
  teachers: Teacher[]
  currentTeacher: Teacher | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
}

export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await teachersService.getTeachers(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch teachers")
    }
  },
)

export const fetchTeacherById = createAsyncThunk(
  "teachers/fetchTeacherById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await teachersService.getTeacherById(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch teacher")
    }
  },
)

export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (teacherData: Omit<Teacher, "id">, { rejectWithValue }) => {
    try {
      const response = await teachersService.createTeacher(teacherData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create teacher")
    }
  },
)

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async ({ id, data }: { id: number; data: Partial<Teacher> }, { rejectWithValue }) => {
    try {
      const response = await teachersService.updateTeacher(id, data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update teacher")
    }
  },
)

export const deleteTeacher = createAsyncThunk("teachers/deleteTeacher", async (id: number, { rejectWithValue }) => {
  try {
    await teachersService.deleteTeacher(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete teacher")
  }
})

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentTeacher: (state, action: PayloadAction<Teacher | null>) => {
      state.currentTeacher = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false
        state.teachers = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch teacher by ID
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.currentTeacher = action.payload
      })
      // Create teacher
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload)
      })
      // Update teacher
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.teachers[index] = action.payload
        }
        if (state.currentTeacher?.id === action.payload.id) {
          state.currentTeacher = action.payload
        }
      })
      // Delete teacher
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((t) => t.id !== action.payload)
        if (state.currentTeacher?.id === action.payload) {
          state.currentTeacher = null
        }
      })
  },
})

export const { clearError, setCurrentTeacher } = teachersSlice.actions
export default teachersSlice.reducer
