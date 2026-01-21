'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Flame, TrendingUp, Activity, Target } from 'lucide-react';

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionDashboardProps {
  weeklyData: NutritionData[];
  dailyTarget: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  weeklyData,
  dailyTarget,
}) => {
  const weeklyAverage = {
    calories: Math.round(
      weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length
    ),
    protein: Math.round(
      weeklyData.reduce((sum, day) => sum + day.protein, 0) / weeklyData.length
    ),
    carbs: Math.round(
      weeklyData.reduce((sum, day) => sum + day.carbs, 0) / weeklyData.length
    ),
    fat: Math.round(
      weeklyData.reduce((sum, day) => sum + day.fat, 0) / weeklyData.length
    ),
  };
  
  const macroData = [
    { name: 'Protein', value: weeklyAverage.protein, color: '#3b82f6' },
    { name: 'Carbs', value: weeklyAverage.carbs, color: '#eab308' },
    { name: 'Fat', value: weeklyAverage.fat, color: '#ef4444' },
  ];
  
  const totalMacros = weeklyAverage.protein + weeklyAverage.carbs + weeklyAverage.fat;
  
  const getComplianceStatus = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'success';
    if (percentage >= 80 && percentage <= 120) return 'warning';
    return 'danger';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-2">Nutrition Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-dark border-border-dark relative overflow-hidden group hover:border-primary/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
                  Weekly Calories
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {weeklyData.reduce((sum, day) => sum + day.calories, 0).toLocaleString()}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Avg {weeklyAverage.calories} kcal/day
                </p>
              </div>
              <div className="p-1.5 bg-surface-darker rounded text-primary">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <Badge
              variant={getComplianceStatus(weeklyAverage.calories, dailyTarget.calories)}
              size="sm"
            >
              {getComplianceStatus(weeklyAverage.calories, dailyTarget.calories) === 'success'
                ? 'On Track'
                : 'Needs Adjustment'}
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-dark border-border-dark hover:border-blue-500/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
                  Avg Protein
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">{weeklyAverage.protein}g</h3>
                <p className="text-xs text-text-muted mt-1">Target: {dailyTarget.protein}g</p>
              </div>
              <div className="p-1.5 bg-surface-darker rounded text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <Badge
              variant={getComplianceStatus(weeklyAverage.protein, dailyTarget.protein)}
              size="sm"
            >
              {Math.round((weeklyAverage.protein / dailyTarget.protein) * 100)}%
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-dark border-border-dark hover:border-yellow-500/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
                  Avg Carbs
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">{weeklyAverage.carbs}g</h3>
                <p className="text-xs text-text-muted mt-1">Target: {dailyTarget.carbs}g</p>
              </div>
              <div className="p-1.5 bg-surface-darker rounded text-yellow-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <Badge
              variant={getComplianceStatus(weeklyAverage.carbs, dailyTarget.carbs)}
              size="sm"
            >
              {Math.round((weeklyAverage.carbs / dailyTarget.carbs) * 100)}%
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-dark border-border-dark hover:border-red-500/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
                  Avg Fat
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">{weeklyAverage.fat}g</h3>
                <p className="text-xs text-text-muted mt-1">Target: {dailyTarget.fat}g</p>
              </div>
              <div className="p-1.5 bg-surface-darker rounded text-red-400">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <Badge
              variant={getComplianceStatus(weeklyAverage.fat, dailyTarget.fat)}
              size="sm"
            >
              {Math.round((weeklyAverage.fat / dailyTarget.fat) * 100)}%
            </Badge>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-surface-dark border-border-dark">
          <CardHeader>
            <CardTitle className="text-white">Weekly Calorie Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="calories" fill="#38e07b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-dark border-border-dark flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Macronutrient Ratio</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
              {macroData.map((item) => (
                <div key={item.name} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-xs text-text-muted">{item.name}</p>
                  <p className="text-sm font-bold text-white">
                    {Math.round((item.value / totalMacros) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
