import type React from "react"
import type { TableColumn } from "@/types"

interface DataTableProps {
  columns: TableColumn[]
  renderRow: (item: any) => React.ReactNode
  data: any[]
}

export function DataTable({ columns, renderRow, data }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  )
}
