"use client"

import { UserCard } from "@/components/ui/UserCard"

interface StatsProps{
  students:number,
  teachers:number, 
  staffs:number, 
  buses:number
}

export function DashboardStats({students,teachers,staffs,buses}:StatsProps) {
  return (
    <div className="flex gap-4 justify-between flex-wrap">
      <UserCard type="Students" count={students} />
      <UserCard type="Teachers" count={teachers} />
      <UserCard type="Staff" count={staffs} />
      <UserCard type="Buses" count={buses} />
    </div>
  )
}
