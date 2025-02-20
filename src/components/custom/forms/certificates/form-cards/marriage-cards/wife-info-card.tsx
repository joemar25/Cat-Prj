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
import React, { useEffect, useState } from 'react';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { useFormContext, useWatch } from 'react-hook-form';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

const WifeInfoCard: React.FC = () => {
  const { control, setValue } = useFormContext<MarriageCertificateFormValues>();
  const [ncrMode, setncrMode] = useState(false);

  // Auto-calculate and set age when birthdate changes
  const birthDate = useWatch({ control, name: 'wifeInfo.birth' });

  useEffect(() => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();

      // Check if the birth month and day have not yet occurred in the current year
      const isBirthdayNotPassed =
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

      if (isBirthdayNotPassed) {
        age -= 1; // Subtract 1 year if the birthday hasn't occurred yet this year
      }

      setValue('wifeInfo.age', age.toString()); // Update the age field
    }
  }, [birthDate, setValue]);

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Wife&apos;s Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* First Name */}
          <FormField
            control={control}
            name='wifeInfo.name.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Middle Name */}
          <FormField
            control={control}
            name='wifeInfo.name.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Last Name */}
          <FormField
            control={control}
            name='wifeInfo.name.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* Sex */}
          <FormField
            control={control}
            name='wifeInfo.sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'female'}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select sex' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='female'>Female</SelectItem>
                    <SelectItem value='male'>Male</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth */}
          <FormField
            control={control}
            name='wifeInfo.birth'
            render={({ field }) => (
              <DatePickerField field={{
                onChange: field.onChange,
                value: field.value || ''
              }}
                label='Date of Birth'
              />
            )}
          />
          {/* Age - Auto-filled */}
          <FormField
            control={control}
            name='wifeInfo.age'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    className='h-10' type='number' placeholder='Enter age'
                    {...field}
                    value={field.value || ''}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Citizenship */}
          <FormField
            control={control}
            name='wifeInfo.citizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Religion */}
          <FormField
            control={control}
            name='wifeInfo.religion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion/Religious Sect</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter religion'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Civil Status */}
          <FormField
            control={control}
            name='wifeInfo.civilStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select civil status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='single'>Single</SelectItem>
                    <SelectItem value='widowed'>Widowed</SelectItem>
                    <SelectItem value='divorced'>Divorced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='col-span-1 md:col-span-3'>
          <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setncrMode} />
        </div>
        {/* Place of Birth */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>

          {/* Place of Birth */}
          <LocationSelector
            provinceFieldName='husbandInfo.placeOfBirth.province'
            municipalityFieldName='husbandInfo.placeOfBirth.cityMunicipality'
            barangayFieldName='husbandInfo.placeOfBirth.barangay'
            provinceLabel='Province'
            municipalityLabel='City/Municipality'
            barangayLabel='Barangay'
            isNCRMode={ncrMode}
            showBarangay={true}
            provincePlaceholder='Select province'
            municipalityPlaceholder='Select city/municipality'
            barangayPlaceholder='Select barangay'
          />
          <FormField
            control={control}
            name='husbandInfo.placeOfBirth.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    type='text' className='h-10' placeholder='Enter complete address'
                    {...field}
                    value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Residence */}
          <FormField
            control={control}
            name='wifeInfo.residence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residence</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='h-10'
                    placeholder='Enter complete address'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default WifeInfoCard;
