// MedicalCertificateCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const MedicalCertificateCard: React.FC = () => {
  const { control, watch } = useFormContext<DeathCertificateFormValues>();
  const sex = watch('sex');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Certificate</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Causes of Death */}
        <div className='space-y-4'>
          <FormField
            control={control}
            name='causesOfDeath.immediate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immediate Cause</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='causesOfDeath.antecedent'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Antecedent Cause</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='causesOfDeath.underlying'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Underlying Cause</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Maternal Condition */}
        {sex === 'Female' && (
          <FormField
            control={control}
            name='maternalCondition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maternal Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select maternal condition' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='pregnant_not_in_labour'>
                      Pregnant, not in labour
                    </SelectItem>
                    <SelectItem value='pregnant_in_labour'>
                      Pregnant, in labour
                    </SelectItem>
                    <SelectItem value='less_than_42_days'>
                      Less than 42 days after delivery
                    </SelectItem>
                    <SelectItem value='42_days_to_1_year'>
                      42 days to 1 year after delivery
                    </SelectItem>
                    <SelectItem value='none'>None of the choices</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* External Causes */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium'>Death by External Causes</h4>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalCertificateCard;
