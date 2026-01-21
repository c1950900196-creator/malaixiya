'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Activity, Wallet, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthGoal, RestrictionType } from '@/types/database.types';
import { createBrowserClient } from '@/lib/supabase';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1).max(120),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().min(20).max(300),
  height: z.number().min(50).max(250),
  health_goal: z.enum(['lose_weight', 'gain_muscle', 'maintain']),
  weekly_budget: z.number().min(50).max(5000),
  activity_level: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileFormData & { restrictions: RestrictionType[] }) => Promise<void>;
  initialData?: Partial<ProfileFormData>;
}

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onSubmit, initialData }) => {
  const [budget, setBudget] = useState(initialData?.weekly_budget || 250);
  const [restrictions, setRestrictions] = useState<RestrictionType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      age: 25,
      gender: 'male',
      weight: 70,
      height: 170,
      health_goal: 'maintain',
      weekly_budget: 250,
      activity_level: 'lightly_active',
      ...initialData,
    },
  });
  
  // Auto-load logged-in user's name
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Prefer name from user metadata
          const fullName = user.user_metadata?.full_name || '';
          if (fullName) {
            setValue('full_name', fullName);
          }
          
          // Try to load more info from user_profiles table
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profile) {
            if (profile.full_name) setValue('full_name', profile.full_name);
            if (profile.age) setValue('age', profile.age);
            if (profile.gender) setValue('gender', profile.gender);
            if (profile.weight) setValue('weight', profile.weight);
            if (profile.height) setValue('height', profile.height);
            if (profile.health_goal) setValue('health_goal', profile.health_goal);
            if (profile.weekly_budget) {
              setValue('weekly_budget', profile.weekly_budget);
              setBudget(profile.weekly_budget);
            }
            if (profile.activity_level) setValue('activity_level', profile.activity_level);
          }
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };
    
    loadUserInfo();
  }, [setValue]);
  
  const selectedGoal = watch('health_goal');
  
  const goalOptions: { value: HealthGoal; label: string; description: string; icon: string }[] = [
    { value: 'lose_weight', label: 'Lose Weight', description: 'Reduce fat, get healthier', icon: '📉' },
    { value: 'gain_muscle', label: 'Build Muscle', description: 'Gain muscle, strength training', icon: '💪' },
    { value: 'maintain', label: 'Maintain Weight', description: 'Balanced diet, stay fit', icon: '⚖️' },
  ];
  
  const restrictionOptions: { type: RestrictionType; label: string; icon: string }[] = [
    { type: 'halal', label: 'Halal', icon: '🕌' },
    { type: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { type: 'vegan', label: 'Vegan', icon: '🌱' },
    { type: 'diabetes', label: 'Diabetes Friendly', icon: '💉' },
    { type: 'gluten_free', label: 'Gluten Free', icon: '🌾' },
    { type: 'dairy_free', label: 'Dairy Free', icon: '🥛' },
    { type: 'nut_allergy', label: 'Nut Allergy', icon: '🥜' },
    { type: 'seafood_allergy', label: 'Seafood Allergy', icon: '🦐' },
  ];
  
  const toggleRestriction = (type: RestrictionType) => {
    setRestrictions(prev =>
      prev.includes(type) ? prev.filter(r => r !== type) : [...prev, type]
    );
  };
  
  const onFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, restrictions });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle>Health Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goalOptions.map((goal) => (
                <label key={goal.value} className="cursor-pointer group relative">
                  <input
                    type="radio"
                    value={goal.value}
                    {...register('health_goal')}
                    className="peer sr-only"
                  />
                  <div className={cn(
                    'h-full rounded-xl border-2 p-5 transition-all',
                    'border-gray-200 dark:border-border-dark bg-zinc-50 dark:bg-zinc-900',
                    'hover:border-primary dark:hover:border-primary',
                    'peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10'
                  )}>
                    <div className="flex flex-col items-center text-center gap-3">
                      <span className="text-4xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white">{goal.label}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                    {selectedGoal === goal.value && (
                      <div className="absolute top-3 right-3 text-primary">
                        <Activity className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.health_goal && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.health_goal.message}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="Enter your name"
              />
              
              <Input
                label="Age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                error={errors.age?.message}
                placeholder="25"
              />
              
              <Select
                label="Gender"
                {...register('gender')}
                error={errors.gender?.message}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                error={errors.weight?.message}
                placeholder="70"
              />
              
              <Input
                label="Height (cm)"
                type="number"
                {...register('height', { valueAsNumber: true })}
                error={errors.height?.message}
                placeholder="170"
              />
              
              <Select
                label="Activity Level"
                {...register('activity_level')}
                error={errors.activity_level?.message}
                options={[
                  { value: 'sedentary', label: 'Sedentary' },
                  { value: 'lightly_active', label: 'Lightly Active' },
                  { value: 'moderately_active', label: 'Moderately Active' },
                  { value: 'very_active', label: 'Very Active' },
                  { value: 'extremely_active', label: 'Extremely Active' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dietary Restrictions & Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {restrictionOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => toggleRestriction(option.type)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium border transition-all flex items-center gap-2',
                    restrictions.includes(option.type)
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-200 dark:border-border-dark bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  )}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-4 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <CardTitle>Weekly Budget</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Budget (MYR)</span>
              <span className="text-3xl font-bold text-primary">RM {budget}</span>
            </div>
            <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-8">
              <div
                className="absolute h-full bg-primary rounded-lg transition-all"
                style={{ width: `${((budget - 50) / 450) * 100}%` }}
              />
              <input
                type="range"
                min="50"
                max="500"
                value={budget}
                {...register('weekly_budget', { valueAsNumber: true })}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-zinc-900 border-4 border-primary rounded-full shadow-md pointer-events-none transition-all"
                style={{ left: `calc(${((budget - 50) / 450) * 100}% - 12px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>RM 50</span>
              <span>RM 500</span>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated" className="bg-zinc-900 dark:bg-zinc-900 text-white border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Ready to Start?</h3>
            <p className="text-zinc-300 text-sm mb-6">
              Click the button below, and AI will generate a personalized plan with local Malaysian delights like Nasi Lemak, Laksa, and more.
            </p>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              Generate Meal Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
