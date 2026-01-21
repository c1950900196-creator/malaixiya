'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { LoadingProgress } from '@/components/ui/LoadingProgress';
import { createBrowserClient } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { useMealPlanStore } from '@/store/mealPlanStore';

// Save shopping list (from database results)
async function saveShoppingListFromAI(userId: string, mealPlanId: string, shoppingListItems: any[], supabase: any) {
  try {
    console.log('🛒 Saving shopping list...');

    // Create shopping list record
    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        meal_plan_id: mealPlanId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (listError) {
      console.error('❌ Shopping list creation error:', listError);
      return;
    }

    console.log('✅ Shopping list created:', shoppingList.id);

    // Save shopping list items
    if (shoppingListItems && shoppingListItems.length > 0) {
      console.log('📦 Processing', shoppingListItems.length, 'shopping items');
      
      const items = shoppingListItems.map((item: any) => {
        // Adapt to database format
        const name = item.name || item.name_zh || 'Unknown';
        const nameEn = item.name_en || '';
        const nameMs = item.name_ms || '';
        const notesText = `${name} | ${nameEn} | ${nameMs}`;
        
        return {
          shopping_list_id: shoppingList.id,
          ingredient_id: item.ingredient_id || null,
          quantity: item.quantity || 0,
          unit: item.unit || 'g',
          category: item.category || 'Other',
          estimated_price: item.estimated_price || item.price || 0,
          is_purchased: false,
          notes: notesText,
        };
      });

      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .insert(items);

      if (itemsError) {
        console.error('❌ Shopping list items error:', itemsError);
      } else {
        console.log(`✅ Saved ${items.length} shopping list items`);
      }
    } else {
      console.log('⚠️ No shopping list items to save');
    }
  } catch (error) {
    console.error('❌ Shopping list save error:', error);
  }
}

// Default price table (Malaysian Ringgit)
const DEFAULT_PRICES: Record<string, number> = {
  // Meat
  'chicken': 12, 'beef': 35, 'lamb': 40, 'pork': 18, 'duck': 20,
  'chicken leg': 10, 'chicken breast': 12, 'chicken wing': 8, 'ribs': 25,
  // Seafood
  'shrimp': 25, 'fish': 15, 'crab': 45, 'squid': 18, 'shellfish': 20,
  // Vegetables
  'cabbage': 3, 'spinach': 4, 'lettuce': 3, 'broccoli': 6, 'carrot': 2,
  'onion': 3, 'garlic': 5, 'ginger': 4, 'chili': 3, 'tomato': 4,
  'cucumber': 3, 'eggplant': 4, 'bean sprouts': 2, 'kangkung': 3, 'kailan': 5,
  // Staples
  'rice': 8, 'noodles': 5, 'rice noodles': 4, 'bread': 6, 'nasi lemak': 3,
  // Seasonings
  'soy sauce': 6, 'salt': 2, 'sugar': 4, 'vinegar': 5, 'curry powder': 8,
  'coconut milk': 5, 'belacan': 10, 'sambal': 8, 'peanut sauce': 12,
  // Others
  'egg': 8, 'tofu': 4, 'tempeh': 5, 'peanuts': 8, 'coconut': 6,
};

// Get default price by name
function getDefaultPrice(name: string, category: string): number {
  // Try exact match first
  for (const [key, price] of Object.entries(DEFAULT_PRICES)) {
    if (name.toLowerCase().includes(key)) return price;
  }
  // Default price by category
  const categoryPrices: Record<string, number> = {
    'Meat': 20, 'Seafood': 25, 'Vegetables': 4, 'Seasonings': 6, 'Staples': 5,
    'Meat & Seafood': 22, 'Fresh Vegetables': 4, 'Grains & Staples': 5, 'Fruits': 6,
    'Dairy': 8, 'Dishes': 15, 'Snacks': 8, 'Main Dishes': 20, 'Other': 5,
  };
  return categoryPrices[category] || 5;
}

