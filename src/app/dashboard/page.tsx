import { DashboardStats } from "@/features/dashboard/components/DashboardStats"
import { AttendanceChart } from "@/features/dashboard/components/AttendanceChart"
import { CountChart } from "@/features/dashboard/components/CountChart"
import { EventCalendar } from "@/features/dashboard/components/EventCalendar"

export default function DashboardPage() {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <DashboardStats />

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row mt-4">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
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
