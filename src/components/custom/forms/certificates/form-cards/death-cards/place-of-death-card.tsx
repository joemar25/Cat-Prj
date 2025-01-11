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
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const PlaceOfDeathCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place of Death</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name='placeOfDeath'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Death</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter place of death' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PlaceOfDeathCard;
