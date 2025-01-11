import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationOfDeathCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Death</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Attended the Deceased */}
          <FormField
            control={control}
            name='certification.hasAttended'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>
                    Have you attended the deceased?
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Date and Time of Death */}
          <FormField
            control={control}
            name='certification.deathDateTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date and Time of Death</FormLabel>
                <FormControl>
                  <Input {...field} type='datetime-local' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Signature and Name in Print */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='certification.signature'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='certification.nameInPrint'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name in Print</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Title or Position */}
          <FormField
            control={control}
            name='certification.titleOfPosition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address */}
          <FormField
            control={control}
            name='certification.address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date */}
          <FormField
            control={control}
            name='certification.date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <DatePickerField field={field} label='Date' />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationOfDeathCard;
