"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks";
import { loginUser, setUser } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants";
import type { LoginFormData } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";
import { setCookie } from "@/utils/cookies.utils";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "admin@gmail.com",
    password: "Password@123",
  });

  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      startTransition(async () => {
        try {
          const result = await dispatch(loginUser(formData)).unwrap();
          if (result.accessToken) {
            const { user, accessToken } = result;
            dispatch(setUser(user));

            setCookie("accessToken", accessToken);
            localStorage.setItem("accessToken", accessToken); // Optional

            toast.current.show({
              severity: "success",
              summary: "Login successful",
              life: 3000,
            });

            const routeByRole:any = {
              ADMIN: ROUTES.DASHBOARD,
              TEACHER: ROUTES.TEACHERS,
              STUDENT: ROUTES.STUDENTS,
            };

            const redirectPath = routeByRole[user.role];
            if (redirectPath) {
              router.push(redirectPath);
            } else {
              toast.current.show({
                severity: "error",
                summary: "Invalid Role",
              });
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
      });
    },
    [formData, dispatch, router, toast]
  );

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-r from-[#ffffff] via-[#f7f7f7] to-[#eceff3] p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex w-full transition-all duration-500 mb-4">
          <h2 className="w-full text-center text-2xl font-semibold text-[#1a75ff]">
            {isSignup ? "Signup Form" : "Login Form"}
          </h2>
        </div>

        {/* Toggle Login/Signup Switch */}
        <div className="relative flex justify-between items-center h-12 border border-gray-300 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`w-1/2 h-full text-center z-10 font-medium ${
              !isSignup ? "text-white" : "text-black"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`w-1/2 h-full text-center z-10 font-medium ${
              isSignup ? "text-white" : "text-black"
            }`}
          >
            Signup
          </button>
          <div
            className={`absolute top-0 h-full w-1/2 bg-gradient-to-r from-[#003366] via-[#0059b3] to-[#0073e6] rounded-xl transition-all duration-500 ${
              isSignup ? "left-1/2" : "left-0"
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

          <div className="mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-gradient-to-r from-[#003366] via-[#0059b3] to-[#0073e6] text-white font-medium rounded-xl flex items-center justify-center disabled:opacity-50"
            >
              {isPending ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : isSignup ? "Signup" : "Login"}
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
            <p>Email: admin@gmail.com</p>
            <p>Password: Password@123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
