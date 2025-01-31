'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const RegisteredAtOfficeCard: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<BirthCertificateFormValues>();
  const selectedName = watch('registeredByOffice.name');

  // Auto-fill title when name is selected
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue('registeredByOffice.title', staff.title, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
    }
  }, [selectedName, setValue, isSubmitted]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered at the Office of Civil Registrar</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Name */}
          <FormField
            control={control}
            name='registeredByOffice.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
            name='registeredByOffice.title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Title will auto-fill'
                    {...field}
                    className='h-10'
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registered By Office Date */}
          <FormField
            control={control}
            name='registeredByOffice.date'
            render={({ field }) => (
              <DatePickerField
                field={{
                  value: field.value,
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredAtOfficeCard;
