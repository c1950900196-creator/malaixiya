'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { MealPlanDetail, Recipe } from '@/types/database.types';
import { Clock, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

interface MealPlanCalendarProps {
  meals: (MealPlanDetail & { recipe?: Recipe })[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onMealClick: (meal: MealPlanDetail & { recipe?: Recipe }) => void;
  onReplaceMeal: (mealId: string) => void;
}

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  meals,
  selectedDate,
  onDateChange,
  onMealClick,
  onReplaceMeal,
}) => {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  const getMealsForDate = (date: Date) => {
    const filtered = meals.filter((meal) => {
      const mealDate = new Date(meal.date);
      const result = mealDate.toDateString() === date.toDateString();
      
      // 调试信息
      if (!result) {
        console.log('Date mismatch:', {
          mealDate: meal.date,
          mealDateString: mealDate.toDateString(),
          selectedDate: date.toDateString(),
          recipe: meal.recipe?.name_zh || meal.recipe?.name_en
        });
      }
      
      return result;
    });
    
    console.log(`📅 getMealsForDate(${date.toDateString()}): found ${filtered.length} meals`);
    return filtered;
  };
  
  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '零食',
    };
    return labels[type] || type;
  };
  
  const getDailyCalories = (date: Date) => {
    const dayMeals = getMealsForDate(date);
    return dayMeals.reduce((total, meal) => {
      // TODO: 从 nutrition 表获取实际数据
      return total + 450;
    }, 0);
  };
  
  const currentDayMeals = getMealsForDate(selectedDate);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatDate(selectedDate)}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              onDateChange(newDate);
            }}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            前一天
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              onDateChange(newDate);
            }}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            后一天
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 7 }, (_, i) => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() - date.getDay() + i + 1);
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const calories = getDailyCalories(date);
          
          return (
            <button
              key={i}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex-shrink-0 w-24 px-2 py-3 rounded-xl text-center transition-all border',
                isSelected
                  ? 'bg-primary text-black shadow-lg shadow-primary/30 border-primary'
                  : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-primary/5 hover:border-primary/50 border-gray-200 dark:border-border-dark'
              )}
            >
              <span className="text-sm font-bold block">{weekDays[i]}</span>
              <span className="text-xs opacity-80">{date.getDate()}日</span>
              {calories > 0 && (
                <Badge
                  variant={isSelected ? 'default' : 'primary'}
                  size="sm"
                  className="mt-1"
                >
                  {calories} kcal
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentDayMeals.length > 0 ? (
          currentDayMeals.map((meal) => (
            <Card
              key={meal.id}
              hover
              className="overflow-hidden cursor-pointer"
              onClick={() => onMealClick(meal)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="primary" size="sm">
                    {getMealTypeLabel(meal.meal_type)}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">
                  {meal.recipe?.name_zh || meal.recipe?.name_en || '未知菜品'}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                  {meal.recipe?.description || '美味的马来西亚菜肴'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    {(meal.recipe?.prep_time || 0) + (meal.recipe?.cook_time || 0)} 分钟
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-primary" />
                    450 kcal
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplaceMeal(meal.id);
                  }}
                >
                  替换菜肴
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              该日期暂无膳食计划
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


