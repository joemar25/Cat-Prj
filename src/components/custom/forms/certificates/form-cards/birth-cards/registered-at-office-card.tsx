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

          {/* Date */}
          <FormField
            control={control}
            name='registeredByOffice.date'
            render={({ field, fieldState }) => {
              // Safely parse the date value
              let dateValue: Date | undefined;
              if (field.value && /^\d{2}\/\d{2}\/\d{4}$/.test(field.value)) {
                const [month, day, year] = field.value.split('/').map(Number);
                dateValue = new Date(year, month - 1, day);
                if (isNaN(dateValue.getTime())) {
                  dateValue = undefined; // Fallback to undefined if the date is invalid
                }
              }

              return (
                <FormItem>
                  <FormControl>
                    <DatePickerField
                      field={{
                        value: dateValue,
                        onChange: (date) => {
                          if (date) {
                            const month = (date.getMonth() + 1)
                              .toString()
                              .padStart(2, '0');
                            const day = date
                              .getDate()
                              .toString()
                              .padStart(2, '0');
                            const year = date.getFullYear();
                            field.onChange(`${month}/${day}/${year}`);
                          } else {
                            field.onChange('');
                          }
                        },
                      }}
                      label='Date'
                      placeholder='Select date'
                    />
                  </FormControl>
                  {/* Ensure FormMessage is only rendered once */}
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredAtOfficeCard;
