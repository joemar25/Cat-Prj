'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const RemarksCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks/Annotations</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name='remarks'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter any additional remarks or annotations'
                  className='min-h-[100px] resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default RemarksCard;
