'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NutritionDashboard } from '@/components/analytics/NutritionDashboard';
import { createBrowserClient } from '@/lib/supabase';

export default function AnalyticsPage() {
  const [weeklyData, setWeeklyData] = useState([
    { date: '周一', calories: 1820, protein: 115, carbs: 195, fat: 62 },
    { date: '周二', calories: 1950, protein: 128, carbs: 210, fat: 68 },
    { date: '周三', calories: 1780, protein: 112, carbs: 188, fat: 59 },
    { date: '周四', calories: 1890, protein: 122, carbs: 202, fat: 65 },
    { date: '周五', calories: 1850, protein: 118, carbs: 198, fat: 63 },
    { date: '周六', calories: 2100, protein: 135, carbs: 225, fat: 72 },
    { date: '周日', calories: 1920, protein: 125, carbs: 205, fat: 66 },
  ]);
  
  const dailyTarget = {
    calories: 1900,
    protein: 120,
    carbs: 200,
    fat: 65,
  };
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background-dark">
        <NutritionDashboard weeklyData={weeklyData} dailyTarget={dailyTarget} />
      </div>
    </MainLayout>
  );
}



