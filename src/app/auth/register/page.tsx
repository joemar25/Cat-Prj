'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Validation schema
import RegisterForm from '@/components/registration/registration-form';
import { handleRegistration } from '@/hooks/auth-actions';
import { RegistrationForm, registrationForm } from '@/lib/zod';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationForm),
    defaultValues: {
      name: 'Scott Andrew Bedis',
      email: 'bedisscottandrew@gmail.com',
      password: '11111111',
      confirmPassword: '11111111',
      dateOfBirth: '2024-01-04',
      phoneNumber: '09082091538',
      address: 'Multiverse 1-0',
      city: 'Legazpi',
      state: '222222',
      country: '22222222',
      postalCode: '4509',
      occupation: '',
      gender: 'male',
      nationality: '',
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
        window.location.href = '/auth/sign-in';
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
