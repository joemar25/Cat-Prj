'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import TimePicker from '@/components/custom/time/time-picker';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

const CertificationOfDeathCard: React.FC = () => {
  const { control, watch } = useFormContext<DeathCertificateFormValues>();
  const [isNCRMode, setIsNCRMode] = useState(false);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle>Certification of Death</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Has Attended Switch */}
        <FormField
          control={control}
          name='certificationOfDeath.hasAttended'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <FormLabel className='text-base'>
                Have you attended the deceased?
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Death Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='timeOfDeath'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Death</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value ?? null}
                    onChange={(value) => field.onChange(value)}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Certification Signature and Name */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='certificationOfDeath.signature'
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
            name='certificationOfDeath.nameInPrint'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter name in print'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Title or Position */}
        <FormField
          control={control}
          name='certificationOfDeath.titleOfPosition'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title or Position</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Enter title or position'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Health Officer Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='certificationOfDeath.healthOfficerSignature'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Officer Signature</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter health officer signature'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='certificationOfDeath.healthOfficerNameInPrint'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Officer Name in Print</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter health officer name in print'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* NCR Mode Switch */}
        <NCRModeSwitch isNCRMode={isNCRMode} setIsNCRMode={setIsNCRMode} />

        {/* Address Section */}
        <div className='space-y-4'>
          {/* Location Selector for Province, City/Municipality, and Barangay */}
          <LocationSelector
            provinceFieldName='certificationOfDeath.address.province'
            municipalityFieldName='certificationOfDeath.address.cityMunicipality'
            barangayFieldName='certificationOfDeath.address.barangay'
            provinceLabel='Province'
            municipalityLabel='City/Municipality'
            barangayLabel='Barangay'
            isNCRMode={isNCRMode}
            showBarangay={true}
            provincePlaceholder='Select province'
            municipalityPlaceholder='Select city/municipality'
            barangayPlaceholder='Select barangay'
          />

          {/* Additional Address Details */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              control={control}
              name='certificationOfDeath.address.houseNo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House No.</FormLabel>
                  <FormControl>
                    <Input
                      className='h-10'
                      placeholder='House No.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='certificationOfDeath.address.st'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input className='h-10' placeholder='Street' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='certificationOfDeath.address.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input className='h-10' placeholder='Country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Certification Date */}
        <FormField
          control={control}
          name='certificationOfDeath.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value ?? '',
                  onChange: field.onChange,
                }}
                label='Certification Date'
                placeholder='Select certification date'
              />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationOfDeathCard;
