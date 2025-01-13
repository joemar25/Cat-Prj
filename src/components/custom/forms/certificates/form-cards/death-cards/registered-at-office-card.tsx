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
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const RegisteredAtOfficeCard: React.FC = () => {
  const { control, watch, setValue } =
    useFormContext<DeathCertificateFormValues>();
  const selectedName = watch('registeredAtCivilRegistrar.name'); // Updated for death certificate schema

  // Auto-fill title when name is selected
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue('registeredAtCivilRegistrar.title', staff.title); // Align with Zod schema
    }
  }, [selectedName, setValue]);

  // Set default date to today when component mounts
  useEffect(() => {
    if (!watch('registeredAtCivilRegistrar.date')) {
      setValue('registeredAtCivilRegistrar.date', new Date()); // Use Date object
    }
  }, [setValue, watch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered at the Office of Civil Registrar</CardTitle>
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

          {/* Date */}
          <FormField
            control={control}
            name='registeredAtCivilRegistrar.date'
            render={({ field }) => {
              const dateValue = field.value
                ? new Date(field.value)
                : new Date();

              return (
                <DatePickerField
                  field={{
                    value: dateValue,
                    onChange: (date) => {
                      if (date) {
                        field.onChange(date.toISOString());
                      } else {
                        field.onChange(new Date().toISOString());
                      }
                    },
                  }}
                  label='Date'
                  placeholder='Select date'
                />
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredAtOfficeCard;
