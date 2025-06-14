"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useToast } from "./providers/ToastProvider";
import { updateClass } from "@/store/slices/classesSlice";
import { fetchClasses } from "@/store/slices/classesSlice";
import { fetchTeachers } from "@/store/slices/teachersSlice";
import type { Class, Teacher } from "@/types";

interface UpdateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class;
}

export interface ClassFormData {
  name: string;
  code: string;
  user: string; // Single teacher ID
}

export default function UpdateClassModal({ isOpen, onClose, classData }: UpdateClassModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { teachers, error: teachersError, isLoading: isTeachersLoading } = useAppSelector((state) => state.teachers);
  const { error: classesError } = useAppSelector((state) => state.classes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<ClassFormData>({
    defaultValues: {
      name: classData.name,
      code: classData.code,
      user: classData.user[0]?.id || "", // First teacher's ID or empty string
    },
  });

  const selectedTeacherId = watch("user") || "";

  useEffect(() => {
    // Fetch teachers only if not already loaded and not currently fetching
    if (!teachers.length && !isTeachersLoading) {
      dispatch(fetchTeachers({ page: 1, limit: 100 }));
    }
  }, [dispatch, teachers.length, isTeachersLoading]);

  useEffect(() => {
    // Show error toasts for teachers or classes errors
    if (teachersError) {
      toast.current.show({ severity: "error", detail: teachersError });
    }
    if (classesError) {
      toast.current.show({ severity: "error", detail: classesError });
    }
  }, []);

  useEffect(() => {
    setValue("name", classData.name);
    setValue("code", classData.code as string);
    setValue("user", classData.user[0]?.id || "");
  }, [classData, setValue]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (data: ClassFormData) => {
    try {
      await dispatch(
        updateClass({
          id: classData._id as string,
          payload: {
            name: data.name,
            code: data.code,
            userId: data.user || undefined, // Single teacher ID or undefined
          },
        })
      ).unwrap();
      toast.current.show({ severity: "success", detail: "Class updated successfully" });
      await dispatch(fetchClasses({ page: 1, limit: 10 })).unwrap();
      reset();
      setSearchTerm("");
      onClose();
    } catch (err: any) {
      toast.current.show({ severity: "error", detail: err.message || "Failed to update class" });
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTeacherSelect = (teacherId: string) => {
    setValue("user", teacherId);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  if (!isOpen) return null;

  const renderInput = (
    id: keyof ClassFormData,
    label: string,
    placeholder?: string
  ) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...register(id, { required: `${label} is required` })}
        id={id}
        type="text"
        placeholder={placeholder || label}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          errors[id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && (
        <p className="mt-1 text-xs text-red-500 flex items-center" role="alert">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[id]?.message}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-class-modal"
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-6 transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        } mx-4 sm:mx-0`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" id="update-class-modal">
            Update Class
          </h2>

          {renderInput("name", "Class Name", "e.g., Grade 6")}
          {renderInput("code", "Class Code", "e.g., G6")}

          <div className="relative" ref={dropdownRef}>
            <label htmlFor="teacher-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teacher (optional)
            </label>
            <div className="relative">
              <input
                id="teacher-search"
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                aria-autocomplete="list"
                aria-controls="teacher-dropdown"
                disabled={isTeachersLoading}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {isTeachersLoading && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading teachers...</p>
            )}

            {isDropdownOpen && !isTeachersLoading && filteredTeachers.length > 0 && (
              <ul
                id="teacher-dropdown"
                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                role="listbox"
              >
                {filteredTeachers.map((teacher) => (
                  <li
                    key={teacher._id}
                    onClick={() => handleTeacherSelect(teacher._id as string)}
                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                    role="option"
                    aria-selected={selectedTeacherId === teacher._id}
                  >
                    {teacher.fullName}
                  </li>
                ))}
              </ul>
            )}

            {selectedTeacherId && (
              <div className="mt-2">
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {teachers.find((t) => t._id === selectedTeacherId)?.fullName || "Unknown"}
                  <button
                    type="button"
                    onClick={() => setValue("user", "")}
                    className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    aria-label="Remove selected teacher"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setSearchTerm("");
                setIsDropdownOpen(false);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
