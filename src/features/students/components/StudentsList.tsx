"use client"

import type { Student } from "@/types"
import { DataTable } from "@/components/ui/DataTable"
import type { TableColumn } from "@/types"
import Image from "next/image"

interface StudentsListProps {
  students: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const columns: TableColumn[] = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
]

export function StudentsList({ students, pagination }: StudentsListProps) {
  const renderRow = (student: Student) => (
    <tr key={student.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={student.photo || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${student.firstName} ${student.lastName}`}</h3>
          <p className="text-xs text-gray-500">{student.class}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{student.studentId}</td>
      <td className="hidden md:table-cell">{student.grade}</td>
      <td className="hidden md:table-cell">{student.class}</td>
      <td className="hidden lg:table-cell">{student.phone}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA]">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]">
            <Image src="/edit.png" alt="" width={16} height={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFE4E1]">
            <Image src="/delete.png" alt="" width={16} height={16} />
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Students</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add Student
        </button>
      </div>
      <DataTable columns={columns} renderRow={renderRow} data={students} />
    </div>
  )
}
