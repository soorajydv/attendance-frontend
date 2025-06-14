"use client";

import React, { startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useToast } from "./providers/ToastProvider";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getDrivers } from "@/store/slices/busesSlice";

export const busSchema = z.object({
    _id: z.string(),
    busNumber: z.string().nonempty("Bus number is required."),
    route: z
        .string()
        .nonempty("Route is required.")
        .regex(
            /^[a-z]+(-[a-z]+)*$/,
            "Route must be in the format location-location-location."
        ),
    capacity: z.number().int().positive("Capacity must be a positive integer."),
    driverId: z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Invalid driver ID format")
        .optional()
        .or(z.literal("")),
});

type BusFormInputs = z.infer<typeof busSchema>;

interface Driver {
    _id: string;
    fullName: string;
}

interface BusEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<BusFormInputs>;
    onSubmit: (data: BusFormInputs) => void;
}

export default function BusEditModal({
    isOpen,
    onClose,
    initialData,
    onSubmit,
}: BusEditModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BusFormInputs>({
        resolver: zodResolver(busSchema),
        defaultValues: {
            _id: initialData?._id || "",
            busNumber: initialData?.busNumber || "",
            route: initialData?.route || "",
            capacity: initialData?.capacity || 0,
            driverId: initialData?.driverId || "",
        },
    });

    const dispatch = useAppDispatch();
    const toast = useToast();
    const { error, drivers } = useAppSelector((state) => state.buses);

    console.log("drivers:", drivers);

    useEffect(() => {
        startTransition(() => {
            dispatch(getDrivers());
        });
    }, [dispatch]);

    useEffect(() => {
        if (isOpen) {
            reset({
                _id: initialData?._id || "",
                busNumber: initialData?.busNumber || "",
                route: initialData?.route || "",
                capacity: initialData?.capacity || 0,
                driverId: initialData?.driverId || "",
            });
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-6"
            >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Edit Bus Details
                </h2>

                {/* Hidden _id field */}
                <input type="hidden" {...register("_id")} />

                {/* Bus Number */}
                <div>
                    <label
                        htmlFor="busNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Bus Number
                    </label>
                    <input
                        {...register("busNumber")}
                        id="busNumber"
                        type="text"
                        placeholder="Enter bus number"
                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.busNumber
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
                            } dark:bg-gray-800 dark:text-gray-100`}
                    />
                    {errors.busNumber && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.busNumber.message}
                        </p>
                    )}
                </div>

                {/* Route */}
                <div>
                    <label
                        htmlFor="route"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Route
                    </label>
                    <input
                        {...register("route")}
                        id="route"
                        type="text"
                        placeholder="e.g. cityA-cityB-cityC"
                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.route
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
                            } dark:bg-gray-800 dark:text-gray-100`}
                    />
                    {errors.route && (
                        <p className="mt-1 text-xs text-red-600">{errors.route.message}</p>
                    )}
                </div>

                {/* Capacity */}
                <div>
                    <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Capacity
                    </label>
                    <input
                        {...register("capacity", { valueAsNumber: true })}
                        id="capacity"
                        type="number"
                        min={1}
                        placeholder="Number of seats"
                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.capacity
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
                            } dark:bg-gray-800 dark:text-gray-100`}
                    />
                    {errors.capacity && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.capacity.message}
                        </p>
                    )}
                </div>

                {/* Driver Selection */}
                <div>
                    <label
                        htmlFor="driverId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Driver (optional)
                    </label>
                    <select
                        {...register("driverId")}
                        id="driverId"
                        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.driverId
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-700 focus:border-blue-600"
                            } dark:bg-gray-800 dark:text-gray-100`}
                    >
                        <option value="">Select a driver</option>
                        {drivers && drivers.length > 0 ? (
                            drivers.map((driver: Driver) => (
                                <option key={driver._id} value={driver._id}>
                                    {driver.fullName}
                                </option>
                            ))
                        ) : (
                            <option disabled>No drivers available</option>
                        )}
                    </select>
                    {errors.driverId && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.driverId.message}
                        </p>
                    )}
                </div>

                {/* Buttons */}
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