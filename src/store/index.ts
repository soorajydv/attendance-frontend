import { configureStore } from "@reduxjs/toolkit"

// Import slices
import authSlice from "./slices/authSlice"
import teachersSlice from "./slices/teachersSlice"
import studentsSlice from "./slices/studentsSlice"
import subjectsSlice from "./slices/subjectsSlice"
import classesSlice from "./slices/classesSlice"
import busesSlice from "./slices/busesSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    teachers: teachersSlice,
    students: studentsSlice,
    subjects: subjectsSlice,
    classes: classesSlice,
    buses: busesSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
