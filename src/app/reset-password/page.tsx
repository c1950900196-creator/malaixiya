'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // 检查是否有有效的重置令牌
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidToken(true);
      } else {
        setError('重置密码链接无效或已过期，请重新申请');
      }
    });
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 验证密码
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createBrowserClient();
      
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess('密码重置成功！正在跳转到登录页...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || '密码重置失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">正在验证...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回登录
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 text-center">
              <span className="text-5xl">🔑</span>
            </div>
            <CardTitle className="text-2xl">重置密码</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              请输入您的新密码
            </p>
          </CardHeader>

          <CardContent>
            {!isValidToken && error ? (
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm text-center">
                  {error}
                </div>
                <Link href="/forgot-password">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                  >
                    重新申请重置密码
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <Input
                  label="新密码"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6个字符"
                  required
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <Input
                  label="确认新密码"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入新密码"
                  required
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading || !!success}
                >
                  {success ? '密码已重置' : '重置密码'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





