// redux/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type User } from "@/types";
import { userService } from "@/services/userService";

interface UserState {
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  users: User[];
  selectedUser: User | null;
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
  users: [],
  selectedUser: null,
};

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await userService.getUserById(userId);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch user");
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const res = await userService.createUser(user);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }: { id: string; user: Partial<User> }, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser(id, user);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.selectedUser = null;
      })

      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const newUser = action.payload.data;
        state.users.push(newUser);
        state.selectedUser = newUser;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        state.selectedUser = updated;
        const index = state.users.findIndex((u) => u._id === updated._id);
        if (index !== -1) state.users[index] = updated;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const id = action.payload;
        state.isLoading = false;
        state.selectedUser = null;
        state.users = state.users.filter((u) => u._id !== id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
