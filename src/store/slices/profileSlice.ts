import { profileService } from "@/services/profileService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState:any = {
    profile:{},
    isLoading: false,
    error: null,
    message: null
}

export const getProfile = createAsyncThunk(
    "profile/getProfile", async (params: { id: string }, { rejectWithValue }) => {
        try {
            const response = await profileService.getProfile(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers(builder) {
        builder
        .addCase(getProfile.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getProfile.fulfilled,(state,action)=>{
            state.profile = action.payload.data
            state.message = action.payload.message
            state.isLoading = false
        })
        .addCase(getProfile.rejected,(state,action:any)=>{
            state.error = action.payload.message
            state.isLoading = false
        })
    },
})

export default profileSlice.reducer;