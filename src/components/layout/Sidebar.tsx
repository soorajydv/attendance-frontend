"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES, USER_ROLES } from "@/constants"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: ROUTES.DASHBOARD,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: ROUTES.TEACHERS,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: ROUTES.STUDENTS,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: ROUTES.SUBJECTS,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: ROUTES.CLASSES,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: ROUTES.ATTENDANCE,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/van.png",
        label: "Buses",
        href: ROUTES.BUSES,
        visible: [USER_ROLES.ADMIN],
      },      
      {
        icon: "/finance.png",
        label: "Billing & Payments",
        href: ROUTES.TRANSACTIONS,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/message.png",
        label: "Events",
        href: ROUTES.MESSAGES,
        visible: [USER_ROLES.ADMIN],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: ROUTES.PROFILE,
        visible: [USER_ROLES.ADMIN],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: ROUTES.SETTINGS,
        visible: [USER_ROLES.ADMIN],
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const userRole = USER_ROLES.ADMIN // TODO: Get from user data

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href={ROUTES.DASHBOARD} className="flex items-center justify-center lg:justify-start gap-2 mb-8">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <span className="hidden lg:block font-semibold">SchoolMS</span>
      </Link>

      {/* Menu */}
      <div className="mt-4 text-sm flex-1">
        {menuItems.map((section) => (
          <div className="flex flex-col gap-2" key={section.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">{section.title}</span>
            {section.items.map((item) => {
              if (item.visible.includes(userRole)) {
                const isActive = pathname === item.href
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={cn(
                      "flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md transition-colors",
                      isActive ? "bg-[#C3EBFA] text-blue-600" : "hover:bg-[#EDF9FD]",
                    )}
                  >
                    <Image src={item.icon || "/placeholder.svg"} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              }
              return null
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
