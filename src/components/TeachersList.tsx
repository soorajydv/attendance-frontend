"use client";

import { UserRole, type Teacher } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import type { TableColumn } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import ActionButtons from "./ActionButton";
import TeacherProfileModal from "./FormModal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { deleteUser } from "@/store/slices/userSlice";
import AddUserModal from "./AddUserModal";
import ScheduleModal from "./Schedule";
import { fetchScheduleOptions, updateSchedules } from "@/store/slices/scheduleSlice";

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
  // {
  //   header: "Subjects",
  //   accessor: "subjects",
  //   className: "px-4 py-3 hidden md:table-cell",
  // },
  // {
  //   header: "Classes",
  //   accessor: "classes",
  //   className: "px-4 py-3 hidden md:table-cell",
  // },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  {
    header: "Schedule",
    accessor: "schedule",
    className: "hidden lg:table-cell",
  },
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
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const { subjects, classes, sections, loading, error } = useAppSelector((state) => state.schedule);

  console.log("subjects, classes, sections",subjects, classes, sections);
  

  useEffect(() => {
    if (selectedTeacherId) {
      dispatch(fetchScheduleOptions(selectedTeacherId));
    }
  }, [selectedTeacherId, dispatch]);

  const handleOpenSchedule = (teacher: Teacher) => {
    setSelectedSchedule(teacher.schedule || []);
    setSelectedTeacherId(teacher._id as string);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async (updatedSchedule: any[]) => {
    await dispatch(updateSchedules({ id: selectedTeacherId, schedule: updatedSchedule }));
    setScheduleModalOpen(false);
    refetchTeacher();
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setProfileModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setProfileModalOpen(false);
  };

  const handleDelete = async (teacher: Teacher) => {
    await dispatch(deleteUser(teacher._id as string));
    refetchTeacher();
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(delay);
  }, [localSearch, setSearch]);

  const convertTeacherData = (teacher: Teacher) => ({
    fullName: teacher.fullName,
    email: teacher.email,
    phoneNumber: teacher.phoneNumber,
    gender: teacher.gender || "OTHER",
    role: "TEACHER" as const,
    dateOfBirth: teacher.dateOfBirth,
    organizationId: teacher.organizationId || "N/A",
    address: teacher.address,
    avatar: teacher.avatar,
    isVerified: teacher.isVerified || false,
    isLogin: teacher.isLogin || false,
    createdAt: teacher.createdAt,
    subjects: teacher.subjects || [],
    classes: teacher.classes || [],
  });

  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={teacher.avatar || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{teacher.fullName}</h3>
          <p className="text-xs text-gray-500">{teacher.email}</p>
        </div>
      </td>
      {/* <td className="px-4 py-3 hidden md:table-cell">
        {teacher.subjects?.join(", ") || "No subjects"}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        {teacher.classes?.join(", ") || "No classes"}
      </td> */}
      <td className="hidden lg:table-cell">{teacher.phoneNumber}</td>
      <td>
        <button
          className="px-4 py-3 hidden md:table-cell text-blue-600 underline cursor-pointer"
          onClick={() => handleOpenSchedule(teacher)}
        >
          Schedule
        </button>
      </td>

      <td>
        <div className="flex items-center gap-2">
          <ActionButtons
            onView={() => handleView(teacher)}
            onEdit={() => handleEdit(teacher)}
            onDelete={() => handleDelete(teacher)}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Teachers</h1>
        <div className="hidden md:flex items-center justify-end gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image
            src="/search.png"
            alt=""
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ml-2"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          Add Teacher
        </button>
      </div>

      <DataTable columns={columns} renderRow={renderRow} data={teachers} />

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
          onEdit={() => handleEdit(selectedTeacher)}
          onDelete={() => handleDelete(selectedTeacher)}
        />
      )}

      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        schedule={selectedSchedule}
        teacherId={selectedTeacherId}
        onSave={handleSaveSchedule}
        subjects={subjects}
        classes={classes}
        sections={sections}
      />
    </div>
  );
}
