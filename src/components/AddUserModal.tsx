"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useToast } from "./providers/ToastProvider"
import { addUser } from "@/store/slices/userSlice"
import { fetchStudents } from "@/store/slices/studentsSlice"
import { Gender, type User, type UserRole } from "@/types"
import { fetchBuses } from "@/store/slices/busesSlice"
import { fetchClasses } from "@/store/slices/classesSlice"
import { fetchSections } from "@/store/slices/sectionSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserIcon, Mail, Phone, Calendar, Bus, GraduationCap, Users } from "lucide-react"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  role: string
}

export default function AddUserModal({ isOpen, onClose, role }: AddUserModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { buses, error } = useAppSelector((state) => state.buses)
  const { classes, error: classError } = useAppSelector((state) => state.classes)
  const { sections, error: sectionError } = useAppSelector((state) => state.sections)

  useEffect(() => {
    dispatch(fetchBuses({ page: 1, limit: 10, search: "" }))
    dispatch(fetchSections({ page: 1, limit: 10, search: "" }))
    dispatch(fetchClasses({ page: 1, limit: 10, search: "" }))
  }, [dispatch, toast])

  if (error) toast.current.show({ severity: "error", detail: error })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<User>>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role: role as UserRole,
      dateOfBirth: "",
      busId: "",
      classId: "",
      sectionId: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: undefined,
        role: role as UserRole,
        dateOfBirth: "",
        busId: "",
        classId: "",
        sectionId: "",
      })
    }
  }, [isOpen, reset, role])

  const onSubmit = async (data: Partial<User>) => {
    try {
      await dispatch(addUser(data as any)).unwrap()
      toast.current.show({ severity: "success", detail: "User added successfully" })
      await dispatch(fetchStudents({ page: 1, limit: 10 })).unwrap()
      reset() // Reset form after successful submission
      onClose()
    } catch (err: any) {
      return
    }
  }

  const renderFormField = (
    id: keyof Partial<User>,
    label: string,
    type = "text",
    placeholder?: string,
    icon?: React.ReactNode,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        {...register(id)}
        id={id}
        type={type}
        placeholder={placeholder || label}
        className={errors[id] ? "border-destructive focus-visible:ring-destructive" : ""}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && (
        <p className="text-xs text-destructive" role="alert">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  )

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            Add New {role === "TEACHER" ? "Teacher" : "Student"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField("fullName", "Full Name", "text", "Enter full name", <UserIcon className="h-4 w-4" />)}
                {renderFormField(
                  "email",
                  "Email Address",
                  "email",
                  "Enter email address",
                  <Mail className="h-4 w-4" />,
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField(
                  "phoneNumber",
                  "Phone Number",
                  "text",
                  "+977XXXXXXXXXX",
                  <Phone className="h-4 w-4" />,
                )}
                {renderFormField("dateOfBirth", "Date of Birth", "date", "", <Calendar className="h-4 w-4" />)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Gender (optional)
                </Label>
                <Select onValueChange={(value) => setValue("gender", value as Gender)}>
                  <SelectTrigger className={errors.gender ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.Male}>Male</SelectItem>
                    <SelectItem value={Gender.Female}>Female</SelectItem>
                    <SelectItem value={Gender.Other}>Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.gender.message as string}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classId" className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Class (optional)
                  </Label>
                  <Select onValueChange={(value) => setValue("classId", value)}>
                    <SelectTrigger className={errors.classId ? "border-destructive focus:ring-destructive" : ""}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((grade) => (
                        <SelectItem key={grade._id} value={grade._id as string}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.classId.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sectionId" className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Section (optional)
                  </Label>
                  <Select onValueChange={(value) => setValue("sectionId", value)}>
                    <SelectTrigger className={errors.sectionId ? "border-destructive focus:ring-destructive" : ""}>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section._id} value={section._id as string}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sectionId && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.sectionId.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="busId" className="text-sm font-medium flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  Bus Route (optional)
                </Label>
                <Select onValueChange={(value) => setValue("busId", value)}>
                  <SelectTrigger className={errors.busId ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select bus route" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus._id} value={bus._id as string}>
                        {bus.busNumber} - {bus.route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.busId && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.busId.message as string}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Adding User..." : `Add ${role === "TEACHER" ? "Teacher" : "Student"}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
