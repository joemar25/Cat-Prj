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

const LocationInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Registry Number */}
          <FormField
            control={control}
            name='registryNumber' // Updated to match DeathCertificateFormValues
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registry Number</FormLabel>
                <FormControl>
                  <Input placeholder='Enter registry number' {...field} />
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
                  <Input placeholder='Enter province' {...field} />
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
                  <Input placeholder='Enter city/municipality' {...field} />
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

export default LocationInformationCard;
