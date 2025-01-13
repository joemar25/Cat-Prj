import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const DeathByExternalCausesCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Death by External Causes</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <FormField
          control={control}
          name='deathByExternalCauses.mannerOfDeath'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manner of Death</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Homicide, Suicide, Accident, Legal Intervention, etc.'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='deathByExternalCauses.placeOfOccurrence'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Occurrence</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='home, farm, factory, street, sea, etc.'
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
