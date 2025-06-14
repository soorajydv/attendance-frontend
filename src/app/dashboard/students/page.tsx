"use client";

import { useEffect, useState, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { StudentsList } from "@/components/StudentsList";
import Spinner from "@/components/Spinner";
import { fetchStudents } from "@/store/slices/studentsSlice";
import { useToast } from "@/components/providers/ToastProvider";

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const [isLoading, startTransition] = useTransition();

  const { students, error, pagination } = useAppSelector((state) => state.students);
  const toast = useToast();
  const [search, setSearch] = useState(""); // user-controlled value

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchStudents({ page: 1, limit: 10 }));
    });
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchStudents({ page: 1, limit: 10, search }));
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  useEffect(() => {
    if (error) {
      toast.current.show({ severity: "error", detail: error });
    }
  }, [error, toast]);

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      {students ? (
        <StudentsList
          students={students}
          pagination={pagination}
          setSearch={setSearch}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
