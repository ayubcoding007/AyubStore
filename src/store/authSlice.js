import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';

// Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      // console.log('Login Attempt:', { email, role });
      
      const endpoint = role === 'admin' ? '/admin/login' : '/developer/login';
      const response = await axiosInstance.post(endpoint, { email, password });
      
      // console.log('Full Response:', response.data);
      
      const token = response.data.token;
      
      if (!token) {
        console.error('No token in response!');
        return rejectWithValue('No token received from server');
      }
      
      let userData;
      if (role === 'admin') {
        userData = {
          id: 'admin_001',
          email: email,
          name: 'Administrator',
          role: 'admin'
        };
      } else {
        userData = response.data.developer || response.data.Developer;
        
        if (!userData) {
          // console.log('No developer data in response, creating fallback');
          userData = {
            id: 'dev_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            role: 'developer',
            isApproved: true
          };
        }
      }
      
      // Save role-specific data to avoid conflict
      localStorage.setItem(`${role}_token`, token);
      localStorage.setItem(`${role}_user`, JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', role);
      
      return { user: userData, role };
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || !role) {
        console.log('No token or role found');
        
        // Check role-specific tokens as fallback
        const adminToken = localStorage.getItem('admin_token');
        const devToken = localStorage.getItem('developer_token');
        
        if (adminToken) {
          localStorage.setItem('token', adminToken);
          localStorage.setItem('role', 'admin');
          const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
          if (userData && userData.email) {
            return { user: userData, role: 'admin' };
          }
        }
        
        if (devToken) {
          localStorage.setItem('token', devToken);
          localStorage.setItem('role', 'developer');
          const userData = JSON.parse(localStorage.getItem('developer_user') || '{}');
          if (userData && userData.email) {
            console.log('Restored developer session from role-specific data');
            return { user: userData, role: 'developer' };
          }
        }
        
        localStorage.clear();
        return rejectWithValue('Not authenticated');
      }

      const endpoint = role === 'admin' ? '/admin/is-auth' : '/developer/is-auth';
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.success === true) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Auth successful');
        return { user: userData, role: role };
      } else {
        console.log('Auth check failed');
        localStorage.clear();
        return rejectWithValue('Auth failed');
      }
    } catch (error) {
      console.error('Check Auth Error:', error.message);
      localStorage.clear();
      return rejectWithValue('Not authenticated');
    }
  }
);

// Logout 
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem('role');
      
      if (!role) {
        localStorage.clear();
        return rejectWithValue('No role found');
      }
      
      const endpoint = role === 'admin' ? '/admin/logout' : '/developer/logout';
      
      // Get token
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Try POST logout
          await axiosInstance.post(endpoint);
         
        } catch (postError) {
          console.log('POST logout failed, trying GET...');
          try {
            // Fallback to GET
            await axiosInstance.get(endpoint);
            console.log('GET logout successful');
          } catch (getError) {
            console.log('GET logout also failed:', getError.message);
          }
        }
      }
      
      // Clear everything
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Logout Error:', error.response?.data);
      // Even if API fails, clear everything
      localStorage.clear();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Slice
const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      });
  },
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer;