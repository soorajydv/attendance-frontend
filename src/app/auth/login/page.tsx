"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants";
import type { LoginFormData } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";
import { setCookie } from "@/utils/cookies.utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "soorajydv9@gmail.com",
    password: "Password@123",
  });

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result.success) {
        const { role } = result.data.user;
        const accessToken = result.data.accessToken;

        setCookie("accessToken", accessToken); // save token in cookie
        localStorage.setItem("accessToken",accessToken)   // save refresh token - TODO

        switch (role) {
          case "SU":
            router.push(ROUTES.DASHBOARD);
            break;
          case "TEACHER":
            router.push(ROUTES.TEACHERS);
            break;
          case "STUDENT":
            router.push(ROUTES.STUDENTS);
            break;
          default:
            toast.current.show({ severity: "error", summary: "Invalid Role" });
        }
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Login Failed",
        detail: String(error),
        life: 3000,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-r from-[#4985c2] via-[#87b1db] to-[#4985c2] p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex w-full transition-all duration-500 mb-4">
          <h2 className="w-full text-center text-2xl font-semibold text-[#1a75ff]">
            {isSignup ? "Signup Form" : "Login Form"}
          </h2>
        </div>

        <div className="relative flex justify-between items-center h-12 border border-gray-300 rounded-xl mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`w-1/2 h-full text-center z-10 font-medium ${!isSignup ? "text-white" : "text-black"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`w-1/2 h-full text-center z-10 font-medium ${isSignup ? "text-white" : "text-black"
              }`}
          >
            Signup
          </button>
          <div
            className={`absolute top-0 h-full w-1/2 bg-gradient-to-r from-[#003366] via-[#0059b3] to-[#0073e6] rounded-xl transition-all duration-500 ${isSignup ? "left-1/2" : "left-0"
              }`}
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full px-2">
          <div className="mt-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1a75ff] focus:outline-none"
            />
          </div>
          <div className="mt-5">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1a75ff] focus:outline-none"
            />
          </div>

          {!isSignup && (
            <div className="text-sm text-right mt-2">
              <a href="#" className="text-[#1a75ff] hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <div className="mt-6 relative group">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#003366] via-[#0059b3] to-[#0073e6] text-white font-medium cursor-pointer rounded-xl disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner /> : isSignup ? "Signup" : "Login"}
            </button>
          </div>

          <div className="text-center mt-6 text-sm">
            {isSignup ? "Already have an account?" : "Not a member?"}{" "}
            <button
              type="button"
              className="text-[#1a75ff] hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login here" : "Signup now"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials (pre-filled):</p>
            <p>Email: admin@school.com</p>
            <p>Password: password</p>
          </div>
        </form>
      </div>
    </div>
  );
}
