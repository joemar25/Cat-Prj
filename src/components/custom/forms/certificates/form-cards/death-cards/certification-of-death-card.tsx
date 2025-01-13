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
import { Switch } from '@/components/ui/switch';
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationOfDeathCard: React.FC = () => {
  const { control, watch, setValue } =
    useFormContext<DeathCertificateFormValues>(); // Destructure watch and setValue

  // Watch reviewedBy.name field
  const watchedName = watch('certification.reviewedBy.name');

  // Auto-fill logic for title and position
  useEffect(() => {
    const selectedStaff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === watchedName
    );
    if (selectedStaff) {
      setValue('certification.reviewedBy.title', selectedStaff.title);
      setValue('certification.reviewedBy.position', selectedStaff.position);
    }
  }, [watchedName, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Death</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Has Attended Switch */}
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

        {/* Death Date and Time */}
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

        {/* Signature and Name */}
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

        {/* Title and Address */}
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

        {/* Certification Date */}
        <FormField
          control={control}
          name='certification.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField field={field} label='Date' />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reviewed By - Name */}
        <FormField
          control={control}
          name='certification.reviewedBy.name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name in Print (Reviewed By)</FormLabel>
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

        {/* Reviewed By - Title */}
        <FormField
          control={control}
          name='certification.reviewedBy.title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

        {/* Reviewed By - Position */}
        <FormField
          control={control}
          name='certification.reviewedBy.position'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Position will auto-fill'
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reviewed By - Date */}
        <FormField
          control={control}
          name='certification.reviewedBy.date'
          render={({ field }) => {
            const dateValue = field.value ? new Date(field.value) : new Date();

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
                label='Date (Reviewed By)'
                placeholder='Select date'
              />
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationOfDeathCard;
