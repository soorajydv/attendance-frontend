"use client"

import { useState } from "react"
import { User, Mail, Phone, Calendar, MapPin, Building, Shield, Clock, BookOpen, Users, Star, Award, CheckCircle, AlertCircle, Copy, MoreVertical, Pencil, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeacherData {
  fullName: string
  email: string
  phoneNumber: string
  gender: "MALE" | "FEMALE" | "OTHER"
  role: "TEACHER" | "STUDENT" | "ADMIN"
  dateOfBirth?: string
  organizationId: string
  address?: string
  avatar?: string
  isVerified?: boolean
  isLogin?: boolean
  createdAt?: string
  subjects?: string[]
  classes?: string[]
}

interface TeacherProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: TeacherData
  onEdit?: () => void
  onDelete?: () => void
}

export default function TeacherProfileModal({ 
  open, 
  onOpenChange, 
  data, 
  onEdit, 
  onDelete 
}: TeacherProfileModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  console.log("data",data);
  
  const getGenderConfig = (gender: string) => {
    switch (gender) {
      case "MALE":
        return { color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white", icon: "👨" }
      case "FEMALE":
        return { color: "bg-gradient-to-r from-pink-500 to-pink-600 text-white", icon: "👩" }
      default:
        return { color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white", icon: "👤" }
    }
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "TEACHER":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
          icon: "🎓",
          description: "Educator & Mentor",
        }
      case "STUDENT":
        return {
          color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          icon: "📚",
          description: "Learner & Explorer",
        }
      case "ADMIN":
        return {
          color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
          icon: "⚡",
          description: "System Administrator",
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
          icon: "👤",
          description: "User",
        }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const InfoCard = ({
    icon,
    label,
    value,
    copyable = false,
    className = "",
    children,
  }: {
    icon: React.ReactNode
    label: string
    value?: string
    copyable?: boolean
    className?: string
    children?: React.ReactNode
  }) => (
    <div
      className={`group relative p-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          {children || (
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-gray-900 break-all">{value}</p>
              {copyable && value && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(value, label)}
                      >
                        {copiedField === label ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedField === label ? "Copied!" : "Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const genderConfig = getGenderConfig(data.gender)
  const roleConfig = getRoleConfig(data.role)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white">
      
        <DialogHeader className="flex flex-col items-center pb-6 border-b border-gray-200">
        
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <Avatar className="relative h-24 w-24 border-4 border-white shadow-2xl">
              <AvatarImage src={data.avatar || "/placeholder.svg?height=96&width=96"} alt={data.fullName} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(data.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center space-y-2">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {data.fullName}
            </DialogTitle>
            <div className="flex items-center justify-center gap-2">
              <Badge className={`${roleConfig.color} px-4 py-2 text-sm font-medium`}>
                <span className="mr-2">{roleConfig.icon}</span>
                {data.role}
              </Badge>
              {data.isVerified && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="pt-6 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Subjects</span>
              </div>
              <p className="text-2xl font-bold">{data.subjects?.length || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Classes</span>
              </div>
              <p className="text-2xl font-bold">{data.classes?.length || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <p className="text-sm font-semibold">{data.createdAt ? new Date(data.createdAt).getFullYear() : "N/A"}</p>
            </div>
          </div>

          {/* Basic Information */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                Personal Information
                <div className="ml-auto">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<User className="h-4 w-4 text-gray-600" />}
                  label="Full Name"
                  value={data.fullName}
                  copyable
                />

                <InfoCard
                  icon={<Mail className="h-4 w-4 text-gray-600" />}
                  label="Email Address"
                  value={data.email}
                  copyable
                />

                <InfoCard
                  icon={<Phone className="h-4 w-4 text-gray-600" />}
                  label="Phone Number"
                  value={data.phoneNumber}
                  copyable
                />

                <InfoCard
                  icon={<Calendar className="h-4 w-4 text-gray-600" />}
                  label="Date of Birth"
                  value={data.dateOfBirth ? formatDate(data.dateOfBirth) : "Not provided"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={<span className="text-lg">{genderConfig.icon}</span>} label="Gender">
                  <Badge className={`${genderConfig.color} px-3 py-1 text-sm font-medium`}>{data.gender}</Badge>
                </InfoCard>

                <InfoCard icon={<MapPin className="h-4 w-4 text-gray-600" />} label="Address">
                  {data.address ? (
                    <p className="text-base font-semibold text-gray-900">{data.address}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-400 italic text-sm">No address provided</span>
                    </div>
                  )}
                </InfoCard>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Professional Details
                <div className="ml-auto flex items-center gap-2">
                  <Badge className={`${roleConfig.color} px-3 py-1 text-sm font-medium`}>
                    <span className="mr-1">{roleConfig.icon}</span>
                    {data.role}
                  </Badge>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600 ml-11">{roleConfig.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.subjects && data.subjects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Teaching Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.subjects.map((subject, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 px-3 py-1.5 text-sm font-medium capitalize"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.classes && data.classes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">Assigned Classes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.classes.map((className, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-200 px-3 py-1.5 text-sm font-medium"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {className}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization & System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoCard
                  icon={<Building className="h-4 w-4 text-gray-600" />}
                  label="Organization ID"
                  value={data.organizationId}
                  copyable
                  className="bg-gradient-to-r from-orange-50 to-orange-100/50"
                />

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${data.isVerified ? "bg-emerald-100" : "bg-red-100"}`}>
                      {data.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verification Status</p>
                      <Badge
                        className={`${data.isVerified ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"} text-white px-3 py-1 text-sm font-medium`}
                      >
                        {data.isVerified ? "✓ Verified Account" : "⚠ Pending Verification"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoCard
                  icon={<Clock className="h-4 w-4 text-gray-600" />}
                  label="Member Since"
                  value={data.createdAt ? formatDate(data.createdAt) : "Not available"}
                  className="bg-gradient-to-r from-purple-50 to-purple-100/50"
                />

                <div className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Account Age</p>
                      <p className="text-lg font-bold text-gray-900">
                        {data.createdAt 
                          ? Math.floor((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                          : 0
                        } days
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
