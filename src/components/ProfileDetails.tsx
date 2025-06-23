"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Modal from "react-modal";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Activity,
  Calendar1Icon,
  XCircle,
  AlertCircle,
  Loader2,
  Edit,
  Settings,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { getProfile } from "@/store/slices/profileSlice";
import { cn } from "@/lib/utils"; // Utility for merging Tailwind classes (from shadcn/ui)

interface ProfileDetailsProps {
  onClose: () => void;
  studentId: string;
}

export default function ProfileDetails({ onClose, studentId }: ProfileDetailsProps) {
  const dispatch = useAppDispatch();
  const { profile, error, isLoading } = useAppSelector((state) => state.profile);

  const profileCategories = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Full Name", value: profile?.fullName || "N/A", icon: User },
        { label: "Gender", value: profile?.gender || "N/A", icon: User },
        {
          label: "Date of Birth",
          value: profile?.dateOfBirth
            ? new Date(profile.dateOfBirth).toDateString()
            : "N/A",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Contact Information",
      icon: Mail,
      fields: [
        { label: "Email", value: profile?.email || "N/A", icon: Mail },
        { label: "Phone Number", value: profile?.phoneNumber || "N/A", icon: Phone },
        { label: "Address", value: profile?.address || "N/A", icon: MapPin },
      ],
    },
    {
      title: "Academic Information",
      icon: MapPin,
      fields: [
        { label: "Class", value: profile?.classId?.name || "N/A", icon: MapPin },
        { label: "Section", value: profile?.sectionId?.name || "N/A", icon: Phone },
        {
          label: "Bus",
          value: profile?.busId
            ? `${profile.busId.route} (${profile.busId.busNumber})`
            : "N/A",
          icon: Mail,
        },
      ],
    },
  ];

  useEffect(() => {
    if (studentId) {
      dispatch(getProfile({ id: studentId }));
    }
  }, [dispatch, studentId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRetry = () => {
    if (studentId) {
      dispatch(getProfile({ id: studentId }));
    }
  };

  // Loading State with Skeleton UI
  if (isLoading) {
    return (
      <Modal
        isOpen
        onRequestClose={onClose}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        ariaHideApp={false}
        className="outline-none w-full max-w-[95%] sm:max-w-[90%] md:max-w-4xl mx-auto my-6"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto hide-scrollbar"
      >
        <div className="relative px-6 py-8 max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-2xl shadow-2xl animate-fade-in">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Skeleton className="h-52 w-full rounded-xl" />
              <Skeleton className="h-52 w-full rounded-xl" />
              <Skeleton className="h-52 w-full md:col-span-2 rounded-xl" />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // Error State with Animated Alert
  if (error) {
    return (
      <Modal
        isOpen
        onRequestClose={onClose}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        ariaHideApp={false}
        className="outline-none w-full max-w-[95%] sm:max-w-[90%] md:max-w-lg mx-auto my-6"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto hide-scrollbar"
      >
        <div className="relative px-6 py-8 max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-2xl shadow-2xl animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 z-10"
            aria-label="Close Modal"
          >
            <XCircle className="h-6 w-6 transition-colors duration-200" />
          </button>
          <Alert
            variant="destructive"
            className="max-w-md mx-auto animate-shake border-red-200 bg-red-50"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-lg font-semibold text-red-800">
              Error
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {typeof error === "string"
                ? error
                : "Failed to load profile. Please try again."}
            </AlertDescription>
            <div className="mt-4 flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleRetry}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      </Modal>
    );
  }

  // Profile Data Display
  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
      className="outline-none w-full max-w-[95%] sm:max-w-[90%] md:max-w-4xl mx-auto my-6"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto hide-scrollbar"
    >
      <div className="relative px-6 py-8 max-h-[90vh] overflow-y-auto hide-scrollbar bg-gray-50 rounded-2xl shadow-2xl animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 z-10"
          aria-label="Close Modal"
        >
          <XCircle className="h-6 w-6 transition-colors duration-200" />
        </button>

        <div className="space-y-8">
          {/* Header Section */}
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-teal-600 to-teal-800">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start text-white">
                <div className="relative">
                  <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white/30 shadow-lg transition-transform duration-300 hover:scale-105">
                    <AvatarImage
                      src="/placeholder.svg?height=144&width=144"
                      alt={profile?.fullName || "N/A"}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                      {getInitials(profile?.fullName || "N/A")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white",
                      profile?.isLogin ? "bg-green-500 shadow-lg" : "bg-gray-400"
                    )}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 font-inter">
                    {profile?.fullName || "N/A"}
                  </h1>
                  <p className="text-xl text-white/90 mb-4 font-inter">
                    {profile?.role || "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Badge
                      className="bg-white/20 text-white border-white/40 text-sm hover:bg-white/30 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {profile?.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-sm border-white/40 hover:bg-opacity-30 transition-colors",
                        profile?.isLogin
                          ? "bg-green-500/20 text-green-100"
                          : "bg-gray-500/20 text-gray-100"
                      )}
                    >
                      <Activity className="h-4 w-4 mr-1" />
                      {profile?.isLogin ? "Online" : "Offline"}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/40 text-sm hover:bg-white/30 transition-colors">
                      <Calendar1Icon className="h-4 w-4 mr-1" />
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toDateString()
                        : "N/A"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none hover:from-teal-600 hover:to-teal-700 text-sm shadow-md transition-all duration-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none hover:from-gray-700 hover:to-gray-800 text-sm shadow-md transition-all duration-300"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details by Category */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {profileCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;

              return (
                <Card
                  key={categoryIndex}
                  className={cn(
                    "group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white hover:-translate-y-1",
                    category.title === "Academic Information" ? "md:col-span-2" : ""
                  )}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold font-inter">
                      <div className="p-2 rounded-lg bg-teal-100 text-teal-600 group-hover:scale-110 transition-transform duration-300">
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.fields.map((field, fieldIndex) => {
                      const FieldIcon = field.icon;

                      return (
                        <div
                          key={fieldIndex}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                            <FieldIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 font-inter">
                              {field.label}
                            </p>
                            <p className="text-base font-semibold text-gray-900 break-words font-inter">
                              {field.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}