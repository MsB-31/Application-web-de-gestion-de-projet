import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProjectState, CreateProjectPayload } from '../../types';
import { projectService } from '../../services/projectService';

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 9,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params: { page?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}, { rejectWithValue }) => {
    try {
      return await projectService.getProjects(params);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await projectService.getProject(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (payload: CreateProjectPayload, { rejectWithValue }) => {
    try {
      return await projectService.createProject(payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, payload }: { id: string; payload: Partial<CreateProjectPayload> }, { rejectWithValue }) => {
    try {
      return await projectService.updateProject(id, payload);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    clearCurrentProject(state) { state.currentProject = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setPage, clearCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
