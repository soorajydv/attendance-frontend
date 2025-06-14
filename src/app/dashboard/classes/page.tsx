"use client";

import { DataTable } from "@/components/ui/DataTable";
import type { Class, TableColumn } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { deleteClass, fetchClasses } from "@/store/slices/classesSlice";
import ActionButtons from "@/components/ActionButton";
import AddClassModal from "@/components/AddClassModal";
import UpdateClassModal, { ClassFormData } from "@/components/UpdateClassModal";

const columns: TableColumn[] = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Supervisor",
    accessor: "user",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

export default function ClassesPage() {
  const dispatch = useAppDispatch();
  const { classes, error } = useAppSelector((state) => state.classes);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    dispatch(fetchClasses({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteClass({ id })).unwrap();
    dispatch(fetchClasses({ page: 1, limit: 10 }));
  };

  const handleEdit = (cls: Class) => {
    setSelectedClass(cls);
    setIsUpdateOpen(true);
  };

  const renderRow = (cls: Class) => (
    <tr
      key={cls._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">{cls.name}</td>
      <td className="hidden md:table-cell gap-4 p-4">
        {cls.user && cls.user.length > 0 ? cls.user[0].fullName : "N/A"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <ActionButtons
            onEdit={() => handleEdit(cls)}
            onDelete={() => handleDelete(cls._id as string)}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Classes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddOpen(true)}
        >
          Add Class
        </button>
      </div>
      <DataTable columns={columns} renderRow={renderRow} data={classes as Class[]} />
      <AddClassModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {selectedClass && (
        <UpdateClassModal
          isOpen={isUpdateOpen}
          onClose={() => {
            setIsUpdateOpen(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
        />
      )}
    </div>
  );
}
