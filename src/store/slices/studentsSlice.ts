import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Student } from "@/types"
import { studentsService } from "@/services/studentsService"

interface StudentsState {
  students: Student[]
  currentStudent: Student | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await studentsService.getStudents(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch students")
    }
  },
)

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await studentsService.getStudentById(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch student")
    }
  },
)

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData: Omit<Student, "id">, { rejectWithValue }) => {
    try {
      const response = await studentsService.createStudent(studentData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create student")
    }
  },
)

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, data }: { id: number; data: Partial<Student> }, { rejectWithValue }) => {
    try {
      const response = await studentsService.updateStudent(id, data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update student")
    }
  },
)

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id: number, { rejectWithValue }) => {
  try {
    await studentsService.deleteStudent(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete student")
  }
})

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentStudent: (state, action: PayloadAction<Student | null>) => {
      state.currentStudent = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false
        state.students = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch student by ID
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.currentStudent = action.payload
      })
      // Create student
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload)
      })
      // Update student
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.students[index] = action.payload
        }
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = action.payload
        }
      })
      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.id !== action.payload)
        if (state.currentStudent?.id === action.payload) {
          state.currentStudent = null
        }
      })
  },
})

export const { clearError, setCurrentStudent } = studentsSlice.actions
export default studentsSlice.reducer
