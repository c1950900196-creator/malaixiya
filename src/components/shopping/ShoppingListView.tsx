'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { ShoppingListItem, Ingredient } from '@/types/database.types';
import { formatPrice } from '@/lib/utils';
import { Package, Download, Printer, RefreshCw } from 'lucide-react';

interface GroupedItems {
  [category: string]: (ShoppingListItem & { ingredient?: Ingredient })[];
}

interface ShoppingListViewProps {
  items: (ShoppingListItem & { ingredient?: Ingredient })[];
  onToggleItem: (itemId: string, isPurchased: boolean) => void;
  onExportPDF: () => void;
  onRefresh?: () => void; // Optional refresh callback
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleItem,
  onExportPDF,
  onRefresh,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const groupedItems: GroupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as GroupedItems);
  
  const categories = Object.keys(groupedItems);
  const totalCost = items.reduce((sum, item) => sum + (item.estimated_price || 0), 0);
  const purchasedCount = items.filter((item) => item.is_purchased).length;
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Fresh Vegetables': '🥬',
      'Meat & Seafood': '🥩',
      'Grains & Staples': '🌾',
      'Seasonings': '🧂',
      'Fruits': '🍎',
      'Dairy': '🥛',
      'Other': '📦',
    };
    return icons[category] || '📦';
  };
  
  const filteredCategories =
    filterCategory === 'all'
      ? categories
      : categories.filter((cat) => cat === filterCategory);
  
  // Empty state
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Weekly Shopping List
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Shopping list is auto-generated based on your meal plan
          </p>
        </div>
        
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Shopping List Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Shopping list will be auto-generated after you create a meal plan. Please go to home page to create your personalized meal plan first.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/'}
              >
                Create Meal Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Weekly Shopping List
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All ingredients for 7 days • {purchasedCount} / {items.length} purchased
          </p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
            Print List
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={onExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
        >
          All ({items.length})
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {getCategoryIcon(category)} {category} ({groupedItems[category].length})
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category} hover>
            <CardHeader>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </div>
                <Badge variant="default" size="sm">
                  {groupedItems[category].length} items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {groupedItems[category].map((item) => (
                  <li key={item.id} className="flex items-start gap-3 group">
                    <Checkbox
                      checked={item.is_purchased}
                      onChange={(e) =>
                        onToggleItem(item.id, (e.target as HTMLInputElement).checked)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={
                          item.is_purchased
                            ? 'text-sm font-medium text-gray-400 dark:text-gray-500 line-through'
                            : 'text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors'
                        }
                      >
                        {/* Prefer English name from notes field, fallback to ingredient relation */}
                        {item.notes?.split('|')[1]?.trim() || 
                         item.notes?.split('|')[2]?.trim() ||
                         item.ingredient?.name_en || 
                         item.ingredient?.name_ms || 
                         item.notes?.split('|')[0]?.trim() ||
                         'Unknown Ingredient'}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {item.quantity} {item.unit}
                        </p>
                        {item.estimated_price && (
                          <p className="text-xs font-semibold text-primary dark:text-green-400">
                            {formatPrice(item.estimated_price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card variant="elevated" className="bg-gradient-to-r from-green-500 to-emerald-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Estimated Total</p>
                <p className="text-3xl font-bold text-white">{formatPrice(totalCost)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/90">Shopping Progress</p>
              <p className="text-2xl font-bold text-white">
                {Math.round((purchasedCount / items.length) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
