'use client';

import React from 'react';
import { RecipeWithDetails } from '@/types/database.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { X, Clock, Users, ChefHat, Flame, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RecipeDetailModalProps {
  recipe: RecipeWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToShoppingList?: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onAddToShoppingList,
}) => {
  if (!isOpen || !recipe) return null;
  
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-surface-darker/80 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-surface-darker transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {recipe.image_url && (
          <div className="relative h-96 w-full">
            <Image
              src={recipe.image_url}
              alt={recipe.name_en || recipe.name_zh}
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-wide leading-tight">
                {recipe.name_en || recipe.name_zh}
              </h1>
              <p className="text-xl text-primary font-medium">{recipe.name_ms}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {recipe.is_halal && <Badge variant="success">Halal</Badge>}
                {recipe.is_vegetarian && <Badge variant="info">Vegetarian</Badge>}
                {recipe.is_diabetic_friendly && <Badge variant="warning">Diabetic Friendly</Badge>}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-primary/20">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm">{totalTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm">{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ChefHat className="w-5 h-5 text-primary" />
                    <span className="text-sm capitalize">{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Flame className="w-5 h-5 text-primary" />
                    <span className="text-sm">{recipe.nutrition?.calories || 0} kcal</span>
                  </div>
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {recipe.description}
                  </p>
                )}
              </div>
            </Card>
            
            {recipe.nutrition && (
              <Card>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'text-blue-600' },
                      { label: 'Carbs', value: recipe.nutrition.carbohydrates, unit: 'g', color: 'text-yellow-600' },
                      { label: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'text-red-600' },
                      { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g', color: 'text-green-600' },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-surface-darker rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className={cn('text-2xl font-bold', item.color)}>
                          {item.value || 0}{item.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
            
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cooking Steps</h2>
                {recipe.steps
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((step) => (
                    <div key={step.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                          {step.step_number}
                        </div>
                        <div className="w-0.5 h-full bg-border-dark my-2 group-last:hidden" />
                      </div>
                      <Card className="flex-1 mb-4 hover:border-gray-600 transition-all">
                        <div className="p-5">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {step.instruction}
                          </p>
                          {step.duration && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              ⏱️ About {step.duration} min
                            </p>
                          )}
                        </div>
                      </Card>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Card>
                <div className="p-5 border-b border-gray-200 dark:border-border-dark flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Ingredients
                  </h3>
                  <Badge variant="default" size="sm">
                    {recipe.ingredients.length} items
                  </Badge>
                </div>
                <div className="p-2 max-h-[500px] overflow-y-auto">
                  <ul className="space-y-1">
                    {recipe.ingredients.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-surface-darker rounded-lg group transition-colors cursor-pointer"
                      >
                        <Checkbox />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.ingredient.name_en || item.ingredient.name_ms || item.ingredient.name_zh}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-border-dark">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onAddToShoppingList}
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                  >
                    Add All to Shopping List
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
