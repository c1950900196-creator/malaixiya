import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 计算 BMI
export function calculateBMI(weight: number, height: number): number {
  return weight / Math.pow(height / 100, 2);
}

// 计算基础代谢率 (BMR) - Harris-Benedict 公式
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }
}

// 计算每日总能量消耗 (TDEE)
export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return bmr * (multipliers[activityLevel] || 1.2);
}

// 根据健康目标调整卡路里
export function adjustCaloriesForGoal(
  tdee: number,
  goal: 'lose_weight' | 'gain_muscle' | 'maintain'
): number {
  switch (goal) {
    case 'lose_weight':
      return tdee - 500; // 每周减重约 0.5kg
    case 'gain_muscle':
      return tdee + 300; // 适度增重
    case 'maintain':
      return tdee;
    default:
      return tdee;
  }
}

// 格式化价格
export function formatPrice(price: number): string {
  return `RM ${price.toFixed(2)}`;
}

// 格式化日期
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 获取日期范围
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// 计算营养素百分比
export function calculateMacroPercentages(
  protein: number,
  carbs: number,
  fat: number
): { protein: number; carbs: number; fat: number } {
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const total = proteinCals + carbsCals + fatCals;
  
  return {
    protein: Math.round((proteinCals / total) * 100),
    carbs: Math.round((carbsCals / total) * 100),
    fat: Math.round((fatCals / total) * 100),
  };
}





