"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useAppSelector, useAppDispatch } from "@/hooks"
import { useToast } from "./providers/ToastProvider"
import { addUser, clearUserError } from "@/store/slices/userSlice"
import { fetchStudents } from "@/store/slices/studentsSlice"
import { fetchBuses } from "@/store/slices/busesSlice"
import { fetchClasses } from "@/store/slices/classesSlice"
import { fetchSections } from "@/store/slices/sectionSlice"
import { Gender, type User, type UserRole } from "@/types"
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
  role: UserRole
}

interface FormData extends Partial<User> {
  fullName: string
  email: string
  phoneNumber: string
}

export default function AddUserModal({ isOpen, onClose, role }: AddUserModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()

  const { error: userError } = useAppSelector((state) => state.users)
  const { buses, error: busError, isLoading: busesLoading } = useAppSelector((state) => state.buses)
  const { classes, error: classError, isLoading: classesLoading } = useAppSelector((state) => state.classes)
  const { sections, error: sectionError, isLoading: sectionsLoading } = useAppSelector((state) => state.sections)

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role,
      dateOfBirth: "",
      busId: "",
      classId: "",
      sectionId: "",
    },
    mode: "onChange"
  })

  const resetForm = useCallback(() => {
    reset({
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role,
      dateOfBirth: "",
      busId: "",
      classId: "",
      sectionId: "",
    })
    dispatch(clearUserError())
  }, [reset, role, dispatch])

  useEffect(() => {
    if (isOpen) {
      resetForm()
      dispatch(fetchBuses({ page: 1, limit: 10, search: "" }))
      dispatch(fetchSections({ page: 1, limit: 10, search: "" }))
      dispatch(fetchClasses({ page: 1, limit: 10, search: "" }))
    }
  }, [isOpen, dispatch, resetForm])

  useEffect(() => {
    const errors = [ busError, classError, sectionError].filter(Boolean)
    errors.forEach(error => {
      if (error) {
        toast.current.show({ severity: "error", detail: error })
      }
    })
  }, [busError, classError, sectionError, toast])

const onSubmit = async (data: FormData) => {
  try {
    // Filter out empty string or undefined values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
    );

    await dispatch(addUser(filteredData as User)).unwrap();
    toast.current.show({ severity: "success", detail: `New ${role.toLowerCase()} added successfully` });
    await dispatch(fetchStudents({ page: 1, limit: 10 })).unwrap();
    onClose();
  } catch (err: any) {
    toast.current.show({ severity: "error", detail: err || "Failed to add user" });
  }
};


  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const renderFormField = (
    id: keyof FormData,
    label: string,
    type = "text",
    placeholder?: string,
    icon?: React.ReactNode
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
        disabled={isSubmitting}
      />
      {errors[id] && (
        <p className="text-xs text-destructive" role="alert">
          {errors[id]?.message as any as any}
        </p>
      )}
    </div>
  )

  const renderSelectField = (
    id: keyof FormData,
    label: string,
    options: Array<{ _id: string; name: string } | { _id: string; busNumber: string; route: string }>,
    placeholder: string,
    icon: React.ReactNode,
    disabled: boolean
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Select 
        onValueChange={(value) => setValue(id, value)} 
        disabled={isSubmitting || disabled}
      >
        <SelectTrigger className={errors[id] ? "border-destructive focus:ring-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length ? (
            options.map((option) => (
              <SelectItem 
                key={option._id} 
                value={option._id}
              >
                {"name" in option ? option.name : `${option.busNumber} - ${option.route}`}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-options" disabled>
              {disabled ? "Loading..." : "No options available"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {errors[id] && (
        <p className="text-xs text-destructive" role="alert">
          {errors[id]?.message as any}
        </p>
      )}
    </div>
  )

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
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField("fullName", "Full Name", "text", "Enter full name", <UserIcon className="h-4 w-4" />)}
                {renderFormField("email", "Email Address", "email", "Enter email address", <Mail className="h-4 w-4" />)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField("phoneNumber", "Phone Number", "tel", "+977XXXXXXXXXX", <Phone className="h-4 w-4" />)}
                {renderFormField("dateOfBirth", "Date of Birth", "date", "", <Calendar className="h-4 w-4" />)}
              </div>
              {renderSelectField(
                "gender",
                "Gender (optional)",
                [
                  { _id: Gender.Male, name: "Male" },
                  { _id: Gender.Female, name: "Female" },
                  { _id: Gender.Other, name: "Other" }
                ],
                "Select gender",
                <UserIcon className="h-4 w-4" />,
                false
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelectField(
                  "classId",
                  "Class (optional)",
                  classes as any,
                  "Select class",
                  <GraduationCap className="h-4 w-4" />,
                  classesLoading
                )}
                {renderSelectField(
                  "sectionId",
                  "Section (optional)",
                  sections as any,
                  "Select section",
                  <Users className="h-4 w-4" />,
                  sectionsLoading
                )}
              </div>
              {renderSelectField(
                "busId",
                "Bus Route (optional)",
                buses as any,
                "Select bus route",
                <Bus className="h-4 w-4" />,
                busesLoading
              )}
            </CardContent>
          </Card>

          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Adding..." : `Add ${role === "TEACHER" ? "Teacher" : "Student"}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}