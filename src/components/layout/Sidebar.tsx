'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  UtensilsCrossed,
  User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', label: '膳食计划', icon: Calendar },
    { href: '/shopping-list', label: '购物清单', icon: ShoppingCart },
    { href: '/analytics', label: '营养分析', icon: BarChart3 },
  ];
  
  return (
    <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-border-dark hidden md:flex flex-col flex-shrink-0 z-20">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold shadow-lg shadow-primary/20">
          <UtensilsCrossed className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          MyMeal AI
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors group',
                isActive
                  ? 'bg-primary/10 text-primary dark:text-primary shadow-glow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-gray-900 dark:hover:text-primary'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'group-hover:text-primary')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-border-dark">
        <div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-white">张伟</p>
            <p className="text-xs text-gray-500 dark:text-primary">高级会员</p>
          </div>
        </div>
      </div>
    </aside>
  );
};


