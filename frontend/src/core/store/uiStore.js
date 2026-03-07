// src/core/store/uiStore.js
import { reactive, readonly } from 'vue';

const state = reactive({
  sidebarOpen: false,
});

export function useUIStore() {
  const openSidebar = () => {
    state.sidebarOpen = true;
  };
  const closeSidebar = () => {
    state.sidebarOpen = false;
  };
  const toggleSidebar = () => {
    state.sidebarOpen = !state.sidebarOpen;
  };

  // Expose sidebarOpen as readonly to prevent accidental mutation outside store
  return {
    state: readonly(state),
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
