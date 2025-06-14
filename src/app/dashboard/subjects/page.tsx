"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { addSubject, deleteSubject, editSubject, fetchSubjects } from "@/store/slices/subjectsSlice"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/button"
import EditSubjectModal from "@/components/EditSubjectModal"
import ActionButtons from "@/components/ActionButton"
import { Loader2, Plus, Search, Filter, RefreshCcw } from "lucide-react"
import { useToast } from "@/components/providers/ToastProvider"
import type { Subject, TableColumn } from "@/types"

const columns: TableColumn[] = [
  {
    header: "Code",
    accessor: "code",
    className: "hidden md:table-cell",
  },
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "text-right w-40",
  },
]

export default function SubjectsPage() {
  const dispatch = useAppDispatch()
  const { subjects } = useAppSelector((state) => state.subjects)
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  useEffect(() => {
    const loadSubjects = async () => {
      setIsLoading(true)
      try {
        await dispatch(fetchSubjects({ page: 1, limit: 10, search: "" }))
        setHasLoaded(true)
      } catch (error) {
        console.error("Failed to load subjects:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSubjects()
  }, [dispatch])

  const handleSubmit = async (data: Subject, isEdit: boolean) => {
    try {
      if (isEdit) {
        // Update existing subject
        await dispatch(
          editSubject({
            id: data._id as string,
            payload: {
              name: data.name,
              code: data.code,
              description: data.description,
            },
          }),
        ).unwrap()
      } else {
        // Add new subject
        await dispatch(
          addSubject({
            name: data.name,
            code: data.code,
            description: data.description,
          }),
        ).unwrap()
      }

      // Refresh the subjects list
      await dispatch(fetchSubjects({ page: 1, limit: 10 }))

      setIsModalOpen(false)
      setSelectedSubject(null)

      toast.current.show({
        severity: "success",
        detail: `Subject ${isEdit ? "updated" : "added"} successfully!`,
      })
    } catch (error: any) {
      console.error("Error saving subject:", error)
      toast.current.show({ severity: "error", detail: error })
    }
  }

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsModalOpen(true)
  }

  const handleAddClick = () => {
    setSelectedSubject(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSubject(id)).unwrap()
      await dispatch(fetchSubjects({ page: 1, limit: 10 }))
      toast.current.show({
        severity: "success",
        detail: "Subject deleted successfully!",
      })
    } catch (error: any) {
      console.error("Error deleting subject:", error)
      toast.current.show({ severity: "error", detail: error })
    }
  }

  const handleRefresh = () => {
    dispatch(fetchSubjects({ page: 1, limit: 10, search: "" }))
  }

const renderRow = (subject: Subject, index: number) => (
  <tr
    key={subject._id ?? `${subject.code}-${index}`}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition-colors duration-150"
  >
    <td className="px-4 py-4 hidden md:table-cell font-medium text-gray-600">
      {subject.code}
    </td>
    <td className="px-4 py-4 font-medium text-gray-900">
      {subject.name}
    </td>
    <td className="px-4 py-4 text-right">
      <div className="flex justify-end gap-2">
        <ActionButtons
          showView={false}
          onEdit={() => handleEditClick(subject)}
          onDelete={() => handleDelete(subject._id as string)}
        />
      </div>
    </td>
  </tr>
)


  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">All Subjects</h1>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => console.log("Search")}
              variant="outline"
              size="icon"
              className="h-9 w-9 p-0 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
              title="Search Subjects"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => console.log("Filter")}
              variant="outline"
              size="icon"
              className="h-9 w-9 p-0 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-600"
              title="Filter Subjects"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="icon"
              className="h-9 w-9 p-0 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
              title="Refresh Data"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddClick}
              variant="default"
              size="icon"
              className="h-9 w-9 p-0 transition-colors duration-200"
              title="Add New Subject"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading && !subjects ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <DataTable columns={columns} renderRow={renderRow} data={subjects} />
        )}

        <EditSubjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedSubject(null)
          }}
          initialData={selectedSubject}
          handleEdit={handleSubmit}
        />
      </div>
    </div>
  )
}
