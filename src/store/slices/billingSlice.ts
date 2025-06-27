
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Fee, Payment, BillingDashboard, FeeReport, Student } from "@/types/index";
import { billingService } from "@/services/billingService";

interface BillingState {
  // Fees
  fees: Fee[];
  studentFees: Fee[];
  
  // Payments
  payments: Payment[];
  studentPayments: Payment[];
  
  // Dashboard
  dashboard: BillingDashboard | null;
  
  // Reports
  feeReports: FeeReport[];
  
  // Students
  students: Student[];
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: BillingState = {
  fees: [],
  studentFees: [],
  payments: [],
  studentPayments: [],
  dashboard: null,
  feeReports: [],
  students: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Fee Management
export const fetchFees = createAsyncThunk(
  "billing/fetchFees",
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await billingService.getFees(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch fees");
    }
  }
);

export const fetchStudentFees = createAsyncThunk(
  "billing/fetchStudentFees",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await billingService.getStudentFees(studentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch student fees");
    }
  }
);

export const createFee = createAsyncThunk(
  "billing/createFee",
  async (feeData: Partial<Fee>, { rejectWithValue }) => {
    try {
      const response = await billingService.createFee(feeData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create fee");
    }
  }
);

export const updateFee = createAsyncThunk(
  "billing/updateFee",
  async (payload: { id: string; data: Partial<Fee> }, { rejectWithValue }) => {
    try {
      const response = await billingService.updateFee(payload.id, payload.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update fee");
    }
  }
);

// Payment Management
export const fetchPayments = createAsyncThunk(
  "billing/fetchPayments",
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await billingService.getPayments(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch payments");
    }
  }
);

export const submitPayment = createAsyncThunk(
  "billing/submitPayment",
  async (paymentData: Partial<Payment>, { rejectWithValue }) => {
    try {
      const response = await billingService.submitPayment(paymentData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit payment");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "billing/verifyPayment",
  async (payload: { id: string; status: 'verified' | 'rejected'; remarks?: string }, { rejectWithValue }) => {
    try {
      const response = await billingService.verifyPayment(payload.id, payload.status, payload.remarks);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to verify payment");
    }
  }
);

// Dashboard & Reports
export const fetchDashboard = createAsyncThunk(
  "billing/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await billingService.getDashboard();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch dashboard");
    }
  }
);

export const fetchFeeReports = createAsyncThunk(
  "billing/fetchFeeReports",
  async (filters: { class?: string; section?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await billingService.getFeeReports(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch fee reports");
    }
  }
);

export const fetchStudents = createAsyncThunk(
  "billing/fetchStudents",
  async (params: { search?: string }, { rejectWithValue }) => {
    try {
      const response = await billingService.getStudents(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch students");
    }
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Fees
      .addCase(fetchFees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fees = action.payload;
        // state.pagination = action.payload.pagination;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Student Fees
      .addCase(fetchStudentFees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentFees = action.payload;
      })
      .addCase(fetchStudentFees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Fee
      .addCase(createFee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fees.unshift(action.payload);
      })
      .addCase(createFee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Payments
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload;
        // state.pagination = action.payload.pagination;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Submit Payment
      .addCase(submitPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments.unshift(action.payload);
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Fee Reports
      .addCase(fetchFeeReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeReports = action.payload;
      })
      .addCase(fetchFeeReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetPagination } = billingSlice.actions;
export default billingSlice.reducer;
