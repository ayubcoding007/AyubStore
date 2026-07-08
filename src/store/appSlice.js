import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';

// Admin 
export const getAllApps = createAsyncThunk(
  'apps/getAllApps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/apps');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const blockApp = createAsyncThunk(
  'apps/blockApp',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/block-app/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const unblockApp = createAsyncThunk(
  'apps/unblockApp',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/unblock-app/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteApp = createAsyncThunk(
  'apps/deleteApp',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete-app/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getAppStats = createAsyncThunk(
  'apps/getAppStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/apps/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const searchApps = createAsyncThunk(
  'apps/searchApps',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/apps/search?query=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Move to Pending
export const moveToPending = createAsyncThunk(
  'apps/moveToPending',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/admin/move-to-pending/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


// Developer Thunks
export const getMyApps = createAsyncThunk(
  'apps/getMyApps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/developer/my-apps');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteDeveloperApp = createAsyncThunk(
  'apps/deleteDeveloperApp',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/developer/app/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Slice
const initialState = {
  apps: [],
  myApps: [],
  stats: null,
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Apps
      .addCase(getAllApps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllApps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apps = action.payload.apps || [];
      })
      .addCase(getAllApps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get My Apps
      .addCase(getMyApps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyApps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myApps = action.payload.apps || [];
      })
      .addCase(getMyApps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Block App
      .addCase(blockApp.fulfilled, (state, action) => {
        const updated = action.payload.app;
        const index = state.apps.findIndex(a => a._id === updated._id);
        if (index !== -1) state.apps[index] = updated;
        alert('App blocked successfully');
      })
      .addCase(blockApp.rejected, (state, action) => {
        alert(action.payload || 'Failed to block app');
      })

      // Unblock App
      .addCase(unblockApp.fulfilled, (state, action) => {
        const updated = action.payload.app;
        const index = state.apps.findIndex(a => a._id === updated._id);
        if (index !== -1) state.apps[index] = updated;
        alert('App unblocked successfully');
      })
      .addCase(unblockApp.rejected, (state, action) => {
        alert(action.payload || 'Failed to unblock app');
      })

      // Delete App (Admin)
      .addCase(deleteApp.fulfilled, (state, action) => {
        state.apps = state.apps.filter(a => a._id !== action.payload);
        alert('App deleted successfully');
      })
      .addCase(deleteApp.rejected, (state, action) => {
        alert(action.payload || 'Failed to delete app');
      })

      // Delete Developer App
      .addCase(deleteDeveloperApp.fulfilled, (state, action) => {
        state.myApps = state.myApps.filter(a => a._id !== action.payload);
        alert('App deleted successfully');
      })
      .addCase(deleteDeveloperApp.rejected, (state, action) => {
        alert(action.payload || 'Failed to delete app');
      })

      // Get App Stats
      .addCase(getAppStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })

      // Search Apps
      .addCase(searchApps.fulfilled, (state, action) => {
        state.apps = action.payload.apps || [];
      })

      // Move to Pending
      .addCase(moveToPending.fulfilled, (state, action) => {
        const updated = action.payload.app;
        const index = state.apps.findIndex(a => a._id === updated._id);
        if (index !== -1) state.apps[index] = updated;
        alert('App moved to pending successfully');
      })
      .addCase(moveToPending.rejected, (state, action) => {
        alert(action.payload || 'Failed to move app to pending');
      });
  },
});

export const { clearError } = appSlice.actions;
export default appSlice.reducer;