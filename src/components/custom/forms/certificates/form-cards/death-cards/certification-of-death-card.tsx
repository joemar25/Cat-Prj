'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import TimePicker from '@/components/custom/time/time-picker';
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
import { Switch } from '@/components/ui/switch';
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationOfDeathCard: React.FC = () => {
  const { control, watch, setValue } =
    useFormContext<DeathCertificateFormValues>();

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
      <CardHeader className='pb-3'>
        <h3 className='text-sm font-semibold'>Certification of Death</h3>
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
                  checked={field.value === 'true'}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? 'true' : 'false')
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Death Date and Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='timeOfDeath'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Death</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value || null} // Ensure value is Date | null
                    onChange={(value) => field.onChange(value)} // Pass Date | null directly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Signature and Name */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='certification.signature'
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
            name='certification.name'
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
            name='certification.title'
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
            name='certification.address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter Full Address'
                    value={field.value ? JSON.stringify(field.value) : ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
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
          name='certification.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value,
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
              />
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
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value,
                  onChange: field.onChange,
                }}
                label='Date (Reviewed By)'
                placeholder='Select date'
              />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationOfDeathCard;
