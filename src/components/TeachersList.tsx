"use client";

import { UserRole, type Teacher } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import type { TableColumn } from "@/types";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import ActionButtons from "./ActionButton";
import TeacherProfileModal from "./FormModal";
import { useAppDispatch } from "@/hooks";
import { deleteUser, updateUser } from "@/store/slices/userSlice";
import AddUserModal from "./AddUserModal";
import UpdateTeacherModal from "./UpdateTeacherModal";
import ScheduleManagement from "@/app/dashboard/schedules/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TeachersListProps {
  teachers: Teacher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setSearch: (value: string) => void;
  refetchTeacher: () => void;
}

const columns: TableColumn[] = [
  { header: "Info", accessor: "info" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Schedule", accessor: "schedule", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export function TeachersList({
  teachers,
  pagination,
  setSearch,
  refetchTeacher,
}: TeachersListProps) {
  const dispatch = useAppDispatch();
  const [localSearch, setLocalSearch] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [updateTeacherModalOpen, setUpdateTeacherModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false); // New state for Schedule modal
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => setSearch(localSearch), 300);
    return () => clearTimeout(delay);
  }, [localSearch, setSearch]);

  const handleView = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setProfileModalOpen(true);
  }, []);

  const handleUpdateTeacher = useCallback(
    async (teacher: Teacher) => {
      if (!teacher._id) return;
      await dispatch(updateUser({ id: teacher._id, user: teacher }));
      setUpdateTeacherModalOpen(false);
      refetchTeacher();
    },
    [dispatch, refetchTeacher]
  );

  const handleDelete = useCallback(
    async (teacher: Teacher) => {
      if (!teacher._id) return;
      await dispatch(deleteUser(teacher._id));
      refetchTeacher();
    },
    [dispatch, refetchTeacher]
  );

  const handleScheduleManagement = useCallback((teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setScheduleModalOpen(true);
  }, []);

  const convertTeacherData = useCallback(
    (teacher: Teacher) => ({
      _id: teacher._id || "",
      fullName: teacher.fullName || "",
      email: teacher.email || "",
      phoneNumber: teacher.phoneNumber || "",
      gender: teacher.gender || "OTHER",
      role: UserRole.Teacher,
      dateOfBirth: teacher.dateOfBirth || "",
      organizationId: teacher.organizationId || "N/A",
      address: teacher.address || "",
      avatar: teacher.avatar || "",
      isVerified: teacher.isVerified || false,
      isLogin: teacher.isLogin || false,
      createdAt: teacher.createdAt || "",
      subjects: teacher.subjects || [],
      classes: teacher.classes || [],
    }),
    []
  );

  const renderRow = useCallback(
    (teacher: Teacher) => (
      <tr
        key={teacher._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={teacher.avatar || "/avatar.png"}
            alt={teacher.fullName || "Teacher"}
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{teacher.fullName || "N/A"}</h3>
            <p className="text-xs text-gray-500">{teacher.email || "N/A"}</p>
          </div>
        </td>
        <td className="hidden lg:table-cell">{teacher.phoneNumber || "N/A"}</td>
        <td>
          <button
            className="px-4 py-3 hidden md:table-cell text-blue-600 underline cursor-pointer"
            onClick={() => handleScheduleManagement(teacher._id as string)}
          >
            Schedule
          </button>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ActionButtons
              onView={() => handleView(teacher)}
              onEdit={() => {
                setSelectedTeacher(teacher);
                setSelectedTeacherId(teacher._id as string);
                setUpdateTeacherModalOpen(true);
              }}
              onDelete={() => handleDelete(teacher)}
            />
          </div>
        </td>
      </tr>
    ),
    [handleView, handleDelete, handleScheduleManagement]
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Teachers</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center justify-end gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image
              src="/search.png"
              alt="Search"
              width={14}
              height={14}
              className="cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-[200px] p-2 bg-transparent outline-none"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add Teacher
          </button>
        </div>
      </div>

      {teachers.length > 0 ? (
        <DataTable columns={columns} renderRow={renderRow} data={teachers} />
      ) : (
        <p className="text-center text-gray-500">No teachers found.</p>
      )}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        role={UserRole.Teacher}
      />

      {selectedTeacher && (
        <TeacherProfileModal
          open={profileModalOpen}
          onOpenChange={setProfileModalOpen}
          data={convertTeacherData(selectedTeacher)}
          onEdit={() => handleUpdateTeacher(selectedTeacher)}
          onDelete={() => handleDelete(selectedTeacher)}
        />
      )}

      {selectedTeacherId && (
        <UpdateTeacherModal
          isOpen={updateTeacherModalOpen}
          onClose={() => setUpdateTeacherModalOpen(false)}
          teacherId={selectedTeacherId}
          onSubmit={handleUpdateTeacher}
        />
      )}

      {selectedTeacherId && (
        <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Schedule for Teacher</DialogTitle>
            </DialogHeader>
            <ScheduleManagement teacherId={selectedTeacherId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}