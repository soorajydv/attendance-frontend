"use client"

import type { Teacher } from "@/types"
import { DataTable } from "@/components/ui/DataTable"
import type { TableColumn } from "@/types"
import Image from "next/image"

interface TeachersListProps {
  teachers: Teacher[]
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
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
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

export function TeachersList({ teachers, pagination }: TeachersListProps) {
  const renderRow = (teacher: Teacher) => (
    <tr key={teacher.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={teacher.photo || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${teacher.firstName} ${teacher.lastName}`}</h3>
          <p className="text-xs text-gray-500">{teacher.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{teacher.teacherId}</td>
      <td className="hidden md:table-cell">{teacher.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{teacher.classes.join(", ")}</td>
      <td className="hidden lg:table-cell">{teacher.phone}</td>
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
        <h1 className="text-lg font-semibold">All Teachers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add Teacher
        </button>
      </div>
      <DataTable columns={columns} renderRow={renderRow} data={teachers} />
    </div>
  )
}
