"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useToast } from "./providers/ToastProvider"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { updateUser } from "@/store/slices/userSlice"
import { Gender, Teacher } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  UserIcon,
  Mail,
  Phone,
  Calendar,
  Users,
  Edit3,
  AlertCircle,
  CheckCircle,
  Loader2,
  GraduationCap,
  Bus,
} from "lucide-react"
import { fetchBuses } from "@/store/slices/busesSlice"
import { fetchClasses } from "@/store/slices/classesSlice"

interface UpdateUserModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  onSubmit: (data: any) => void
}

export default function UpdateUserModal({ isOpen, onClose, initialData, onSubmit }: UpdateUserModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { error } = useAppSelector((state) => state.user)
  const { buses } = useAppSelector((state) => state.buses)
  const { classes } = useAppSelector((state) => state.classes)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role: undefined,
      dateOfBirth: "",
      busId: "",
      classId: "",
      sectionId: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBuses({ page: 1, limit: 10, search: "" }))
      dispatch(fetchClasses({ page: 1, limit: 10, search: "" }))
    }
  }, [dispatch, isOpen])

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };

      reset({
        fullName: initialData?.fullName || "",
        email: initialData?.email || "",
        phoneNumber: initialData?.phoneNumber || "",
        gender: initialData?.gender?.toLowerCase() || "",
        role: initialData?.role || "",
        dateOfBirth: formatDate(initialData?.dateOfBirth) || "",
        busId: initialData?.busId || "",
        classId: initialData?.classId || "",
        sectionId: initialData?.sectionId || "",
      })
    } else if (isOpen && !initialData) {
      // Reset to empty form if no initial data
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        // gender: "",
        // role: "",
        dateOfBirth: "",
        busId: "",
        classId: "",
        sectionId: "",
      })
    }
  }, [isOpen, initialData, reset])

  // Additional reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: undefined,
        role: undefined,
        dateOfBirth: "",
        busId: "",
        classId: "",
        sectionId: "",
      })
    }
  }, [isOpen, reset])

  const handleFormSubmit = async (data: any) => {
    try {
      if (!initialData?._id) {
        throw new Error("User ID is missing")
      }

      const userData: Partial<Teacher> = {
        _id: initialData._id,
        fullName: data.fullName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender as Gender,
        role: data.role || initialData.role,
        dateOfBirth: data.dateOfBirth || "",
        busId: data.busId || "",
        classId: data.classId || "",
      }

      await dispatch(updateUser({ id: userData._id as string, user: userData })).unwrap()
      toast.current.show({ severity: "success", detail: "User updated successfully" })
      onSubmit(data)
      handleClose()
    } catch (err) {
      toast.current.show({ severity: "error", detail: "Failed to update user" })
    }
  }

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        reset()
        onClose()
      }
    } else {
      reset()
      onClose()
    }
  }

  const renderFormField = (
    name: keyof Partial<Teacher>,
    label: string,
    type = "text",
    placeholder?: string,
    icon?: React.ReactNode,
    required = false,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        {...register(name as any)}
        id={name}
        type={type}
        placeholder={placeholder || label}
      />
    </div>
  )

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading User Data
            </DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}. Please try again later.</AlertDescription>
          </Alert>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Edit3 className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <div>Update User Information</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">Modify the user details below</div>
              </div>
            </DialogTitle>
          </div>

          {isDirty && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                You have unsaved changes. Don't forget to save your updates.
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderFormField(
                  "fullName",
                  "Full Name",
                  "text",
                  "Enter full name",
                  <UserIcon className="h-4 w-4" />,
                )}
                {renderFormField(
                  "email",
                  "Email Address",
                  "email",
                  "Enter email address",
                  <Mail className="h-4 w-4" />,
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderFormField(
                  "phoneNumber",
                  "Phone Number",
                  "tel",
                  "Enter phone number",
                  <Phone className="h-4 w-4" />,
                )}
                {renderFormField("dateOfBirth", "Date of Birth", "date", "", <Calendar className="h-4 w-4" />)}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Gender
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Optional
                    </Badge>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className={errors.gender ? "border-destructive focus:ring-destructive" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{errors.gender.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Role
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Optional
                    </Badge>
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className={errors.role ? "border-destructive focus:ring-destructive" : ""}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="teacher">teacher</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{errors.role.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information Section */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                Academic Information
                <Badge variant="secondary" className="ml-auto">
                  Optional
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="classId" className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Class
                  </Label>
                  <Controller
                    name="classId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((grade) => (
                            <SelectItem key={grade._id} value={grade._id as string}>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {grade.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="busId" className="text-sm font-medium flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  Bus Route
                </Label>
                <Controller
                  name="busId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bus route" />
                      </SelectTrigger>
                      <SelectContent>
                        {buses.map((bus) => (
                          <SelectItem key={bus._id} value={bus._id as string}>
                            <div className="flex items-center gap-2">
                              <Bus className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{bus.busNumber}</div>
                                <div className="text-xs text-muted-foreground">{bus.route}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                      </Select>
                    )}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-center pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isDirty ? (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Changes detected - ready to save
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No changes made
                </>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty} className="flex-1 sm:flex-none min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
