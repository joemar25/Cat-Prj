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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { parseToDate } from '@/utils/date';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Type of Attendant */}
        <FormField
          control={control}
          name='attendant.type' // Correct path
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Attendant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select attendant type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Private Physician'>
                    Private Physician
                  </SelectItem>
                  <SelectItem value='Public Health Officer'>
                    Public Health Officer
                  </SelectItem>
                  <SelectItem value='Hospital Authority'>
                    Hospital Authority
                  </SelectItem>
                  <SelectItem value='None'>None</SelectItem>
                  <SelectItem value='Others'>Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Attendance Duration Section */}
        <div className='grid grid-cols-2 gap-4'>
          {/* From Date */}
          <FormField
            control={control}
            name='attendant.attendance.from'
            render={({ field }) => {
              // Parse the MM/DD/YYYY string into Date object
              const dateValue = field.value
                ? (() => {
                    const [month, day, year] = field.value.split('/');
                    return parseToDate(year, month, day);
                  })()
                : undefined;

              return (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: dateValue || undefined,
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
                    label='From'
                    placeholder='Select start date'
                  />
                </FormItem>
              );
            }}
          />

          {/* To Date */}
          <FormField
            control={control}
            name='attendant.attendance.to'
            render={({ field }) => {
              // Parse the MM/DD/YYYY string into Date object
              const dateValue = field.value
                ? (() => {
                    const [month, day, year] = field.value.split('/');
                    return parseToDate(year, month, day);
                  })()
                : undefined;

              return (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: dateValue || undefined,
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
                    label='To'
                    placeholder='Select end date'
                  />
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;
