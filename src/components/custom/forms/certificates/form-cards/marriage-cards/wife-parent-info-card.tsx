'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const WifeParentsInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Wife&apos;s Parents Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Father's Name */}
          <FormField
            control={control}
            name='wifeFatherName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s First Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeFatherName.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeFatherName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Last Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Father's Citizenship */}
          <FormField
            control={control}
            name='wifeFatherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Citizenship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mother's Name */}
          <FormField
            control={control}
            name='wifeMotherMaidenName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s First Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeMotherMaidenName.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeMotherMaidenName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Last Name (Maiden)</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mother's Citizenship */}
          <FormField
            control={control}
            name='wifeMotherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Citizenship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WifeParentsInfoCard;
