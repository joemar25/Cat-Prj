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
import React from 'react';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { useFormContext } from 'react-hook-form';

const WifeInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Wife&apos;s Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* First Name */}
          <FormField
            control={control}
            name='wifeFirstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Middle Name */}
          <FormField
            control={control}
            name='wifeMiddleName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Last Name */}
          <FormField
            control={control}
            name='wifeLastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sex */}
          <FormField
            control={control}
            name='wifeSex'
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
          {/* Age */}
          <FormField
            control={control}
            name='wifeAge'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    type='number'
                    placeholder='Enter age'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth */}
          <FormField
            control={control}
            name='wifeDateOfBirth'
            render={({ field }) => (
              <DatePickerField field={field} label='Date of Birth' />
            )}
          />
          {/* Place of Birth */}
          <FormField
            control={control}
            name='wifePlaceOfBirth.cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth (City/Municipality)</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter city/municipality'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifePlaceOfBirth.province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth (Province)</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter province'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifePlaceOfBirth.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth (Country)</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter country'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Citizenship */}
          <FormField
            control={control}
            name='wifeCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Residence */}
          <FormField
            control={control}
            name='wifeResidence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residence</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter complete address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Religion */}
          <FormField
            control={control}
            name='wifeReligion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion/Religious Sect</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter religion'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Civil Status */}
          <FormField
            control={control}
            name='wifeCivilStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
      </CardContent>
    </Card>
  );
};

export default WifeInfoCard;
