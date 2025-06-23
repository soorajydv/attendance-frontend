"use client";

import type React from "react";
import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { useToast } from "./providers/ToastProvider";
import { fetchUser, updateUser } from "@/store/slices/userSlice";
import { Gender, Teacher, UserRole } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import { fetchBuses } from "@/store/slices/busesSlice";
import { fetchClasses } from "@/store/slices/classesSlice";
import { fetchTeacherById } from "@/store/slices/teachersSlice";

interface UpdateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId?: string;
  onSubmit: (data: Teacher) => void;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender;
  role?: UserRole;
  dateOfBirth: string;
  busId: string;
  classId: string;
}

export default function UpdateTeacherModal({ isOpen, onClose, teacherId, onSubmit }: UpdateTeacherModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { selectedUser:user, error, isLoading } = useAppSelector((state) => state.users);
  const { buses } = useAppSelector((state) => state.buses);
  const { classes } = useAppSelector((state) => state.classes);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    reset,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      role: undefined,
      dateOfBirth: "",
      busId: "",
      classId: "",
    },
  });

  // Fetch initial data
  useEffect(() => {
    if (isOpen && teacherId) {
      dispatch(fetchUser(teacherId));
      dispatch(fetchBuses({ page: 1, limit: 10, search: "" }));
      dispatch(fetchClasses({ page: 1, limit: 10, search: "" }));
    }
  }, [dispatch, isOpen, teacherId]);

    // errors
  useEffect(() => {
    if (error) {
      toast.current.show({severity:"error",detail:error})
    }
  }, [error]);

  // Reset form with initial data
  useEffect(() => {
    if (isOpen && user) {
      const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || undefined,
        role: UserRole.Teacher,
        dateOfBirth: formatDate(user.dateOfBirth) || "",
        busId: user.busId || "",
        classId: user.classId || "",
      });
    }
  }, [isOpen, user, reset]);

  // Clean up on close
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    if (!teacherId) return;

    try {
      // Only include fields that have been modified
      const userData: Partial<Teacher> = { _id: teacherId };
      const formValues = getValues();

      // Map dirty fields to userData
      Object.keys(dirtyFields).forEach((key) => {
        const fieldKey = key as keyof FormData;
        userData[fieldKey] = formValues[fieldKey];
      });

      // Ensure role is always set to Teacher
      userData.role = UserRole.Teacher;

      await dispatch(updateUser({ id: teacherId, user: userData })).unwrap();
      toast.current.show({ severity: "success", detail: "Teacher updated successfully" });
      onSubmit(userData as Teacher);
      onClose();
    } catch (err) {
      // toast.current.show({ severity: "error", detail: error });
    }
  }, [dispatch, teacherId, onSubmit, onClose, toast, dirtyFields, getValues]);

  const handleClose = useCallback(() => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to close?")) {
      return;
    }
    onClose();
  }, [isDirty, onClose]);

  const renderFormField = useCallback((
    name: keyof FormData,
    label: string,
    type = "text",
    placeholder?: string,
    icon?: React.ReactNode,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder || label}
        disabled={isSubmitting}
      />
    </div>
  ), [isSubmitting, register]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Edit3 className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <div>Update Teacher Information</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Modify teacher details below
              </div>
            </div>
          </DialogTitle>

          {isDirty && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You have unsaved changes. Don't forget to save your updates.
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderFormField("fullName", "Full Name", "text", "Enter full name", <UserIcon className="h-4 w-4" />)}
                  {renderFormField("email", "Email Address", "email", "Enter email address", <Mail className="h-4 w-4" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderFormField("phoneNumber", "Phone Number", "tel", "Enter phone number", <Phone className="h-4 w-4" />)}
                  {renderFormField("dateOfBirth", "Date of Birth", "date", "", <Calendar className="h-4 w-4" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Gender
                      <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
                    </Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting}>
                          <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Role
                      <Badge variant="secondary" className="text-xs px-1 py-0">Fixed</Badge>
                    </Label>
                    <Input value="Teacher" disabled className="bg-gray-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  Academic Information
                  <Badge variant="secondary" className="ml-auto">Optional</Badge>
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
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting}>
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
                    <Label htmlFor="busId" className="text-sm font-medium flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      Bus Route
                    </Label>
                    <Controller
                      name="busId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting}>
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
                </div>
              </CardContent>
            </Card>

            <Separator />

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
        )}
      </DialogContent>
    </Dialog>
  );
}