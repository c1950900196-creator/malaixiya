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

    // Validate password
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
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
        // Check if email verification is required
        if (data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please login instead.');
          setIsLoading(false);
          return;
        }

        // Registration successful
        setSuccess('Registration successful!');
        
        // If email verification is required
        if (data.user.email_confirmed_at === null) {
          setSuccess('Registration successful! Please check your email for verification link.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          // If email verification is disabled, redirect directly
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      let errorMessage = err.message || 'Registration failed';
      
      if (err.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Invalid email format';
      } else if (err.message?.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many attempts. Please try again later.';
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
          Back to Home
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 text-center">
              <span className="text-5xl">🥗</span>
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Start your personalized healthy meal journey
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
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
                {success ? 'Success!' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Already have an account?</span>
              {' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
