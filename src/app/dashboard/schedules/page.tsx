"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import ScheduleForm from '@/components/ScheduleForm';
import { 
  fetchScheduleOptions, 
  createSchedule, 
  updateSchedules, 
  deleteSchedule,
  setSelectedSchedule,
  clearError 
} from '@/store/slices/scheduleSlice';
import { fetchSubjects } from '@/store/slices/subjectsSlice';
import { fetchClasses } from '@/store/slices/classesSlice';
import { fetchSections } from '@/store/slices/sectionSlice';
import { fetchPeriods } from '@/store/slices/periodSlice';
import { Schedule, CreateScheduleData, ScheduleFilters } from '@/types/index';
import { Plus, Calendar, List, Grid } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useToast } from '@/components/providers/ToastProvider';
import { fetchTeachers } from '@/store/slices/teachersSlice';


const ScheduleManagement = ({teacherId}:any) => {
  const dispatch = useAppDispatch();
  const { schedules, loading, error, selectedSchedule } = useAppSelector(
    (state) => state.schedule
  );
  const { subjects } = useAppSelector((state) => state.subjects);
  const { classes } = useAppSelector((state) => state.classes);
  const { sections } = useAppSelector((state) => state.sections);
  const { periods } = useAppSelector((state) => state.periods);
  const { teachers } = useAppSelector((state) => state.teachers);

  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilters>({});

  const toast = useToast();

  useEffect(() => {
    dispatch(fetchScheduleOptions(teacherId));
    dispatch(fetchSubjects({ limit: 100 }));
    dispatch(fetchClasses({ limit: 100 }));
    dispatch(fetchSections({ limit: 100 }));
    dispatch(fetchPeriods({ limit: 100 }));
    dispatch(fetchTeachers({ limit: 100 }));
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (error) {
      toast.current.show({
        severity: "error",
        detail: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreateSchedule = async (data: CreateScheduleData) => {
    try {
      await dispatch(createSchedule({ ...data, teacherId })).unwrap();
      toast.current.show({
        severity: "success",
        detail: "Schedule created successfully",
      });
      setShowForm(false);
      dispatch(fetchScheduleOptions(teacherId));
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleUpdateSchedule = async (data: CreateScheduleData) => {
    if (!selectedSchedule) return;
    
    try {
      await dispatch(updateSchedules({
        id: selectedSchedule._id,
        schedule: [{ ...data, _id: selectedSchedule._id }]
      })).unwrap();
      toast.current.show({
        severity: "success",
        detail: "Schedule updated successfully",
      });
      setShowForm(false);
      dispatch(setSelectedSchedule(null!));
      dispatch(fetchScheduleOptions(teacherId));
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await dispatch(deleteSchedule(id)).unwrap();
        toast.current.show({
          severity: "success",
          detail: "Schedule deleted successfully",
        });
        dispatch(fetchScheduleOptions(teacherId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    dispatch(setSelectedSchedule(schedule));
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(setSelectedSchedule(null));
  };

  const filteredSchedules = schedules.filter((schedule) => {
    if (filters.search && !schedule.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
        !schedule.className.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && schedule.status !== filters.status) {
      return false;
    }
    if (filters.day && filters.day !== 'all' && schedule.day !== filters.day) {
      return false;
    }
    return true;
  });

  // Create schedule options from the individual slices
  const scheduleOptions = {
    subjects: subjects.map(s => ({ _id: s._id, name: s.name })),
    classes: classes.map(c => ({ _id: c._id, name: c.name })),
    sections: sections.map(s => ({ _id: s._id, name: s.name, classId: s.class._id })),
    periods: periods.map(p => ({ _id: p._id, name: p.name, startTime: p.startTime, endTime: p.endTime })),
    teachers: teachers.map(p => ({ _id: p._id, name: p.fullName})),
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
              <p className="text-gray-600 mt-1">Manage your teaching schedules and class assignments</p>
            </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
              </div>
            </div>
          </div>
        </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule View */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ScheduleCalendar
              schedules={filteredSchedules}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
            />
          )}
        </div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </DialogTitle>
            </DialogHeader>
            <ScheduleForm
              schedule={selectedSchedule}
              scheduleOptions={scheduleOptions as any}
              onSubmit={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
              onCancel={handleCloseForm}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ScheduleManagement;
