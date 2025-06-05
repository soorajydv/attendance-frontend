"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { StudentsList } from "@/features/students/components/StudentsList"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { mockStudents } from "@/lib/mockData"

export default function StudentsPage() {
  const dispatch = useAppDispatch()
  const { students, isLoading, error, pagination } = useAppSelector((state) => state.students)

  useEffect(() => {
    // For now, we'll use mock data since we don't have a backend
    // dispatch(fetchStudents({ page: 1, limit: 10 }))
  }, [dispatch])

  // Use mock data for now
  const mockPagination = {
    page: 1,
    limit: 10,
    total: mockStudents.length,
    totalPages: Math.ceil(mockStudents.length / 10),
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="p-4">
      <StudentsList students={mockStudents} pagination={mockPagination} />
    </div>
  )
}
