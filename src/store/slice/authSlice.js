import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
};

// Async actions

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );

    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      { name, email, password },
      { withCredentials: true }
    );

    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {}, { withCredentials: true });
  localStorage.removeItem('user');
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, currentPassword, newPassword }) => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
      { name, currentPassword, newPassword },
      { withCredentials: true }
    );

    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      });
  },
});

export default authSlice.reducer;
