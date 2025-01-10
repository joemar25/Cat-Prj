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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Type of Attendant */}
        <FormField
          control={control}
          name='attendant.type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Attendant</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                        <FormLabel className='font-normal'>{type}</FormLabel>
                      </FormItem>
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time and Date of Certification */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='attendant.certification.time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Birth</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='attendant.certification.date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name and Title of Attendant */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='attendant.certification.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
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
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input placeholder='Enter title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address of Attendant */}
        <FormField
          control={control}
          name='attendant.certification.address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='Enter complete address' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;
