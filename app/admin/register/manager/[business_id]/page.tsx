'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerManager } from '@/actions/EmployeeActions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ZodError } from 'zod';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  general?: string;
}

export default function RegisterManagerForm({
  params,
}: {
  params: { business_id: string };
}) {
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.append('business_id', params.business_id);

    try {
      const result = await registerManager(formData);
      if ('error' in result) {
        handleErrorResponse(result.error || 'An unexpected error occurred. Please try again later.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again later.' });
        console.error(err);
      }
    }
  };

  function handleErrorResponse(error: string) {
    if (error.includes('email')) {
      setErrors(prev => ({ ...prev, email: 'This email is already in use or invalid.' }));
    } else if (error.includes('password')) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
    } else if (error.includes('name')) {
      setErrors(prev => ({ ...prev, name: 'Please provide a valid name.' }));
    } else if (error.includes('phone')) {
      setErrors(prev => ({ ...prev, phone: 'Please provide a valid phone number.' }));
    } else {
      setErrors(prev => ({ ...prev, general: error }));
    }
  }

  function handleZodError(error: ZodError) {
    const newErrors: FormErrors = {};
    error.errors.forEach((err) => {
      if (err.path) {
        const field = err.path[0] as keyof FormErrors;
        newErrors[field] = err.message;
      }
    });
    setErrors(newErrors);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
            />
            {errors.name && <AlertDescription className="text-red-500 text-sm">{errors.name}</AlertDescription>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
            />
            {errors.email && <AlertDescription className="text-red-500 text-sm">{errors.email}</AlertDescription>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
            />
            {errors.password && <AlertDescription className="text-red-500 text-sm">{errors.password}</AlertDescription>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              required
            />
            {errors.phone && <AlertDescription className="text-red-500 text-sm">{errors.phone}</AlertDescription>}
          </div>
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Register Manager
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}