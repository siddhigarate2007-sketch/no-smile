import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Sparkles, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'alex.rivera@devflow.io');
    setValue('password', 'Password123!');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-apple-lg border-[#E5E5EA]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/30 mb-2">
            <span className="font-bold text-base">DF</span>
          </div>
          <CardTitle className="text-2xl">Sign in to DevFlow</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace and projects
          </CardDescription>
        </CardHeader>

        <CardContent>
          {authError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FF3B30]/10 p-3 text-xs text-[#FF3B30] border border-[#FF3B30]/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="alex@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#1D1D1F]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#007AFF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>

            {/* Quick Demo Fill button */}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="sm"
              onClick={handleFillDemo}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
              Quick Fill Demo Credentials
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#86868B]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-[#007AFF] hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
