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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import SignatureUploader from '../shared-components/signature-uploader';

const CertificationOfInformantCard: React.FC = () => {
  const { control, setValue } = useFormContext<BirthCertificateFormValues>();
  const [ncrMode, setncrMode] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Informant</CardTitle>
      </CardHeader>
      <CardContent>
        <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setncrMode} />
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='informant.signature'
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <SignatureUploader
                      name='informant.signature'
                      label='Signature'
                      onChange={(file) =>
                        setValue('informant.signature', file, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.informant?.signature?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={control}
              name='informant.date'
              render={({ field }) => (
                <DatePickerField
                  field={{
                    value: field.value,
                    onChange: field.onChange,
                  }}
                  label='Date'
                  placeholder='Select date'
                  ref={field.ref} // Forward ref for auto-focus
                />
              )}
            />

            {/* Name in Print */}
            <FormField
              control={control}
              name='informant.name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name in Print</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter name'
                      {...field}
                      ref={field.ref}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship */}
            <FormField
              control={control}
              name='informant.relationship'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to the Child</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter relationship'
                      {...field}
                      ref={field.ref}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* House Number */}
            <FormField
              control={control}
              name='informant.address.houseNo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter house number'
                      {...field}
                      ref={field.ref}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street */}
            <FormField
              control={control}
              name='informant.address.st'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter street name'
                      {...field}
                      ref={field.ref}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selector – spans two columns */}
            <LocationSelector
              provinceFieldName='informant.address.province'
              municipalityFieldName='informant.address.cityMunicipality'
              barangayFieldName='informant.address.barangay'
              provinceLabel='Province'
              municipalityLabel='City/Municipality'
              selectTriggerClassName='h-10 px-3 text-base md:text-sm'
              provincePlaceholder='Select province'
              municipalityPlaceholder='Select city/municipality'
              className='col-span-2 grid grid-cols-2 gap-4'
              isNCRMode={ncrMode}
              showBarangay={true}
              barangayLabel='Barangay'
              barangayPlaceholder='Select barangay'
            />

            {/* Country */}
            <FormField
              control={control}
              name='informant.address.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter country'
                      {...field}
                      ref={field.ref}
                      className='h-10'
                    />
                  </FormControl>
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

export default CertificationOfInformantCard;
