import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    // Simulate recovery dispatch
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-apple-lg border-[#E5E5EA]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/30 mb-2">
            <span className="font-bold text-base">DF</span>
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your account password
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#34C759]/10 text-[#34C759]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#1D1D1F]">Check your email</h3>
              <p className="text-xs text-[#86868B]">
                We have dispatched password recovery instructions to your email address.
              </p>
              <Link to="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="alex@company.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
