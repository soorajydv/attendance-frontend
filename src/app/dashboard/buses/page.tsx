"use client"

import { mockBuses } from "@/lib/mockData"
import { DataTable } from "@/components/ui/DataTable"
import type { TableColumn } from "@/types"
import Image from "next/image"

const columns: TableColumn[] = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Bus ID",
    accessor: "busId",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Shift",
    accessor: "timeShifting",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
]

export default function BusesPage() {
  const renderRow = (bus: any) => (
    <tr key={bus.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={bus.photo || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{bus.driverName}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{bus.busId}</td>
      <td className="hidden lg:table-cell">{bus.phone}</td>
      <td className="hidden lg:table-cell">{bus.address}</td>
      <td className="hidden lg:table-cell">{bus.timeShifting}</td>
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
    <div className="p-4">
      <div className="bg-white p-4 rounded-md flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">All Buses</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Add Bus
          </button>
        </div>
        <DataTable columns={columns} renderRow={renderRow} data={mockBuses} />
      </div>
    </div>
  )
}