// Default shopping list template (common Malaysian ingredients)
function getDefaultShoppingList(): any[] {
  return [
    // Dishes
    { name: 'Nasi Lemak', category: 'Dishes', quantity: 2, unit: 'serving', price: 8 },
    { name: 'Satay', category: 'Snacks', quantity: 2, unit: 'serving', price: 12 },
    { name: 'Bak Kut Teh', category: 'Main Dishes', quantity: 1, unit: 'serving', price: 25 },
    { name: 'Mee Goreng', category: 'Main Dishes', quantity: 1, unit: 'serving', price: 10 },
    { name: 'Laksa', category: 'Main Dishes', quantity: 1, unit: 'serving', price: 12 },
    { name: 'Rendang', category: 'Main Dishes', quantity: 1, unit: 'serving', price: 18 },
    { name: 'Curry Chicken', category: 'Main Dishes', quantity: 1, unit: 'serving', price: 15 },
    // Vegetables
    { name: 'Kangkung', category: 'Fresh Vegetables', quantity: 500, unit: 'g', price: 4 },
    { name: 'Bean Sprouts', category: 'Fresh Vegetables', quantity: 300, unit: 'g', price: 3 },
    { name: 'Cucumber', category: 'Fresh Vegetables', quantity: 2, unit: 'pcs', price: 3 },
    // Seasonings
    { name: 'Coconut Milk', category: 'Seasonings', quantity: 2, unit: 'can', price: 8 },
    { name: 'Sambal', category: 'Seasonings', quantity: 1, unit: 'jar', price: 10 },
    // Protein
    { name: 'Eggs', category: 'Meat & Seafood', quantity: 10, unit: 'pcs', price: 8 },
    { name: 'Shrimp', category: 'Meat & Seafood', quantity: 500, unit: 'g', price: 25 },
  ];
}

// Merge, deduplicate, and consolidate shopping list
function mergeShoppingItems(items: any[]): any[] {
  const merged = new Map<string, any>();
  
  for (const item of items) {
    const name = item.name || item.name_zh || '';
    if (!name) continue;
    
    const key = name.toLowerCase().trim();
    const category = item.category || 'Other';
    
    // Use default price if none provided
    const price = parseFloat(item.price) || getDefaultPrice(name, category);
    
    if (merged.has(key)) {
      // Already exists, accumulate quantity
      const existing = merged.get(key);
      const existingQty = parseFloat(existing.quantity) || 0;
      const newQty = parseFloat(item.quantity) || 0;
      existing.quantity = existingQty + newQty;
      // Keep higher price
      if (price > existing.price) {
        existing.price = price;
      }
    } else {
      // Add new
      merged.set(key, {
        name: name,
        name_en: item.name_en || '',
        category: category,
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit || 'serving',
        price: price,
      });
    }
  }
  
  return Array.from(merged.values());
}

