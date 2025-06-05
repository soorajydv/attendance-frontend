// Base types
export interface BaseEntity {
  id: number
  createdAt?: string
  updatedAt?: string
}

// User related types
export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  photo?: string
  bloodType?: string
  birthday?: string
  sex: "male" | "female"
  role?: string
}

export interface Teacher extends User {
  teacherId: string
  subjects: string[]
  classes: string[]
}

export interface Student extends User {
  studentId: string
  grade: number
  class: string
}

export interface Subject extends BaseEntity {
  name: string
  teachers: string[]
}

export interface Class extends BaseEntity {
  name: string
  capacity: number
  grade: number
  supervisor: string
}

export interface Bus extends BaseEntity {
  busId: string
  driverName: string
  timeShifting: "Morning" | "Day" | "Evening"
  phone: string
  address: string
  photo: string
}

export interface Event extends BaseEntity {
  title: string
  class: string
  date: string
  startTime: string
  endTime: string
}

export interface Announcement extends BaseEntity {
  title: string
  class: string
  date: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData extends LoginFormData {
  confirmPassword?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Table types
export interface TableColumn {
  header: string
  accessor: string
  className?: string
}

// Auth types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Role types
export type UserRole = "admin" | "teacher" | "student" | "parent"
