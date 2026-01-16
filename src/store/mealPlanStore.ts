import { create } from 'zustand';
import { MealPlan, MealPlanDetail, Recipe } from '@/types/database.types';

interface MealPlanStore {
  currentPlan: MealPlan | null;
  planDetails: (MealPlanDetail & { recipe?: Recipe })[];
  setCurrentPlan: (plan: MealPlan | null) => void;
  setPlanDetails: (details: (MealPlanDetail & { recipe?: Recipe })[]) => void;
  updateMealDetail: (detailId: string, updates: Partial<MealPlanDetail>) => void;
  replaceMeal: (detailId: string, newRecipe: Recipe) => void;
  clearPlan: () => void;
}

export const useMealPlanStore = create<MealPlanStore>((set) => ({
  currentPlan: null,
  planDetails: [],
  
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  
  setPlanDetails: (details) => set({ planDetails: details }),
  
  updateMealDetail: (detailId, updates) =>
    set((state) => ({
      planDetails: state.planDetails.map((detail) =>
        detail.id === detailId ? { ...detail, ...updates } : detail
      ),
    })),
  
  replaceMeal: (detailId, newRecipe) =>
    set((state) => ({
      planDetails: state.planDetails.map((detail) =>
        detail.id === detailId
          ? { ...detail, recipe_id: newRecipe.id, recipe: newRecipe }
          : detail
      ),
    })),
  
  clearPlan: () => set({ currentPlan: null, planDetails: [] }),
}));





