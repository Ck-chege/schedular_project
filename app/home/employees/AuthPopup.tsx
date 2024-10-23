import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from '@/types/tableDataTypes';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const PasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
    )
});

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSetPassword: (formData: FormData) => Promise<void>;
}

function AuthPopup({ isOpen, onClose, employee, onSetPassword }: AuthPopupProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetPassword = async () => {
    setError(null);
    try {
      PasswordSchema.parse({ password });
      if (password) {
        const formData = new FormData();
        formData.append('employee_id', employee.id.toString());
        formData.append('password', password);
        formData.append('email', employee.email);
        setIsLoading(true);
        try {
          await onSetPassword(formData);
          setPassword('');
          onClose();
        } catch (error) {
          console.error('Failed to set password:', error);
          setError('Failed to set password. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        setError(zodError.errors[0].message);
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-6 rounded-lg shadow-xl border-2 border-gray-300 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">Set Password for {employee?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="email" className="mb-1 font-medium">
              Email
            </Label>
            <Input id="email" value={employee?.email || ''} className="bg-gray-100" disabled />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password" className="mb-1 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handleSetPassword} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? 'Setting...' : 'Set Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AuthPopup;
