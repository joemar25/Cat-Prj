import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const DateOfDeathAndBirthCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date of Death and Date of Birth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4 py-2'>
          {/* Date of Death */}
          <FormField
            control={control}
            name='dateOfDeath'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <DatePickerField field={field} label='Date of Death' />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth */}
          <FormField
            control={control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem className='pb-2'>
                <DatePickerField field={field} label='Date of Birth' />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DateOfDeathAndBirthCard;
