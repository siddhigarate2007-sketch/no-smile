import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-apple-lg border-[#E5E5EA]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/30 mb-2">
            <span className="font-bold text-base">DF</span>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join DevFlow to manage your projects and collaborate with your team
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
              label="Full Name"
              placeholder="Alex Rivera"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="alex@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Get Started
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#86868B]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#007AFF] hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
