'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import TimePicker from '@/components/custom/time-picker/time-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [showOtherInput, setShowOtherInput] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Type of Attendant Card */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Type of Attendant</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='attendant.type'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        setShowOtherInput(value === 'Others');
                        field.onChange(value);
                      }}
                      value={field.value}
                      className='grid grid-cols-2 md:grid-cols-5 gap-4'
                    >
                      {['Physician', 'Nurse', 'Midwife', 'Hilot', 'Others'].map(
                        (type) => (
                          <FormItem
                            key={type}
                            className='flex items-center space-x-3 space-y-0'
                          >
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {type}
                            </FormLabel>
                          </FormItem>
                        )
                      )}
                    </RadioGroup>
                  </FormControl>
                  {showOtherInput && (
                    <Input
                      placeholder='Please specify other attendant type'
                      value={field.value === 'Others' ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='mt-2 h-10'
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Certification Details Card */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Certification Details</h3>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <FormField
                control={control}
                name='attendant.certification.time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Birth</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='attendant.certification.name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Attendant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter full name'
                          {...field}
                          className='h-10'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='attendant.certification.title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title/Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter title/designation'
                          {...field}
                          className='h-10'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name='attendant.certification.address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter complete address'
                        {...field}
                        className='h-10'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='attendant.certification.date'
                render={({ field }) => (
                  <DatePickerField
                    field={{
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    label='Date'
                    placeholder='Select date'
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;
