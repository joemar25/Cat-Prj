'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import TimePicker from '@/components/custom/time/time-picker';
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
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationOfDeathCard: React.FC = () => {
  const { control, setValue, watch } =
    useFormContext<DeathCertificateFormValues>();

  // NOTE: The revised schema no longer includes additional "reviewedBy" fields
  // such as name, title, and position. Therefore, the auto-fill logic is removed.

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle>Certification of Death</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Has Attended Switch */}
        <FormField
          control={control}
          name='certificationOfDeath.hasAttended'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <FormLabel className='text-base'>
                Have you attended the deceased?
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Death Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='timeOfDeath'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Death</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value ?? null}
                    onChange={(value) => field.onChange(value)}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certification Signature and Name */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='certificationOfDeath.signature'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter signature'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='certificationOfDeath.nameInPrint'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <FormControl>
                  <Input className='h-10' placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Title and Address */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='certificationOfDeath.titleOfPosition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter title'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='certificationOfDeath.address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter full address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certification Date */}
        <FormField
          control={control}
          name='certificationOfDeath.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value ?? '',
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
              />
            </FormItem>
          )}
        />

        {/* Reviewed By Section Removed */}
      </CardContent>
    </Card>
  );
};

export default CertificationOfDeathCard;
