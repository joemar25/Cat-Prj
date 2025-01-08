// src\components\custom\users\actions\add-user-dialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleCreateUser } from '@/hooks/users-action';
import { registrationForm, RegistrationForm } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddUserDialogProps {
  onSuccess?: () => void;
}

export function AddUserDialog({ onSuccess }: AddUserDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationForm),
    defaultValues: {
      name: '',
      email: '',

      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      occupation: '',
      gender: undefined,
      nationality: '',
    },
  });

  async function onSubmit(data: RegistrationForm) {
    try {
      const formData = new FormData();
      // Add all form fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const result = await handleCreateUser(formData);

      if (result.success) {
        toast.success(result.message);
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('An unexpected error occurred');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='h-8'>
          <Icons.plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-7xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
          <DialogDescription>
            Regsiter new user account with detailed information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-medium'>Basic Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter full name' />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          placeholder='Enter email address'
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
              <h2 className='text-lg font-medium'>Personal Details</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter phone number' />
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
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter nationality' />
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
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter occupation' />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className='space-y-4'>
              <h2 className='text-lg font-medium'>Address Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter address' />
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
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter city' />
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
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter state' />
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
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter country' />
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
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter postal code' />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icons.plus className='mr-2 h-4 w-4' />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Marriage Available ----------------//
// ---------- Form 3A ----------------//
// Fields
// Two colums husband and wife
// Row of the two columns
/**
 * Name
 * Data of Birth/Age
 * Citizenship
 * Civil Status
 * Mother
 * Father
 * 1 row
 * Registry Number
 * Date of Regsitration
 * Date of Marriage
 * Place of Marriage
 *
 * Prepared by: name and signature of the current staff, position
 * verified by: name and signature of the current staff, position
 * Amount Paid
 * O.R Number
 * Date Paid
 *
 */

// ---------- Birth Available ----------------//
// ---------- Form 1A ----------------//
// Fields
/**
 * Page Number
 * Book Number
 * Registry Number
 * Date of Registration
 * Name of Child
 * Sex
 * Date of Birth
 * Place of Birth
 * Name of Mother
 * Name of Father
 * Cititzenship of Mother
 * Citizenship of Father
 * Date of Marrigae Parents
 * Place of Marrigae Parents
 * Remarks
 * Prepared By
 * Verified By
 *
 */
// ---------- Death Available ----------------//
// ---------- Form 1A ----------------//
// Fields
/**
 * Registry Number
 * Date of Registration Number
 * Name of Deceased
 * Sex
 * Age
 * Civil Status
 * Citizenship
 * Date of Death
 * Place of Death
 * Cause of Death
 * Prepared By
 * Verified By
 *
 *
 */
