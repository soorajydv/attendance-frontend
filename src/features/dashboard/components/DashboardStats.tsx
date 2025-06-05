"use client"

import { UserCard } from "@/components/ui/UserCard"

export function DashboardStats() {
  return (
    <div className="flex gap-4 justify-between flex-wrap">
      <UserCard type="Students" count={1234} />
      <UserCard type="Teachers" count={89} />
      <UserCard type="Staff" count={45} />
      <UserCard type="Buses" count={12} />
    </div>
  )
}
