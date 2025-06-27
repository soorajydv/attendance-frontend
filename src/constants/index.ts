export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
} as const

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  DASHBOARD: "/dashboard",
  TEACHERS: "/dashboard/teachers",
  SCHEDULE: "/dashboard/schedules",
  STUDENTS: "/dashboard/students",
  SUBJECTS: "/dashboard/subjects",
  CLASSES: "/dashboard/classes",
  BUSES: "/dashboard/buses",
  ATTENDANCE: "/dashboard/attendance",
  MESSAGES: "/dashboard/messages",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  TRANSACTIONS: "/dashboard/billings",
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  TEACHERS: "/api/teachers",
  STUDENTS: "/api/students",
  SUBJECTS: "/api/subjects",
  CLASSES: "/api/classes",
  BUSES: "/api/buses",
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER_DATA: "user_data",
  THEME: "theme",
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const
