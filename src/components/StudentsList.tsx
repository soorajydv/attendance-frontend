"use client";

import { UserRole, type Student } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import type { TableColumn } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProfileDetails from "@/components/ProfileDetails";
import React from "react";
import ActionButtons from "./ActionButton";
import AddUserModal from "./AddUserModal";
import UpdateUserModal from "./UpdateStudentModal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { deleteUser } from "@/store/slices/userSlice";
import { fetchStudents } from "@/store/slices/studentsSlice";

interface StudentsListProps {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setSearch: (value: string) => void;
}

const columns: TableColumn[] = [
  { header: "Name", accessor: "fullName" },
  { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
  { header: "Section", accessor: "section", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phoneNumber", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export function StudentsList({ students, pagination, setSearch }: StudentsListProps) {
  const dispatch = useAppDispatch();

  const [localSearch, setLocalSearch] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isProfileDetailsModalOpen, setIsProfileDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Partial<Student> | null>(null);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileDetailsModalOpen(true);
  };

  const handleEdit = (student: Partial<Student>) => {
    setEditingStudent(student);
    setIsUpdateUserModalOpen(true);
  };

  const handleDelete = async (studentId: string) => {
    await dispatch(deleteUser(studentId));
    await dispatch(fetchStudents({ page: 1, limit: 10 }));
  };

  useEffect(() => {
    const delay = setTimeout(() => setSearch(localSearch), 500);
    return () => clearTimeout(delay);
  }, [localSearch, setSearch]);

  const renderRow = (student: Student) => (
    <tr key={student._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
      <td className="flex items-center gap-4 p-4">
        <Image src={"/avatar.png"} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{student?.fullName}</h3>
              <h3
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  student?.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {student?.isVerified ? "Verified" : "Not Verified"}
              </h3>
            </div>
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">{student?.email}</div>
          </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">{student.classId?.name || "N/A"}</td>
      <td className="px-7 py-3 hidden md:table-cell">{student.sectionId?.name || "N/A"}</td>
      <td className="px-4 py-3 hidden lg:table-cell">{student.phoneNumber}</td>
      <td className="px-4  text-right">
        {/* <div className="flex items-center gap-2"> */}
          <ActionButtons
            onView={() => handleView(student)}
            onEdit={() => handleEdit(student)}
            onDelete={() => handleDelete(student._id as string)}
          />
        {/* </div> */}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Students</h1>
        <div className="flex gap-2">
          <div className="hidden md:flex items-center justify-end gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-[200px] p-2 bg-transparent outline-none"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ml-2"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add Student
          </button>
        </div>
      </div>

      <DataTable columns={columns} renderRow={renderRow} data={students} />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        role={UserRole.Student}
      />

      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
        initialData={editingStudent}
        onSubmit={handleEdit}
      />

      {isProfileDetailsModalOpen && selectedStudent && (
        <ProfileDetails
          onClose={() => setIsProfileDetailsModalOpen(false)}
          studentId={selectedStudent._id}
        />
      )}
    </div>
  );
}
