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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ChildInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Child Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Personal Information</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='childInfo.firstName'
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
                name='childInfo.middleName'
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
                name='childInfo.lastName'
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

        {/* Physical Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Physical Information</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='childInfo.sex'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
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
                name='childInfo.weightAtBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight at Birth (kilograms)</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter weight (e.g., 3.5)'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value) || value === '') {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Birth Date Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Birth Date</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='childInfo.dateOfBirth'
              render={({ field }) => {
                const dateValue = field.value
                  ? new Date(field.value.split('/').reverse().join('-'))
                  : undefined;

                return (
                  <DatePickerField
                    field={{
                      value: dateValue,
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
                    label='Birth Date'
                    placeholder='Select birth date'
                  />
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Place of Birth Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Place of Birth</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='childInfo.placeOfBirth.hospital'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital/Clinic/Institution</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter place of birth'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='childInfo.placeOfBirth.province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const provinceObj = allProvinces.find(
                          (p) => p.id === value
                        );
                        field.onChange(provinceObj?.name || '');
                        setSelectedProvince(value);
                      }}
                      value={
                        allProvinces.find((p) => p.name === field.value)?.id ||
                        ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
                          <SelectValue placeholder='Select province' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allProvinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='childInfo.placeOfBirth.cityMunicipality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!selectedProvince}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
                          <SelectValue placeholder='Select city/municipality' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citiesMunicipalities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Birth Order Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Birth Order Information</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='childInfo.typeOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Birth</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Single'>Single</SelectItem>
                        <SelectItem value='Twin'>Twin</SelectItem>
                        <SelectItem value='Triplet'>Triplet</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='childInfo.multipleBirthOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>If Multiple Birth</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
                          <SelectValue placeholder='Select order' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='First'>First</SelectItem>
                        <SelectItem value='Second'>Second</SelectItem>
                        <SelectItem value='Third'>Third</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='childInfo.birthOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Order</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter birth order'
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) || value === '') {
                            field.onChange(value);
                          }
                        }}
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

export default ChildInformationCard;
