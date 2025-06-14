import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { PrimeReactProvider } from "primereact/api"
import { ToastProvider } from "@/components/providers/ToastProvider"
import { QueryProvider } from "@/components/providers/QueryProvider" // ✅

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "School Management System",
  description: "A comprehensive school management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <QueryProvider> {/* ✅ Add here */}
            <PrimeReactProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </PrimeReactProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
