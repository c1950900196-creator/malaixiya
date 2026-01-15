import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShoppingListItem, Ingredient } from '@/types/database.types';

interface CachedShoppingList {
  mealPlanId: string;
  items: (ShoppingListItem & { ingredient?: Ingredient })[];
  lastUpdated: number; // timestamp
}

interface ShoppingListStore {
  // 缓存的购物清单
  cache: CachedShoppingList | null;
  
  // 缓存有效期（毫秒）- 默认 30 分钟
  cacheValidityMs: number;
  
  // 设置缓存
  setCache: (mealPlanId: string, items: (ShoppingListItem & { ingredient?: Ingredient })[]) => void;
  
  // 获取缓存（如果有效）
  getCache: (mealPlanId: string) => (ShoppingListItem & { ingredient?: Ingredient })[] | null;
  
  // 检查缓存是否有效
  isCacheValid: (mealPlanId: string) => boolean;
  
  // 清除缓存
  clearCache: () => void;
  
  // 更新单个项目（勾选状态）
  updateItem: (itemId: string, updates: Partial<ShoppingListItem>) => void;
  
  // 强制标记缓存为失效
  invalidateCache: () => void;
}

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set, get) => ({
      cache: null,
      cacheValidityMs: 30 * 60 * 1000, // 30 分钟
      
      setCache: (mealPlanId, items) => {
        set({
          cache: {
            mealPlanId,
            items,
            lastUpdated: Date.now(),
          },
        });
      },
      
      getCache: (mealPlanId) => {
        const state = get();
        if (!state.cache) return null;
        if (state.cache.mealPlanId !== mealPlanId) return null;
        if (!state.isCacheValid(mealPlanId)) return null;
        return state.cache.items;
      },
      
      isCacheValid: (mealPlanId) => {
        const state = get();
        if (!state.cache) return false;
        if (state.cache.mealPlanId !== mealPlanId) return false;
        
        const now = Date.now();
        const elapsed = now - state.cache.lastUpdated;
        return elapsed < state.cacheValidityMs;
      },
      
      clearCache: () => {
        set({ cache: null });
      },
      
      updateItem: (itemId, updates) => {
        set((state) => {
          if (!state.cache) return state;
          
          return {
            cache: {
              ...state.cache,
              items: state.cache.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            },
          };
        });
      },
      
      invalidateCache: () => {
        set((state) => {
          if (!state.cache) return state;
          return {
            cache: {
              ...state.cache,
              lastUpdated: 0, // 设置为很久之前，使缓存失效
            },
          };
        });
      },
    }),
    {
      name: 'shopping-list-cache', // localStorage key
      partialize: (state) => ({ cache: state.cache }), // 只持久化 cache
    }
  )
);

