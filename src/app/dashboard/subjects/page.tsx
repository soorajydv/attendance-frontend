"use client"

import { mockSubjects } from "@/lib/mockData"
import { DataTable } from "@/components/ui/DataTable"
import type { TableColumn } from "@/types"

const columns: TableColumn[] = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
]

export default function SubjectsPage() {
  const renderRow = (subject: any) => (
    <tr key={subject.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
      <td className="flex items-center gap-4 p-4">{subject.name}</td>
      <td className="hidden md:table-cell">{subject.teachers.join(", ")}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]">Edit</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFE4E1]">Delete</button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-md flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">All Subjects</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Add Subject
          </button>
        </div>
        <DataTable columns={columns} renderRow={renderRow} data={mockSubjects} />
      </div>
    </div>
  )
}
