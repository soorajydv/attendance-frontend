"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm, Controller, FieldValues } from "react-hook-form"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useToast } from "./providers/ToastProvider"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { updateUser, clearUserError } from "@/store/slices/userSlice"
import { Gender, Student } from "@/types"
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
  Text
} from "lucide-react"
import { fetchBuses } from "@/store/slices/busesSlice"
import { fetchClasses } from "@/store/slices/classesSlice"
import { fetchSections } from "@/store/slices/sectionSlice"

interface UpdateUserModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  onSubmit: (data: any) => void
}

export default function UpdateUserModal({ isOpen, onClose, initialData, onSubmit }: UpdateUserModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { error } = useAppSelector((state) => state.users)
  const { buses } = useAppSelector((state) => state.buses)
  const { classes, isLoading: classesLoading } = useAppSelector((state) => state.classes)
  const { sections, isLoading: sectionsLoading } = useAppSelector((state) => state.sections)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    reset,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      dateOfBirth: "",
      busId: "",
      classId: "",
      sectionId: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBuses({ page: 1, limit: 10, search: "" }))
      dispatch(fetchSections({ page: 1, limit: 10, search: "" }))
      dispatch(fetchClasses({ page: 1, limit: 10, search: "" }))
    }
  }, [dispatch, isOpen])

  useEffect(() => {
    if (error && typeof error === "string" && error.trim() !== "") {
      toast.current.show({ severity: "error", detail: error })
      dispatch(clearUserError())
    }
  }, [error, toast, dispatch])

  useEffect(() => {
    if (isOpen && initialData && !classesLoading && !sectionsLoading) {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Map classId and sectionId from objects to IDs
      let classId = initialData?.classId || "";
      let sectionId = initialData?.sectionId || "";

      // If classId is an object, find the corresponding ID by name
      if (classId && typeof classId === "object" && classId.name) {
        const matchedClass = classes.find((grade) => grade.name === classId.name);
        classId = matchedClass?._id || "";
      }

      // If sectionId is an object, find the corresponding ID by name
      if (sectionId && typeof sectionId === "object" && sectionId.name) {
        const matchedSection = sections.find((section) => section.name === sectionId.name);
        sectionId = matchedSection?._id || "";
      }

      reset({
        fullName: initialData?.fullName || "",
        email: initialData?.email || "",
        phoneNumber: initialData?.phoneNumber || "",
        gender: initialData?.gender?.toLowerCase() || "",
        dateOfBirth: formatDate(initialData?.dateOfBirth) || "",
        busId: initialData?.busId || "",
        classId: classId || "",
        sectionId: sectionId || "",
      });
    } else if (isOpen && !initialData) {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        busId: "",
        classId: "",
        sectionId: "",
      });
    }
  }, [isOpen, initialData, classes, sections, classesLoading, sectionsLoading, reset])

  useEffect(() => {
    if (!isOpen) {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: undefined,
        dateOfBirth: "",
        busId: "",
        classId: "",
        sectionId: "",
      })
      dispatch(clearUserError())
    }
  }, [isOpen, reset, dispatch])

  const handleFormSubmit = async (data: FieldValues) => {
    try {
      if (!initialData?._id) {
        throw new Error("User ID is missing")
      }

      // Initialize userData with _id
      const userData: Partial<Student> = {
        _id: initialData._id,
      }

      // Include only modified fields using dirtyFields
      const fieldsToCompare: (keyof Partial<Student>)[] = [
        "fullName",
        "email",
        "phoneNumber",
        "gender",
        "dateOfBirth",
        "busId",
        "classId",
        "sectionId",
      ]

      fieldsToCompare.forEach((field) => {
        if (dirtyFields[field]) {
          const formValue = data[field] ?? "";
          if (field === "gender") {
            userData[field] = formValue as Gender;
          } else if (field === "dateOfBirth") {
            userData[field] = formValue ? new Date(formValue).toISOString().split('T')[0] : "";
          } else {
            userData[field] = formValue;
          }
        }
      })

      // Debug log to verify submitted fields
      // console.log("Submitting changed fields:", userData);

      // Only dispatch update if there are changes (besides _id)
      if (Object.keys(userData).length > 1) {
        await dispatch(updateUser({ id: userData._id as string, user: userData })).unwrap()
        toast.current.show({ severity: "success", detail: "User updated successfully" })
        onSubmit(data)
        handleClose()
      } else {
        toast.current.show({ severity: "info", detail: "No changes to save" })
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update user. Please try again."
      toast.current.show({ severity: "error", detail: errorMessage })
    }
  }

  const handleClose = () => {
    if (isDirty) {
        reset()
        dispatch(clearUserError())
        onClose()
    } else {
      reset()
      dispatch(clearUserError())
      onClose()
    }
  }

  const renderFormField = (
    name: keyof Partial<Student>,
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
                      <AlertDescription className="text-xs">{errors as any}</AlertDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="sectionId" className="text-sm font-medium flex items-center gap-2">
                    <Text className="h-4 w-4" />
                    Section
                  </Label>
                  <Controller
                    name="sectionId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section._id} value={section._id as string}>
                              <div className="flex items-center gap-2">
                                <Bus className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{section.name}</div>
                                </div>
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