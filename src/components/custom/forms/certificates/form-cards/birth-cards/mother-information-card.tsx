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

const MotherInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Mother Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>
              Personal Information (Maiden Name)
            </h3>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='motherInfo.firstName'
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
                  name='motherInfo.middleName'
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
                  name='motherInfo.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name (Maiden)</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter maiden name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Personal Information */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='motherInfo.citizenship'
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
                  name='motherInfo.religion'
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
                  name='motherInfo.occupation'
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

              {/* Age Field */}
              <div>
                <FormField
                  control={control}
                  name='motherInfo.age'
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

        {/* Children Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Children Information</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='motherInfo.totalChildrenBornAlive'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Children Born Alive</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter number'
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
              <FormField
                control={control}
                name='motherInfo.childrenStillLiving'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      No. Children Still Living including this birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter number'
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
              <FormField
                control={control}
                name='motherInfo.childrenNowDead'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Children Born Alive But now Dead</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter number'
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
                  name='motherInfo.residence.address'
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
                  name='motherInfo.residence.province'
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
                  name='motherInfo.residence.cityMunicipality'
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
                  name='motherInfo.residence.country'
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

export default MotherInformationCard;
