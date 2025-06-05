"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { TeachersList } from "@/features/teachers/components/TeachersList"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { fetchTeachers } from "@/store/slices/teachersSlice"
import { useToast } from "@/components/providers/ToastProvider"

export default function TeachersPage() {
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { teachers, isLoading, error, pagination } = useAppSelector((state) => state.teachers)

  useEffect(() => {
    dispatch(fetchTeachers({ page: 1, limit: 10, search: "" }))
  }, [dispatch]) // run only on mount

  useEffect(() => {
    if (error) {
      toast.current.show({ severity: "error", detail: error })
    }
  }, [error, toast])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-4">
      {/* <TeachersList teachers={teachers} pagination={pagination} /> */}
    </div>
  )
}
