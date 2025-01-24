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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FatherInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Father Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Personal Information</h3>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.firstName'
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
                  name='fatherInfo.middleName'
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
                  name='fatherInfo.lastName'
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

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.citizenship'
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
                <FormField
                  control={control}
                  name='fatherInfo.religion'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
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
                <FormField
                  control={control}
                  name='fatherInfo.occupation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter occupation'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={control}
                  name='fatherInfo.age'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Age at time of this birth (completed Years)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter age'
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
            </div>
          </CardContent>
        </Card>

        {/* Residence Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Residence Information</h3>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.residence.address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House No., St., Barangay</FormLabel>
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
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.residence.province'
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
                          allProvinces.find((p) => p.name === field.value)
                            ?.id || ''
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
                  name='fatherInfo.residence.cityMunicipality'
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
                <FormField
                  control={control}
                  name='fatherInfo.residence.country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default FatherInformationCard;
