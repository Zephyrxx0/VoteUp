import { create } from 'zustand';
import { UserProfile } from '@voteup/contracts';

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateRegistrationStatus: (status: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    history: [],
    badges: [],
    homeCountry: 'India',
    newCountry: 'India',
    preferredLanguage: 'en',
    registrationStatus: 'registered',
    updatedAt: new Date(),
  },

  setProfile: (profile) => 
    set({ profile }),
    
  updateRegistrationStatus: (status) => 
    set((state) => ({
      profile: state.profile 
        ? { ...state.profile, registrationStatus: status } 
        : null
    })),
}));
