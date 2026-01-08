'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShoppingListView } from '@/components/shopping/ShoppingListView';
import { createBrowserClient } from '@/lib/supabase';
import { exportShoppingListToPDF } from '@/lib/pdf-export';
import { ShoppingListItem, Ingredient } from '@/types/database.types';

export default function ShoppingListPage() {
  const [items, setItems] = useState<(ShoppingListItem & { ingredient?: Ingredient })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  
  useEffect(() => {
    loadShoppingList();
  }, []);
  
  // 轮询检查购物清单是否生成完成
  useEffect(() => {
    if (isGenerating && checkCount < 20) {
      const timer = setTimeout(() => {
        console.log('🔄 Checking if shopping list is ready... (attempt', checkCount + 1, ')');
        loadShoppingList();
        setCheckCount(checkCount + 1);
      }, 3000); // 每3秒检查一次
      
      return () => clearTimeout(timer);
    }
  }, [isGenerating, checkCount]);
  
  const loadShoppingList = async () => {
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
        setIsGenerating(false);
        setItems([]);
        return;
      }
      
      const mealPlan = mealPlans[0];
      
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
        
        // 检查膳食计划是否是最近创建的（5分钟内）
        const planCreatedAt = new Date(mealPlan.created_at).getTime();
        const now = Date.now();
        const timeDiff = now - planCreatedAt;
        
        if (timeDiff < 5 * 60 * 1000) {
          // 5分钟内，可能正在生成
          console.log('🛒 Shopping list might be generating...');
          setIsGenerating(true);
        } else {
          setIsGenerating(false);
        }
        
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
      
      // 如果有购物清单记录但没有项目
      if (!itemsData || itemsData.length === 0) {
        console.log('Shopping list exists but has no items yet');
        
        // 检查购物清单是否是最近创建的（5分钟内）
        const listCreatedAt = new Date(list.created_at).getTime();
        const now = Date.now();
        const timeDiff = now - listCreatedAt;
        
        if (timeDiff < 5 * 60 * 1000) {
          // 5分钟内，可能正在生成
          console.log('🛒 Shopping list is being generated...');
          setIsGenerating(true);
        } else {
          setIsGenerating(false);
        }
        
        setItems([]);
      } else {
        // 有数据，生成完成
        console.log('✅ Shopping list loaded:', itemsData.length, 'items');
        setItems(itemsData);
        setIsGenerating(false);
        setCheckCount(0); // 重置检查计数
      }
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };
  
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
    } catch (error) {
      console.error('Error updating item:', error);
    }
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
            <p className="text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // 如果正在生成购物清单
  if (isGenerating) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🛒 AI 正在生成购物清单
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              我们的 AI 正在智能分析您的膳食计划，生成完整的购物清单...
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>提示：</strong>这通常需要 30-60 秒，请稍候
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>检查中</span>
              <span className="animate-pulse">●</span>
              <span className="animate-pulse animation-delay-200">●</span>
              <span className="animate-pulse animation-delay-400">●</span>
            </div>
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
        />
      </div>
    </MainLayout>
  );
}


