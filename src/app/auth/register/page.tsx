'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Validation schema
import { handleRegistration } from '@/hooks/auth-actions';
import * as z from 'zod';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    dateOfBirth: z.string(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    occupation: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    nationality: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormSchema = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (data: FormSchema) => {
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
    <div className='min-h-screen flex items-center justify-center py-12'>
      <div className='p-6 rounded-lg shadow-lg w-full max-w-2xl bg-black/95'>
        <h1 className='text-2xl font-semibold mb-6 text-white'>
          Create an Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-medium text-white'>
                Basic Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your name'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your email'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your password'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Confirm your password'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className='space-y-4'>
              <h2 className='text-lg font-medium text-white'>
                Personal Details
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your phone number'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-gray-900 text-white border-gray-700'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='female'>Female</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-medium text-white'>
                Address Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your address'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your city'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>State</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your state'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Country</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your country'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='bg-gray-900 text-white border-gray-700'
                          placeholder='Enter your postal code'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-white text-black hover:bg-gray-200'
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
