'use client';

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
import {
  CIVIL_REGISTRAR_STAFF,
  COMMON_DATES,
} from '@/lib/constants/civil-registrar-staff';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const RegisteredByCard: React.FC = () => {
  const { control, watch, setValue } =
    useFormContext<BirthCertificateFormValues>();
  const [showCustomDate, setShowCustomDate] = useState(false);
  const selectedName = watch('registeredBy.name');

  // Auto-fill title when name is selected
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue('registeredBy.title', staff.title);
    }
  }, [selectedName, setValue]);

  // Handle date selection
  const handleDateSelection = (value: string) => {
    let dateToSet = '';

    if (value === 'today') {
      dateToSet = new Date().toISOString().split('T')[0];
      setShowCustomDate(false);
    } else if (value === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateToSet = yesterday.toISOString().split('T')[0];
      setShowCustomDate(false);
    } else {
      setShowCustomDate(true);
      return;
    }

    setValue('registeredBy.date', dateToSet);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered at the Office of Civil Registrar</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='registeredBy.name'
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

          <FormField
            control={control}
            name='registeredBy.title'
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

          <div>
            <FormField
              control={control}
              name='registeredBy.date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Select
                    onValueChange={handleDateSelection}
                    defaultValue='today'
                  >
                    <FormControl>
                      <SelectTrigger className='h-10'>
                        <SelectValue placeholder='Select date' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMON_DATES.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showCustomDate && (
                    <Input className='h-10 mt-2' type='date' {...field} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredByCard;
