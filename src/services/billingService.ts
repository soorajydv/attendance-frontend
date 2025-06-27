
import { Api } from "@/configs/api.config";
import { mockDashboard, mockFees, mockPayments, mockStudents } from "@/data/mockBillingData";
import type { Fee, Payment, BillingDashboard, FeeReport, Student } from "@/types/index";

export const billingService = {
  // Fee Management
  getFees: async (params: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    // const response = await Api.get(`/fees?${queryParams.toString()}`);
    return mockFees;
    // return response.data.data;
  },

  getStudentFees: async (studentId: string) => {
    // const response = await Api.get(`/fees/student/${studentId}`);
    return mockStudents;
    // return response.data.data;
  },

  createFee: async (feeData: Partial<Fee>) => {
    const response = await Api.post("/fees", feeData);
    return response.data.data;
  },

  updateFee: async (id: string, data: Partial<Fee>) => {
    const response = await Api.patch(`/fees/${id}`, data);
    return response.data.data;
  },

  deleteFee: async (id: string) => {
    const response = await Api.delete(`/fees/${id}`);
    return response.data;
  },

  // Payment Management
  getPayments: async (params: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    // const response = await Api.get(`/payments?${queryParams.toString()}`);
    // return response.data.data;
    return mockPayments;
  },

  getStudentPayments: async (studentId: string) => {
    const response = await Api.get(`/payments/student/${studentId}`);
    return response.data.data;
  },

  submitPayment: async (paymentData: Partial<Payment>) => {
    const response = await Api.post("/payments", paymentData);
    return response.data.data;
  },

  verifyPayment: async (id: string, status: 'verified' | 'rejected', remarks?: string) => {
    const response = await Api.patch(`/payments/${id}/verify`, { status, remarks });
    return response.data.data;
  },

  uploadReceipt: async (paymentId: string, file: File) => {
    const formData = new FormData();
    formData.append("receipt", file);
    const response = await Api.post(`/payments/${paymentId}/receipt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Dashboard & Reports
  getDashboard: async (): Promise<BillingDashboard> => {
    // const response = await Api.get("/billing/dashboard");
    console.log("mockDashboard",mockDashboard);
    
    return mockDashboard;
  },

  getFeeReports: async (filters: { class?: string; section?: string; status?: string }): Promise<FeeReport[]> => {
    const queryParams = new URLSearchParams();
    if (filters.class) queryParams.append("class", filters.class);
    if (filters.section) queryParams.append("section", filters.section);
    if (filters.status) queryParams.append("status", filters.status);

    const response = await Api.get(`/billing/reports/fees?${queryParams.toString()}`);
    return response.data.data;
  },

  exportFeeReports: async (filters: { class?: string; section?: string; status?: string }, format: 'csv' | 'pdf') => {
    const queryParams = new URLSearchParams();
    if (filters.class) queryParams.append("class", filters.class);
    if (filters.section) queryParams.append("section", filters.section);
    if (filters.status) queryParams.append("status", filters.status);
    queryParams.append("format", format);

    const response = await Api.get(`/billing/reports/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Student Management
  getStudents: async (params: { search?: string }): Promise<Student[]> => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);

    const response = await Api.get(`/students?${queryParams.toString()}`);
    return response.data.data;
  },

  // Reminders
  sendReminder: async (studentIds: string[], type: 'upcoming' | 'overdue' | 'rejected') => {
    const response = await Api.post("/billing/reminders", { studentIds, type });
    return response.data.data;
  },
};
