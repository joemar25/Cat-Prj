'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RegisterForm from '@/components/custom/auth/registration-form';
import { handleRegistration } from '@/hooks/auth-actions';
import { RegistrationForm, registrationForm } from '@/lib/zod';

interface PageProps {
  onSuccess?: () => void;
}

const Page = ({ onSuccess }: PageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // Directly check NEXT_PUBLIC_NODE_ENV like in sign-up-form
  const isDevelopment = process.env.NODE_ENV === 'development';

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationForm),
    // Define defaultValues directly in useForm like in sign-up-form
    defaultValues: {
      name: isDevelopment ? 'Scott Andrew Bedis' : '',
      email: isDevelopment ? 'bedisscottandrew@gmail.com' : '',
      password: isDevelopment ? '11111111' : '',
      confirmPassword: isDevelopment ? '11111111' : '',
      dateOfBirth: isDevelopment ? '2024-01-04' : '',
      phoneNumber: isDevelopment ? '09082091538' : '',
      address: isDevelopment ? 'Multiverse 1-0' : '',
      city: isDevelopment ? 'Legazpi' : '',
      state: isDevelopment ? '222222' : '',
      country: isDevelopment ? '22222222' : '',
      postalCode: isDevelopment ? '4509' : '',
      occupation: isDevelopment ? 'Developer' : '',
      gender: isDevelopment ? 'male' : 'other',
      nationality: isDevelopment ? 'Filipino' : '',
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
    console.log('Form submitted with data:', data);

    try {
      const result = await handleRegistration(data);

      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
        window.location.href = '/auth';
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Current form values:', form.getValues()); // Debug log
  console.log('Is Development:', isDevelopment); // Debug log

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='p-6 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-xl font-semibold mb-4'>Registration</h1>
        <RegisterForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Page;
