'use client'

import { DashboardStats } from "@/components/DashboardStats"
import { AttendanceChart } from "@/components/AttendanceChart"
import { CountChart } from "@/components/CountChart"
import { EventCalendar } from "@/components/EventCalendar"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useEffect, useTransition } from "react"
import { fetchAdminDashboardDetails } from "@/store/slices/adminSlice"
import { useToast } from "@/components/providers/ToastProvider"
import Spinner from "@/components/Spinner"

export default function DashboardPage() {

  const dispatch = useAppDispatch();
  const { error, students, teachers, buses, classes, staffs, attendanceToday, recentNotifications, maleStudents, femaleStudents } = useAppSelector((state)=>state.admin);
  const [isLoading, startTransition] = useTransition();
  const toast = useToast();

  useEffect(()=>{
    startTransition(()=>{
      dispatch(fetchAdminDashboardDetails())
    })
  },[dispatch])
  
    useEffect(() => {
    if (error) {
      toast.current.show({ severity: "error", detail: error });
    }
  }, [error, toast]);

  if (isLoading) return <Spinner />;
  
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <DashboardStats students={students} teachers={teachers} buses={buses} staffs={staffs} />

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row mt-4">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart male={maleStudents} female={femaleStudents} />
          </div>
          {/* Attendance Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  )
}
