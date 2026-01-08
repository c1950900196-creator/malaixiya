'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, UtensilsCrossed, User, LogOut, LogIn } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navItems = [
    { href: '/dashboard', label: '膳食计划' },
    { href: '/shopping-list', label: '购物清单' },
    { href: '/analytics', label: '营养分析' },
  ];
  
  useEffect(() => {
    const supabase = createBrowserClient();
    
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
    setShowUserMenu(false);
  };
  
  const getUserDisplayName = () => {
    if (!user) return '游客';
    if (user.is_anonymous) return '游客';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || '用户';
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              MYMeal <span className="text-primary">AI</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary bg-primary/10 dark:bg-primary/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
                    {getUserDisplayName()}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1">
                    {!user.is_anonymous && (
                      <>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          个人资料
                        </Link>
                        <div className="border-t border-zinc-200 dark:border-zinc-700 my-1"></div>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
            <button className="md:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 点击外部关闭菜单 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

