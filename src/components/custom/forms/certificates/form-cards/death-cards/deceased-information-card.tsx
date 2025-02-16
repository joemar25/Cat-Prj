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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const DeceasedInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Deceased Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Name Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Name Details</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='name.first'
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
              <FormField
                control={control}
                name='name.middle'
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
              <FormField
                control={control}
                name='name.last'
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
            </div>
          </CardContent>
        </Card>

        {/* Identity Section */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-semibold'>
              Identity Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='sex'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger ref={field.ref} className='h-10'>
                          <SelectValue placeholder='Select sex' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Male'>Male</SelectItem>
                        <SelectItem value='Female'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='civilStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Civil Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger ref={field.ref} className='h-10'>
                          <SelectValue placeholder='Select civil status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Single'>Single</SelectItem>
                        <SelectItem value='Married'>Married</SelectItem>
                        <SelectItem value='Widowed'>Widowed</SelectItem>
                        <SelectItem value='Divorced'>Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates & Time Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Important Dates and Time
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Date of Death */}
              <FormField
                control={control}
                name='dateOfDeath'
                render={({ field }) => (
                  <FormItem>
                    <DatePickerField
                      field={{ value: field.value, onChange: field.onChange }}
                      label='Date of Death'
                      placeholder='Select date of death'
                      ref={field.ref}
                    />
                  </FormItem>
                )}
              />
              {/* Date of Birth */}
              <FormField
                control={control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <DatePickerField
                      field={{ value: field.value, onChange: field.onChange }}
                      label='Date of Birth'
                      placeholder='Select date of birth'
                      ref={field.ref}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* Time of Death */}
            <FormField
              control={control}
              name='timeOfDeath'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Death</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Age at Death Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Age at Time of Death
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-4 gap-4'>
              <FormField
                control={control}
                name='ageAtDeath.years'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Years'
                        inputMode='numeric'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value);
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='ageAtDeath.months'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Months</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Months'
                        inputMode='numeric'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value);
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='ageAtDeath.days'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Days'
                        inputMode='numeric'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value);
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='ageAtDeath.hours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Hours'
                        inputMode='numeric'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value);
                        }}
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
      </CardContent>
    </Card>
  );
};

export default DeceasedInformationCard;
