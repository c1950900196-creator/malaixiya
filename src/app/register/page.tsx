'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // 检查是否需要邮箱验证
        if (data.user.identities && data.user.identities.length === 0) {
          setError('此邮箱已被注册，请直接登录');
          setIsLoading(false);
          return;
        }

        // 注册成功
        setSuccess('注册成功！');
        
        // 如果需要邮箱验证
        if (data.user.email_confirmed_at === null) {
          setSuccess('注册成功！请查收邮箱中的验证链接。');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          // 如果不需要邮箱验证（禁用了邮箱验证），直接跳转
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      let errorMessage = err.message || '注册失败';
      
      if (err.message?.includes('already registered')) {
        errorMessage = '此邮箱已被注册，请直接登录';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = '邮箱格式不正确';
      } else if (err.message?.includes('Email rate limit exceeded')) {
        errorMessage = '发送邮件过于频繁，请稍后再试';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 text-center">
              <span className="text-5xl">🥗</span>
            </div>
            <CardTitle className="text-2xl">创建账户</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              开始您的个性化健康膳食之旅
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
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
                label="姓名"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="张三"
                required
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="邮箱"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="密码"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6个字符"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="确认密码"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
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
                {success ? '注册成功！' : '注册'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">已有账户？</span>
              {' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                立即登录
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          注册即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}





