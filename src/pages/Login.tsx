import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import ktlLogo from '../assets/logo/ktl-logo.png';

// Validation schema
const loginSchema = z.object({
  login_id: z.string()
    .min(1, 'Login ID is required')
    .min(3, 'Login ID must be at least 3 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember_me: z.boolean().optional() // Make it optional
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

   const {
   register,
   handleSubmit,
   formState: { errors },
   setError,
   clearErrors,
 } = useForm<LoginFormData>({
   resolver: zodResolver(loginSchema),
   defaultValues: {
     remember_me: false,
   },
 });

   // Clear errors when component unmounts or when user starts typing
   useEffect(() => {
     if (error) {
       const timer = setTimeout(() => clearError(), 5000);
       return () => clearTimeout(timer);
     }
   }, [error, clearError]);

   // Redirect if already authenticated
   if (isAuthenticated) {
     return <Navigate to="/dashboard" replace />;
   }


  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    clearErrors();
    clearError();

    try {
      const result = await login(data);
      
      if (!result.success) {
        setError('root', {
          type: 'manual',
          message: result.error || 'Login failed',
        });
      }
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <LoadingSpinner size="xl" message="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-md mx-4">
        <Card className="bg-white/10 shadow-xl">
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src={ktlLogo}
                alt="KTL ISP Logo"
                className="w-18 h-16 rounded-2xl mb-4 shadow-xl object-contain mx-auto"
              />
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to KTL ISP Billing Management System
              </h1>
              <p className="text-white/70">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Display */}
            {(error || errors.root) && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-red-200">
                  <AlertCircle size={18} />
                  <span className="text-sm">
                    {error || errors.root?.message || 'Login failed'}
                  </span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Login ID Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Login ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    {...register('login_id')}
                    type="text"
                    placeholder="Enter your login ID"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.login_id && (
                  <p className="text-sm text-red-300">{errors.login_id.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register('remember_me')}
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 bg-white/10 border-white/20 rounded-full focus:ring-blue-500 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-white/80">
                    Remember me
                  </label>
                </div>
                {/* <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Forgot password?
                </Link> */}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
                >
                  Contact Administrator
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* System Info */}
        <div className="mt-8 text-center text-gray-600 text-xs">
          <p>KTL ISP Billing Management System v1.0</p>
          <p>© 2025 All rights reserved. Powered by <strong>Alawaf.</strong> </p>
        </div>
      </div>
    </div>
  );
};