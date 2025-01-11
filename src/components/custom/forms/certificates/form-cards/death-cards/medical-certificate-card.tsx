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

const MedicalCertificateCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Immediate Cause */}
          <FormField
            control={control}
            name='causesOfDeath.immediate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immediate Cause</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter immediate cause of death'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Antecedent Cause */}
          <FormField
            control={control}
            name='causesOfDeath.antecedent'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Antecedent Cause</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter antecedent cause of death'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Underlying Cause */}
          <FormField
            control={control}
            name='causesOfDeath.underlying'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Underlying Cause</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter underlying cause of death'
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

export default MedicalCertificateCard;
