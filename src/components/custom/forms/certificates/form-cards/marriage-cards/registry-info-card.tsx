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

const RegistryInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Registry Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Registry Number */}
          <FormField
            control={control}
            name='registryNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registry No.</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter registry number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Province */}
          <FormField
            control={control}
            name='province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter province'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* City/Municipality */}
          <FormField
            control={control}
            name='cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter city/municipality'
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

export default RegistryInfoCard;
