import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';

// Admin 
// Get Pending Developers
export const getPendingDevelopers = createAsyncThunk(
  'developers/getPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/pending-developers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Approve Developer
export const approveDeveloper = createAsyncThunk(
  'developers/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/approve-developer/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Reject Developer
export const rejectDeveloper = createAsyncThunk(
  'developers/reject',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/reject-developer/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get All Developers (For Admin Developers Page)
export const getAllDevelopers = createAsyncThunk(
  'developers/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/developers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Block Developer
export const blockDeveloper = createAsyncThunk(
  'developers/block',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/block-developer/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Unblock Developer
export const unblockDeveloper = createAsyncThunk(
  'developers/unblock',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/unblock-developer/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Slice
const initialState = {
  pendingDevelopers: [],
  allDevelopers: [],
  isLoading: false,
  error: null,
};

const developerSlice = createSlice({
  name: 'developers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pending Developers
      .addCase(getPendingDevelopers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPendingDevelopers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingDevelopers = action.payload.developers || [];
      })
      .addCase(getPendingDevelopers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Approve Developer
      .addCase(approveDeveloper.fulfilled, (state, action) => {
        const dev = action.payload.developer;
        state.pendingDevelopers = state.pendingDevelopers.filter(d => d._id !== dev._id);
        alert('Developer approved successfully');
      })
      .addCase(approveDeveloper.rejected, (state, action) => {
        alert(action.payload || 'Failed to approve developer');
      })

      // Reject Developer
      .addCase(rejectDeveloper.fulfilled, (state, action) => {
        state.pendingDevelopers = state.pendingDevelopers.filter(d => d._id !== action.payload);
        alert('Developer rejected successfully');
      })
      .addCase(rejectDeveloper.rejected, (state, action) => {
        alert(action.payload || 'Failed to reject developer');
      })

      // Get All Developers
      .addCase(getAllDevelopers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDevelopers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allDevelopers = action.payload.developers || [];
      })
      .addCase(getAllDevelopers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Block Developer
      .addCase(blockDeveloper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.developer;
        const index = state.allDevelopers.findIndex(d => d._id === updated._id);
        if (index !== -1) state.allDevelopers[index] = updated;
        alert('Developer blocked successfully');
      })
      .addCase(blockDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        alert(action.payload || 'Failed to block developer');
      })

      // Unblock Developer
      .addCase(unblockDeveloper.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unblockDeveloper.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.developer;
        const index = state.allDevelopers.findIndex(d => d._id === updated._id);
        if (index !== -1) state.allDevelopers[index] = updated;
        alert('Developer unblocked successfully');
      })
      .addCase(unblockDeveloper.rejected, (state, action) => {
        state.isLoading = false;
        alert(action.payload || 'Failed to unblock developer');
      });
  },
});

export const { clearError } = developerSlice.actions;
export default developerSlice.reducer;