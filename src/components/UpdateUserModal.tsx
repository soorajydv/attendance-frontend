"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useToast } from "./providers/ToastProvider";
import { addUser, updateUser } from "@/store/slices/userSlice";
import { fetchStudents } from "@/store/slices/studentsSlice";
import { Gender, User, UserRole } from "@/types";


interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateUserModal({ isOpen, onClose }: UpdateUserModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { error } = useAppSelector((state) => state.user);

  useEffect(() => {
  if (error) toast.current.show({ severity: "error", detail: error });
}, [error]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Partial<User>>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role: UserRole.Student,
      dateOfBirth: "",
      busId: "",
      classId: "",
    },
  });

  const onEdit = async (data: Partial<User>) => {
    try {
      // const payload = {id: data._id, updateData: data as User}
      await dispatch(updateUser({id: data.id as string, user: data})).unwrap();
      toast.current.show({ severity: "success", detail: "User added successfully" });
      await dispatch(fetchStudents({ page: 1, limit: 10 })).unwrap();
      onClose();
    } catch (err: any) {
      return
    }
  };

  if (!isOpen) return null;

  const renderInput = (
    id: keyof Partial<User>,
    label: string,
    type: string = "text",
    placeholder?: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...register(id)}
        id={id}
        type={type}
        placeholder={placeholder || label}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          errors[id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
        } dark:bg-gray-800 dark:text-gray-100`}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onEdit)}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-6"
        aria-labelledby="add-user-modal"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100" id="add-user-modal">
          Add New User
        </h2>

        {renderInput("fullName", "Full Name")}
        {renderInput("email", "Email", "email")}
        {renderInput("phoneNumber", "Phone Number", "text", "+977XXXXXXXXXX")}

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender (optional)
          </label>
          <select
            {...register("gender")}
            id="gender"
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.gender ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
            } dark:bg-gray-800 dark:text-gray-100`}
            aria-invalid={!!errors.gender}
          >
            <option value="">Select a gender</option>
            <option value={Gender.Male}>{Gender.Male}</option>
            <option value={Gender.Female}>{Gender.Female}</option>
            <option value={Gender.Other}>{Gender.Other}</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.gender.message as string}
            </p>
          )}
        </div>

        {renderInput("dateOfBirth", "Date of Birth", "date")}
        {renderInput("busId", "Bus ID")}
        {renderInput("classId", "Class ID")}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
