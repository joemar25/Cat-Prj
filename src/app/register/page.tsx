'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import RegisterForm from '@/components/custom/auth/registration-form';
import { RegistrationForm, registrationForm } from '@/lib/validation/zod';

const Page = () => {
  const [isLoading] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationForm),
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
    console.log('Form submitted with data:', data);
    // Add your desired behavior here or leave it empty for UI-only
  };

  console.log('Current form values:', form.getValues());
  console.log('Is Development:', isDevelopment);

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
