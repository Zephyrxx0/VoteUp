import { create } from 'zustand';

interface UIState {
  language: string; // BCP 47
  sidebarOpen: boolean;
  mapDrawerOpen: boolean;
  fcmPermissionDismissed: boolean;

  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
  openMapDrawer: () => void;
  closeMapDrawer: () => void;
  dismissFcmPermission: () => void;
}

export const useUiStore = create<UIState>((set) => ({
  language: 'en',
  sidebarOpen: false,
  mapDrawerOpen: false,
  fcmPermissionDismissed: false,

  setLanguage: (lang) => set({ language: lang }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openMapDrawer: () => set({ mapDrawerOpen: true }),
  
  closeMapDrawer: () => set({ mapDrawerOpen: false }),
  
  dismissFcmPermission: () => set({ fcmPermissionDismissed: true })
}));
