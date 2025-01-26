'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const RegisteredAtOfficeCard: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<DeathCertificateFormValues>();
  const selectedName = watch('registeredAtCivilRegistrar.name');

  // Auto-fill title when name is selected
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue('registeredAtCivilRegistrar.title', staff.title, {
        shouldValidate: isSubmitted, // Only validate if form has been submitted
        shouldDirty: true,
      });
    }
  }, [selectedName, setValue, isSubmitted]);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <h3 className='text-sm font-semibold'>
          Registered at the Office of Civil Registrar
        </h3>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Name in Print */}
          <FormField
            control={control}
            name='registeredAtCivilRegistrar.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select staff name' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CIVIL_REGISTRAR_STAFF.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title or Position */}
          <FormField
            control={control}
            name='registeredAtCivilRegistrar.title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Title will auto-fill'
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registered At Civil Registrar Date */}
          <FormField
            control={control}
            name='registeredAtCivilRegistrar.date'
            render={({ field }) => (
              <FormItem>
                <DatePickerField
                  field={{
                    value: field.value ?? null,
                    onChange: field.onChange,
                  }}
                  label='Date'
                  placeholder='Select date'
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredAtOfficeCard;
