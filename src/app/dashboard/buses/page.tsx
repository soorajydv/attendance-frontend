"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchBuses, deleteBus, updateBus, addBus } from "@/store/slices/busesSlice";
import { useToast } from "@/components/providers/ToastProvider";

import { DataTable } from "@/components/ui/DataTable";
import ActionButtons from "@/components/ActionButton";

import Spinner from "@/components/Spinner";
import BusEditModal from "@/components/UpdateBusModal";
import AddBusModal from "@/components/AddBusModal";

const columns = [
  { header: "Driver Name", accessor: "driver" },
  {
    header: "Number plate",
    accessor: "busNumber",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phoneNumber",
    className: "hidden lg:table-cell",
  },
  { header: "Route", accessor: "route", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default function BusesPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { buses, error } = useAppSelector((state) => state.buses);

  const [search, setSearch] = useState("");
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // For Edit Modal
  const [editingBus, setEditingBus] = useState(null);

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchBuses({ page: 1, limit: 10, search }));
    });
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchBuses({ page: 1, limit: 10, search }));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Open modal and set bus to edit
  const handleEditClick = (bus: any) => {
    setEditingBus(bus);
    setIsOpen(true);
  };

  // Handle form submit from edit modal
  const handleUpdate = async (data: any) => {
    if (!editingBus || !data._id) {
      console.error("Missing bus ID:", { editingBus, data });
      alert("Invalid bus ID");
      return;
    }

    try {
      await dispatch(updateBus({ id: data._id, ...data })).unwrap();
      console.log("Bus updated successfully");
      alert("Bus updated successfully");
      setIsOpen(false);
      setEditingBus(null);
      dispatch(fetchBuses({ page: 1, limit: 10, search }));
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update bus");
    }
  };

  // Handle form submit from add modal
  const handleAddBus = async (data: any) => {
    try {
      await dispatch(addBus(data)).unwrap();
      toast.current.show({ severity: "success", detail: "Bus added successfully" });
      setIsOpen(false);
      dispatch(fetchBuses({ page: 1, limit: 10, search }));
    } catch (error) {
      console.error("Add bus error:", error);
      toast.current.show({ severity: "error", detail: "Failed to add bus" });
    }
  };

  const handleDelete = (busId: string) => {
    startTransition(() => {
      dispatch(deleteBus({ id: busId }))
        .unwrap()
        .then(() => {
          toast.current.show({ severity: "success", detail: "Bus deleted" });
          dispatch(fetchBuses({ page: 1, limit: 10, search }));
        })
        .catch(() => {
          toast.current.show({
            severity: "error",
            detail: "Failed to delete bus",
          });
        });
    });
  };

  const renderRow = (bus: any) => (
    <tr
      key={bus._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={bus.photo || "/avatar.png"}
          alt={bus.driver?.fullName || "Driver"}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{bus.driver?.fullName || "N/A"}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{bus.busNumber}</td>
      <td className="hidden lg:table-cell">
        {bus.driver?.phoneNumber || "N/A"}
      </td>
      <td className="hidden lg:table-cell">{bus.route || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          <ActionButtons
            onEdit={() => handleEditClick(bus)}
            onDelete={() => handleDelete(bus._id)}
          />
        </div>
      </td>
    </tr>
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-md flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">All Buses</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setIsOpen(true)} // Open AddBusModal
          >
            Add Bus
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by driver name or number"
          className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={handleSearchChange}
        />

        {!buses ? (
          <div className="text-gray-500 text-center py-10">
            No buses available
          </div>
        ) : (
          <DataTable columns={columns} renderRow={renderRow} data={buses} />
        )}

        {/* Edit Modal */}
        <BusEditModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setEditingBus(null);
          }}
          onSubmit={handleUpdate}
          initialData={editingBus || undefined}
        />

        {/* Add Modal */}
        <AddBusModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleAddBus}
          initialData={{}}
        />
      </div>
    </div>
  );
}