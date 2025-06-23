import { configureStore } from "@reduxjs/toolkit"

// Import slices
import authSlice from "./slices/authSlice"
import teachersSlice from "./slices/teachersSlice"
import studentsSlice from "./slices/studentsSlice"
import subjectsSlice from "./slices/subjectsSlice"
import classesSlice from "./slices/classesSlice"
import busesSlice from "./slices/busesSlice"
import uiSlice from "./slices/uiSlice"
import adminSlice from "./slices/adminSlice"
import profileSlice from "./slices/profileSlice"
import userslice from "./slices/userSlice"
import scheduleSlice from "./slices/scheduleSlice"
import sectionSlice from "./slices/sectionSlice"
import periodSlice from "./slices/periodSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    teachers: teachersSlice,
    students: studentsSlice,
    subjects: subjectsSlice,
    classes: classesSlice,
    periods: periodSlice,
    sections: sectionSlice,
    buses: busesSlice,
    admin: adminSlice,
    profile: profileSlice,
    users: userslice,
    ui: uiSlice,
    schedule: scheduleSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
