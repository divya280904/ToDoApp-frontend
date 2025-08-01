import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
};

// Async Thunks

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );

    const userWithToken = { ...data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  }
);

// REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      { name, email, password },
      { withCredentials: true }
    );

    const userWithToken = { ...data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  }
);

// LOGOUT
export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {}, { withCredentials: true });
  localStorage.removeItem('user');
});

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, currentPassword, newPassword }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
      { name, currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        withCredentials: true,
      }
    );

    const updatedUser = { ...data, token: user.token };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
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

      // Register
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

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // Update Profile
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
