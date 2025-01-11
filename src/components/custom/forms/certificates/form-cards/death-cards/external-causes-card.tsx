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

const ExternalCausesCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Death by External Causes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Manner of Death */}
          <FormField
            control={control}
            name='deathByExternalCauses.mannerOfDeath'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manner of Death</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Homicide, Suicide, Accident, Legal Intervention, etc.'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Place of Occurrence */}
          <FormField
            control={control}
            name='deathByExternalCauses.placeOfOccurrence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Occurrence</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Home, farm, factory, street, sea, etc.'
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

export default ExternalCausesCard;
