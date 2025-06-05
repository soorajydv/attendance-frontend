"use client"

import React, { createContext, useContext, useRef, RefObject } from "react"
import { Toast } from "primereact/toast"

// Define the type of the context value (RefObject to Toast or null)
const ToastContext = createContext<RefObject<Toast> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast>(null) as any

  return (
    <ToastContext.Provider value={toastRef}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const toastRef = useContext(ToastContext)

  if (!toastRef) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return toastRef
}
