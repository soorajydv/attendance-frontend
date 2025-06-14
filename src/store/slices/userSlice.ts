import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Gender, UserRole, type User } from "@/types"
import { userService } from "@/services/userService"

interface UserState {
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  users?: User[];
  user: User | null;
}


const initialState: UserState = {
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  user: null
}

export const addUser = createAsyncThunk("users/addUser",
  async ( user:User, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(user)
      return response
    } catch (error: any) {
      const message = error?.response?.data?.message;
      return rejectWithValue(message);
    }
  })


export const updateUser = createAsyncThunk(
  "users/updateUser", async ( payload: { id: string, user: Partial<User> }, { rejectWithValue }) => {
    try {
      const { id, user } = payload;
      const response = await userService.updateUser(id, user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(id);
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete bus")
    }
  })

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder

      // Create user
      .addCase(addUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.buses
        state.pagination = action.payload.pagination
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false
        state.error =action.payload as string; 
        state.user = {} as any;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.pagination = action.payload.pagination
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.meta.arg;
        state.isLoading = false;
        state.users = state.users?.filter(user => user._id !== deletedUserId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete bus";
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer