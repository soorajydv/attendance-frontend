"use client";

import { useEffect, useState, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { TeachersList } from "@/components/TeachersList";
import { fetchTeachers } from "@/store/slices/teachersSlice";
import Spinner from "@/components/Spinner";

export default function TeachersPage() {
  const dispatch = useAppDispatch();
  const { teachers, error, pagination } = useAppSelector((state) => state.teachers);
  const [search, setSearch] = useState("");
  const [isLoading, startTransition] = useTransition();
  const [page, setPage] = useState(1);

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchTeachers({ page: 1, limit: 10, search: "", gender: "" }));
    });
  }, [dispatch]);

    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchTeachers({ page: 1, limit: 10, search, gender: "" }));
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);
  

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      {teachers ? (
        <TeachersList teachers={teachers} pagination={pagination} setSearch={setSearch} 
        refetchTeacher={() =>
          dispatch(fetchTeachers({ page: 1, limit: 10, search: "", gender: "" }))
        } />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
