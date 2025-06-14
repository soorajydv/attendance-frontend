import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Edit,
  Settings,
  Activity,
  Calendar1Icon,
  XCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { getProfile } from "@/store/slices/profileSlice";

export default function ProfileDetails({ onClose, studentId }: any) {
  const dispatch = useAppDispatch();
  const { profile, error, isLoading } = useAppSelector((state) => state.profile);

  const profileCategories = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Full Name", value: profile.fullName, icon: User },
        { label: "Gender", value: profile.gender, icon: User },
        {
          label: "Date of Birth",
          value: new Date(profile.dateOfBirth).toDateString(),
          icon: Calendar,
        },
      ],
    },
    {
      title: "Contact Information",
      icon: Mail,
      fields: [
        { label: "Email", value: profile.email, icon: Mail },
        { label: "Phone Number", value: profile.phoneNumber, icon: Phone },
        { label: "Address", value: profile.address || "N/A", icon: MapPin },
      ],
    },
    {
      title: "Academic Information",
      icon: Mail,
      fields: [
        { label: "Class", value: profile.class, icon: Mail },
        { label: "Section", value: profile.section, icon: Phone },
        { label: "Bus", value: profile.bus || "N/A", icon: MapPin },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getProfile({ id: studentId }));
  }, [dispatch]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
      className="outline-none w-full max-w-[95%] sm:max-w-[90%] md:max-w-3xl mx-auto my-4 sm:my-6"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto"
    >
      <div className="relative px-4 sm:px-6 md:px-0 max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10"
          aria-label="Close Modal"
        >
          <XCircle
            className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700 hover:text-gray-300 transition-colors duration-200"
            style={{ strokeWidth: 2 }}
          />
        </button>

        <div className="space-y-6 py-6 sm:py-8">
          {/* Header Section */}
          <Card className="overflow-hidden border-0 shadow-xl mt-[-1.9rem] bg-gradient-to-r from-blue-600 to-purple-600">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-start text-white">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 border-4 border-white/20 shadow-2xl">
                    <AvatarImage
                      src="/placeholder.svg?height=128&width=128"
                      alt={profile?.fullName}
                    />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-white/10 text-white">
                      {getInitials(profile.fullName || "N/A")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-2 -right-2 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border-4 border-white ${profile.isLogin ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {profile.fullName}
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 mb-3 sm:mb-4">{profile.role}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 text-xs sm:text-sm"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`border-white/30 text-xs sm:text-sm ${profile.isLogin ? "bg-green-500/20 text-green-100" : "bg-gray-500/20 text-gray-100"}`}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {profile.isLogin ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="border-white/30 text-xs sm:text-sm">
                      <Calendar1Icon className="h-3 w-3 mr-1" />
                      {profile.createdAt ? new Date(profile.createdAt).toDateString() : "N/A"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs sm:text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs sm:text-sm"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details by Category */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {profileCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;

              return (
                <Card
                  key={categoryIndex}
                  className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 ${category.title === "Academic Information" ? "md:col-span-2" : ""}`}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                        <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {category.fields.map((field, fieldIndex) => {
                      const FieldIcon = field.icon;
                      const isStatus =
                        field.label === "Verified" ||
                        field.label === "Login Status";

                      return (
                        <div
                          key={fieldIndex}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`p-1.5 sm:p-2 rounded-lg ${field.label === "Verified" && profile.isVerified
                                ? "bg-green-100 text-green-600"
                                : field.label === "Login Status" && profile.isLogin
                                ? "bg-green-100 text-green-600"
                                : field.label === "Login Status" && !profile.isLogin
                                ? "bg-gray-100 text-gray-600"
                                : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            <FieldIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">
                              {field.label}
                            </p>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                                {field.value}
                              </p>
                              {isStatus && (
                                <div
                                  className={`h-2 w-2 rounded-full ${(field.label === "Verified" && profile.isVerified) || (field.label === "Login Status" && profile.isLogin) ? "bg-green-500" : "bg-gray-400"}`}
                                />
                              )}
                            </div>
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