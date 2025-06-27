"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScheduleManagement from '@/components/ScheduleManagement'; // Adjust the import path as needed
import { Teacher } from '@/types';

interface Props {
  teacher: Teacher;
}

const TeacherComponent: React.FC<Props> = ({ teacher }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScheduleManagement = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="px-4 py-3 hidden md:table-cell text-blue-600 underline cursor-pointer"
        onClick={handleScheduleManagement}
      >
        Schedule
      </button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Schedule for Teacher</DialogTitle>
          </DialogHeader>
          <ScheduleManagement teacherId={teacher._id as string} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherComponent;