"use client"

import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/hooks"
import { logoutUser } from "@/store/slices/authSlice"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants"

export function Navbar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const { notifications } = useAppSelector((state) => state.ui)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push(ROUTES.LOGIN)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} className="cursor-pointer" />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Notifications */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/message.png" alt="message" width={20} height={20} />
          {notifications.length > 0 && (
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
              {notifications.length}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user ? `${user.firstName} ${user.lastName}` : "Admin User"}
          </span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>

        {/* Avatar */}
        <div className="relative group">
          <Image
            src={user?.photo || "/avatar.png"}
            alt="avatar"
            width={36}
            height={36}
            className="cursor-pointer rounded-full object-cover"
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Image src="/logout.png" alt="logout" width={16} height={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
