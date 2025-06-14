"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useToast } from "./providers/ToastProvider";
import { addClass, fetchClasses } from "@/store/slices/classesSlice";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClassFormData {
  name: string;
  code: string;
}

export default function AddClassModal({ isOpen, onClose }: AddClassModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { error } = useAppSelector((state) => state.classes);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClassFormData>({
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    try {
      await dispatch(addClass(data)).unwrap();
      toast.current.show({ severity: "success", detail: "Class added successfully" });
      await dispatch(fetchClasses({ page: 1, limit: 10 })).unwrap();
      reset();
      onClose();
    } catch (err: any) {
      toast.current.show({ severity: "error", detail: err.message || "Failed to add class" });
    }
  };

  if (!isOpen) return null;

  const renderInput = (
    id: keyof ClassFormData,
    label: string,
    placeholder?: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...register(id, { required: `${label} is required` })}
        id={id}
        type="text"
        placeholder={placeholder || label}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          errors[id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
        } dark:bg-gray-800 dark:text-gray-100`}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-6"
        aria-labelledby="add-class-modal"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100" id="add-class-modal">
          Add New Class
        </h2>

        {renderInput("name", "Class Name", "e.g., Grade 6")}
        {renderInput("code", "Class Code", "e.g., G6")}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
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