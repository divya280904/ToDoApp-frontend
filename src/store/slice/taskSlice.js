import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks from backend
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
    {
      withCredentials: true,
    }
  );
  return data;
});

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, thunkAPI) => {
    try {
      console.log("Creating task with:", taskData);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        taskData,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.error(
        "Create Task Error:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || "Create task failed"
      );
    }
  }
);

// Update an existing task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, task }) => {
    const updatedTask = { ...task, status: task.status };
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
      updatedTask,
      { withCredentials: true }
    );
    return data;
  }
);

// Delete a task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
    withCredentials: true,
  });
  return id;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
