import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Improved helper to get JWT token from localStorage
const getAuthHeaders = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      return {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        withCredentials: true,
      };
    } else {
      console.warn("User token not found in localStorage.");
      return { withCredentials: true };
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return { withCredentials: true };
  }
};

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, thunkAPI) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch tasks");
  }
});

// Create task
export const createTask = createAsyncThunk("tasks/createTask", async (taskData, thunkAPI) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
      taskData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Create Task Error:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || "Create task failed");
  }
});

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, task }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
        task,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Update task failed");
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, thunkAPI) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, getAuthHeaders());
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Delete task failed");
  }
});

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
