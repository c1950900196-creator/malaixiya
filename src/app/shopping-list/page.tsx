'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShoppingListView } from '@/components/shopping/ShoppingListView';
import { createBrowserClient } from '@/lib/supabase';
import { exportShoppingListToPDF } from '@/lib/pdf-export';
import { ShoppingListItem, Ingredient } from '@/types/database.types';
import { useShoppingListStore } from '@/store/shoppingListStore';

export default function ShoppingListPage() {
  const [items, setItems] = useState<(ShoppingListItem & { ingredient?: Ingredient })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(null);
  
  // 使用缓存 store
  const { 
    setCache, 
    getCache, 
    isCacheValid, 
    updateItem: updateCacheItem 
  } = useShoppingListStore();
  
  const loadShoppingList = useCallback(async (forceRefresh: boolean = false) => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      // 获取最新的膳食计划
      const { data: mealPlans } = await supabase
        .from('meal_plans')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!mealPlans || mealPlans.length === 0) {
        console.log('No meal plans found');
        setIsLoading(false);
        setItems([]);
        return;
      }
      
      const mealPlan = mealPlans[0];
      setCurrentMealPlanId(mealPlan.id);
      
      // 检查缓存是否有效（非强制刷新时）
      if (!forceRefresh && isCacheValid(mealPlan.id)) {
        const cachedItems = getCache(mealPlan.id);
        if (cachedItems && cachedItems.length > 0) {
          console.log('✅ 使用缓存的购物清单');
          setItems(cachedItems);
          setIsLoading(false);
          return;
        }
      }
      
      console.log('🔄 从数据库加载购物清单...');
      
      // 获取最新的购物清单
      const { data: lists, error: listError } = await supabase
        .from('shopping_lists')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('meal_plan_id', mealPlan.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (listError) {
        console.error('Error loading shopping list:', listError);
        setIsLoading(false);
        return;
      }
      
      // 如果没有购物清单记录
      if (!lists || lists.length === 0) {
        console.log('No shopping lists found');
        setItems([]);
        setIsLoading(false);
        return;
      }
      
      const list = lists[0];
      
      // 获取购物清单项目
      const { data: itemsData, error: itemsError } = await supabase
        .from('shopping_list_items')
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .eq('shopping_list_id', list.id);
      
      if (itemsError) throw itemsError;
      
      const loadedItems = itemsData || [];
      setItems(loadedItems);
      
      // 更新缓存
      setCache(mealPlan.id, loadedItems);
      console.log('✅ 购物清单已缓存');
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getCache, isCacheValid, setCache]);
  
  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);
  
  const handleToggleItem = async (itemId: string, isPurchased: boolean) => {
    try {
      const supabase = createBrowserClient();
      
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_purchased: isPurchased })
        .eq('id', itemId);
      
      if (error) throw error;
      
      // 更新本地状态
      setItems(items.map(item =>
        item.id === itemId ? { ...item, is_purchased: isPurchased } : item
      ));
      
      // 同步更新缓存
      updateCacheItem(itemId, { is_purchased: isPurchased });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    loadShoppingList(true); // 强制刷新
  };
  
  const handleExportPDF = () => {
    const totalCost = items.reduce((sum, item) => sum + (item.estimated_price || 0), 0);
    exportShoppingListToPDF(items, totalCost);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">加载购物清单...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <ShoppingListView
          items={items}
          onToggleItem={handleToggleItem}
          onExportPDF={handleExportPDF}
          onRefresh={handleRefresh}
        />
      </div>
    </MainLayout>
  );
}
