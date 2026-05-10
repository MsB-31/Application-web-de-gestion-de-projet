import { createSlice } from '@reduxjs/toolkit';
import type { UiState, Notification } from '../../types';

const initialState: UiState = {
  sidebarOpen: true,
  notifications: [],
  globalLoading: false,
};

let notifId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    addNotification(state, action: { payload: Omit<Notification, 'id'> }) {
      state.notifications.push({
        ...action.payload,
        id: String(++notifId),
      });
    },
    removeNotification(state, action: { payload: string }) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
