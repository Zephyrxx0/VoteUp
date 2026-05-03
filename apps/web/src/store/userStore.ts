import { create } from 'zustand';
import { UserProfile } from '@voteup/contracts';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  uid: string | null;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  authLoading: boolean;

  setAuthUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  updateRegistrationStatus: (status: string) => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  uid: null,
  isAnonymous: false,
  isAuthenticated: false,
  profile: null,
  authLoading: true,

  setAuthUser: (user) => 
    set({
      user,
      uid: user ? user.uid : null,
      isAnonymous: user ? user.isAnonymous : false,
      isAuthenticated: !!user,
    }),
  
  setProfile: (profile) => 
    set({ profile }),
    
  updateRegistrationStatus: (status) => 
    set((state) => ({
      profile: state.profile 
        ? { ...state.profile, registrationStatus: status } 
        : null
    })),
    
  setAuthLoading: (loading) => 
    set({ authLoading: loading }),
}));
