'use client';

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
import { RegistrationForm } from '@/lib/zod';
import { UseFormReturn } from 'react-hook-form';

type RegisterFormProps = {
  form: UseFormReturn<RegistrationForm>;
  onSubmit: (data: RegistrationForm) => Promise<void>;
  isLoading: boolean;
};

const RegisterForm = ({ form, onSubmit, isLoading }: RegisterFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <h2 className='text-lg font-medium text-white'>Basic Information</h2>
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
                  <FormLabel className='text-white'>Confirm Password</FormLabel>
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
          <h2 className='text-lg font-medium text-white'>Personal Details</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>Date of Birth</FormLabel>
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
            <FormField
              control={form.control}
              name='nationality'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>Nationality</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='bg-gray-900 text-white border-gray-700'
                      placeholder='Enter your nationality'
                    />
                  </FormControl>
                  <FormMessage className='text-red-400' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='occupation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='bg-gray-900 text-white border-gray-700'
                      placeholder='Enter your occupation'
                    />
                  </FormControl>
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
  );
};

export default RegisterForm;
