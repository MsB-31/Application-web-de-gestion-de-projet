import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TaskState, CreateTaskPayload, TaskStatus } from '../../types';
import { taskService } from '../../services/taskService';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchByProject',
  async ({ projectId, statut }: { projectId: string; statut?: TaskStatus }, { rejectWithValue }) => {
    try {
      return await taskService.getTasksByProject(projectId, { statut });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      return await taskService.createTask(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, statut }: { id: string; statut: TaskStatus }, { rejectWithValue }) => {
    try {
      return await taskService.updateTaskStatus(id, statut);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks(state) { state.tasks = []; },
    clearError(state) { state.error = null; },
    // Mise à jour optimiste pour le drag & drop
    moveTaskOptimistic(state, action) {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) task.statut = newStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearTasks, clearError, moveTaskOptimistic } = taskSlice.actions;
export default taskSlice.reducer;
