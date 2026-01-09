'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase';
import { User, Mail, Save, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    health_goal: 'maintain',
    activity_level: 'lightly_active',
    weekly_budget: 250,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      // 设置邮箱
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
      }));
      
      // 加载用户档案（使用 maybeSingle 避免 406 错误）
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          full_name: profile.full_name || prev.full_name,
          age: profile.age || prev.age,
          gender: profile.gender || prev.gender,
          weight: profile.weight || prev.weight,
          height: profile.height || prev.height,
          health_goal: profile.health_goal || prev.health_goal,
          activity_level: profile.activity_level || prev.activity_level,
          weekly_budget: profile.weekly_budget || prev.weekly_budget,
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('加载个人资料失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      // 更新用户元数据
      await supabase.auth.updateUser({
        data: { full_name: formData.full_name }
      });
      
      // 更新或插入用户档案
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          health_goal: formData.health_goal,
          activity_level: formData.activity_level,
          weekly_budget: formData.weekly_budget,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) throw profileError;
      
      setSuccess('个人资料已保存！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">加载个人资料...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">个人资料</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">管理您的账户信息</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                账户信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="邮箱"
                type="email"
                value={formData.email}
                disabled
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="姓名"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="请输入您的姓名"
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>身体信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="年龄"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
                />
                <Select
                  label="性别"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  options={[
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                    { value: 'other', label: '其他' },
                  ]}
                />
                <Input
                  label="体重 (kg)"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                />
                <Input
                  label="身高 (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>健康目标</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="健康目标"
                  value={formData.health_goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, health_goal: e.target.value }))}
                  options={[
                    { value: 'lose_weight', label: '减重' },
                    { value: 'gain_muscle', label: '增肌' },
                    { value: 'maintain', label: '保持体重' },
                  ]}
                />
                <Select
                  label="活动水平"
                  value={formData.activity_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, activity_level: e.target.value }))}
                  options={[
                    { value: 'sedentary', label: '久坐不动' },
                    { value: 'lightly_active', label: '轻度活动' },
                    { value: 'moderately_active', label: '中度活动' },
                    { value: 'very_active', label: '高度活动' },
                    { value: 'extremely_active', label: '极高活动' },
                  ]}
                />
                <Input
                  label="每周预算 (MYR)"
                  type="number"
                  value={formData.weekly_budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, weekly_budget: Number(e.target.value) }))}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            保存更改
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

