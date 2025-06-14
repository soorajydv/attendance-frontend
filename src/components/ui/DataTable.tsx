import React from "react";
import type { TableColumn } from "@/types";

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}

export function DataTable({ columns, data, renderRow }: DataTableProps) {
  const generateStableKey = (item: any, index: number): string => {
    if (item._id) return item._id;
    if (item.code && item.name) return `${item.code}-${item.name}`;
    if (item.name) return `name-${item.name}`;
    return `index-${index}`;
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left whitespace-nowrap ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y px-4 divide-gray-100">
          {data.length > 0 ? (
            data.map((item, index) => (
              <React.Fragment key={generateStableKey(item, index)}>
                {renderRow(item, index)}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
