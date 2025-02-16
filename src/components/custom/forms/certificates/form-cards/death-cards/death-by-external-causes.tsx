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
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const DeathByExternalCausesCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Death by External Causes</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Manner of Death */}
        <FormField
          control={control}
          name='medicalCertificate.externalCauses.mannerOfDeath'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manner of Death</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Homicide, Suicide, Accident, Legal Intervention, etc.'
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Place of Occurrence */}
        <FormField
          control={control}
          name='medicalCertificate.externalCauses.placeOfOccurrence'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Occurrence</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Home, farm, factory, street, sea, etc.'
                  ref={field.ref}
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

export default DeathByExternalCausesCard;