export default function Home() {
  const router = useRouter();
  const { setProfile, setRestrictions } = useUserStore();
  const { setCurrentPlan, setPlanDetails } = useMealPlanStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  
  // Check user login status and existing meal plan
  useEffect(() => {
    const checkUserAndPlan = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          if (!user.is_anonymous) {
            setIsLoggedIn(true);
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
          }
          
          // Check if user has active meal plan
          const { data: mealPlans } = await supabase
            .from('meal_plans')
            .select('id, created_at')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);
          
          // If there's an active meal plan, redirect to dashboard
          if (mealPlans && mealPlans.length > 0) {
            console.log('✅ User has meal plan, redirecting to dashboard');
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user and plan:', error);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    
    checkUserAndPlan();
  }, [router]);
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setProgress(0);
    setLoadingStep('Creating user session...');
    
    // 🔧 Clear old cached data (important!)
    console.log('🧹 Clearing old cached data...');
    setCurrentPlan(null);
    setPlanDetails([]);
    
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        alert('⚠️ Please configure Supabase first\n\n1. Visit https://app.supabase.com/ to create a project\n2. Copy API keys to .env.local file\n3. Run database scripts\n\nSee: Configuration Guide');
        setIsLoading(false);
        return;
      }
      
      const supabase = createBrowserClient();
      
      // Get current user
      let { data: { user } } = await supabase.auth.getUser();
      
      // Create anonymous session if no user
      if (!user) {
        setProgress(10);
        setLoadingStep('Creating anonymous user session...');
        console.log('Creating anonymous user session...');
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        
        if (anonError) {
          console.error('Failed to create anonymous session:', anonError);
          throw new Error('Unable to create user session. Please check Supabase configuration.');
        }
        
        user = anonData.user;
      }
      
      if (!user) {
        throw new Error('Unable to get user information');
      }
      
      // Save user profile
      setProgress(20);
      setLoadingStep('Saving your profile...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: data.full_name,
          age: data.age,
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          health_goal: data.health_goal,
          weekly_budget: data.weekly_budget,
          activity_level: data.activity_level,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('Profile save error:', profileError);
        throw profileError;
      }
      
      // Save dietary restrictions
      if (data.restrictions && data.restrictions.length > 0) {
        const restrictions = data.restrictions.map((type: string) => ({
          user_id: user.id,
          restriction_type: type,
        }));
        
        // Delete old restrictions first
        await supabase
          .from('dietary_restrictions')
          .delete()
          .eq('user_id', user.id);
        
        // Insert new restrictions
        const { error: restrictionsError } = await supabase
          .from('dietary_restrictions')
          .insert(restrictions);
        
        if (restrictionsError) throw restrictionsError;
      }
      
      setProfile({ id: user.id, ...data } as any);
      
      // ==================== Generate Meal Plan v3.0 ====================
      setProgress(40);
      setLoadingStep('Generating your meal plan (21 meals)...');
      console.log('🚀 Starting meal plan generation v3.0...');
      
      // Call new API to generate meal plan
      const dbResponse = await fetch('/api/generate-meal-plan-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            age: data.age,
            gender: data.gender,
            weight: data.weight,
            height: data.height,
            health_goal: data.health_goal,
            weekly_budget: data.weekly_budget,
            activity_level: data.activity_level,
          },
          restrictions: data.restrictions || [],
          days: 7,
          peopleCount: data.people_count || 2,
          weeklyBudget: data.weekly_budget || 250,
        }),
      });
      
      if (!dbResponse.ok) {
        const errorData = await dbResponse.json().catch(() => ({}));
        console.error('❌ Meal plan generation failed:', errorData);
        throw new Error(errorData.error || 'Meal plan generation failed');
      }
      
      const dbResult = await dbResponse.json();
      console.log('✅ Meal plan generated successfully:', dbResult);
      
      // Print statistics
      if (dbResult.summary) {
        console.log(`📊 Stats: ${dbResult.summary.unique_dishes} unique dishes, ${dbResult.summary.total_dishes} meals`);
        console.log(`🔥 Calories: ${dbResult.summary.avg_daily_calories} kcal/day (target: ${dbResult.summary.target_daily_calories})`);
        console.log(`💰 Budget: RM${dbResult.summary.total_cost?.toFixed(2)} / RM${dbResult.summary.weekly_budget?.toFixed(2)}`);
      }
      
      // Print debug logs
      if (dbResult.debug?.logs) {
        console.log('📋 Detailed logs:');
        dbResult.debug.logs.forEach((log: string) => console.log(`   ${log}`));
      }
      
      setProgress(60);
      setLoadingStep('Saving meal plan...');
      
      // Get this week's Monday date
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      
      const startDate = monday.toISOString().split('T')[0];
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const endDate = sunday.toISOString().split('T')[0];
      
      // Convert API response to frontend format
      const mealPlan: any[] = [];
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      (dbResult.plan || []).forEach((dayPlan: any, dayIndex: number) => {
        if (!dayPlan || !dayPlan.meals) return;
        
        const actualDate = new Date(monday);
        actualDate.setDate(monday.getDate() + dayIndex);
        const dateString = actualDate.toISOString().split('T')[0];
        
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const meal = dayPlan.meals?.[mealType];
          if (!meal) return;
          
          mealPlan.push({
            date: dateString,
            mealType,
            recipe: {
              id: meal.id,
              name_zh: meal.name_zh,
              name_en: meal.name_en,
              name_ms: meal.name_ms,
              description: meal.description,
              prep_time: meal.prep_time,
              cook_time: meal.cook_time,
              cuisine_type: meal.cuisine_type,
              estimated_cost: meal.estimated_cost,
              meal_type: [mealType],
            },
          });
        });
      });
      
      console.log(`✅ Parsing complete: ${mealPlan.length} meals`);
      
      if (mealPlan.length === 0) {
        throw new Error('Meal plan generation failed, please try again');
      }
      
      // Save meal plan
      const { data: planData, error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan_name: `${data.full_name}'s Meal Plan`,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
        })
        .select()
        .single();
      
      if (planError) {
        console.error('Meal plan save error:', planError);
        throw planError;
      }
      
      // Save meal plan details
      const planDetails = mealPlan
        .filter(meal => meal.recipe && meal.recipe.id) // Ensure valid recipe
        .map((meal) => {
          const detail = {
            meal_plan_id: planData.id,
            meal_type: meal.mealType,
            recipe_id: meal.recipe.id,
            date: meal.date,
            servings: 1,
          };
          
          // Validate all UUID fields
          if (!detail.meal_plan_id || !detail.recipe_id) {
            console.error('❌ Invalid detail:', detail);
            throw new Error('Data format error: missing required ID fields');
          }
          
          return detail;
        });
      
      console.log('📝 Saving', planDetails.length, 'meal details...');
      
      const { data: insertedDetails, error: detailsError } = await supabase
        .from('meal_plan_details')
        .insert(planDetails)
        .select();  // ✅ Add .select() to get inserted data (including generated id)
      
      if (detailsError) {
        console.error('❌ Meal plan details save error:', detailsError);
        console.error('Details that failed:', planDetails);
        throw detailsError;
      }
      
      if (!insertedDetails || insertedDetails.length === 0) {
        throw new Error('Failed to save meal plan details: no data returned');
      }
      
      console.log('✅ Meal plan saved successfully! Inserted', insertedDetails.length, 'details');
      
      // Save to store for caching
      setCurrentPlan(planData);
      const detailsWithRecipes = mealPlan.map((meal, index) => ({
        id: insertedDetails[index]?.id || '',  // ✅ Use data returned after insertion, including database-generated id
        meal_plan_id: planData.id,
        recipe_id: meal.recipe.id,
        date: meal.date,
        meal_type: meal.mealType,
        servings: 1,
        recipe: meal.recipe,
      }));
      setPlanDetails(detailsWithRecipes as any);
      
      setProgress(75);
      setLoadingStep('Generating shopping list...');
      
      // Use shopping list returned by API (already consolidated on backend)
      const mergedItems = dbResult.shopping_list || [];
      console.log('✅ Shopping list generated:', mergedItems.length, 'items');
      
      // If shopping list is empty, print warning but don't block flow
      if (mergedItems.length === 0) {
        console.warn('⚠️ Shopping list is empty, some dishes may be missing ingredient data');
      }
      
      // Save shopping list
      await saveShoppingListFromAI(user.id, planData.id, mergedItems, supabase);
      
      setProgress(100);
      setLoadingStep('Meal plan created successfully!');
      
      // Redirect to dashboard immediately
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      let errorMessage = 'Save failed: ' + (error.message || 'Unknown error');
      if (error.message?.includes('fetch')) {
        errorMessage = '⚠️ Cannot connect to Supabase\n\nPlease check:\n1. .env.local file is correctly configured\n2. Supabase project is running\n3. Network connection is working\n\nSee: Configuration Guide';
      } else if (error.code === '42P01') {
        errorMessage = '⚠️ Database tables do not exist\n\nPlease run database initialization scripts:\n1. Open Supabase SQL Editor\n2. Run supabase/schema.sql\n3. Run supabase/seed-recipes.sql\n\nSee: Configuration Guide';
      } else if (error.message?.includes('Anonymous sign-ins are disabled')) {
        errorMessage = '⚠️ Anonymous sign-ins need to be enabled\n\nPlease enable in Supabase:\n1. Open Supabase Dashboard\n2. Go to Authentication > Providers\n3. Enable "Anonymous Sign-ins"\n\nOr you can register and login first.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading while checking for meal plan
  if (isCheckingPlan) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                Set Up Your Meal Profile
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Let AI generate the perfect 7-day Malaysian cuisine plan for you! Tell us your dietary preferences, budget, and health goals.
              </p>
            </div>
          </div>
          
          {isLoggedIn ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 dark:text-green-300">
                ✅ <strong>Welcome back{userName ? `, ${userName}` : ''}!</strong> Your meal plan will be automatically saved to your account.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Tip:</strong> You can
                {' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Login
                </button>
                {' '}or{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign Up
                </button>
                {' '}
                to save your meal plan, or fill out the form below to use as guest.
              </p>
            </div>
          )}
        </div>
        <ProfileSetupForm onSubmit={handleSubmit} />
      </main>
      
      {isLoading && <LoadingProgress step={loadingStep} progress={progress} />}
    </div>
  );
}
