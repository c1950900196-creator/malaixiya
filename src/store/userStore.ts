import { create } from 'zustand';
import { UserProfile, DietaryRestriction } from '@/types/database.types';

interface UserStore {
  profile: UserProfile | null;
  restrictions: DietaryRestriction[];
  setProfile: (profile: UserProfile | null) => void;
  setRestrictions: (restrictions: DietaryRestriction[]) => void;
  addRestriction: (restriction: DietaryRestriction) => void;
  removeRestriction: (restrictionId: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  restrictions: [],
  
  setProfile: (profile) => set({ profile }),
  
  setRestrictions: (restrictions) => set({ restrictions }),
  
  addRestriction: (restriction) =>
    set((state) => ({
      restrictions: [...state.restrictions, restriction],
    })),
  
  removeRestriction: (restrictionId) =>
    set((state) => ({
      restrictions: state.restrictions.filter((r) => r.id !== restrictionId),
    })),
  
  clearUser: () => set({ profile: null, restrictions: [] }),
}));



