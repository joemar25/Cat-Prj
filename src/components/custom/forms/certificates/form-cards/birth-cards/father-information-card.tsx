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
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import ReligionSelector from '../shared-components/religion-selector';

const FatherInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [ncrMode, setNcrMode] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Father Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information Section */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
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
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <ReligionSelector
                        value={field.value}
                        onValueChange={field.onChange}
                        ref={field.ref}
                        placeholder='Select religion'
                        name='fatherInfo.religion'
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

            <div className='mt-4'>
              <FormField
                control={control}
                name='fatherInfo.age'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Age at time of this birth (in completed years)
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
          </CardContent>
        </Card>

        {/* Residence Information Section */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Residence Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setNcrMode} />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* House Number */}
              <FormField
                control={control}
                name='fatherInfo.residence.houseNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House No.</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter house number'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Street */}
              <FormField
                control={control}
                name='fatherInfo.residence.st'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter street'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
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

            {/* Location Selector for Province, City/Municipality, and Barangay */}
            <div className='mt-4'>
              <LocationSelector
                provinceFieldName='fatherInfo.residence.province'
                municipalityFieldName='fatherInfo.residence.cityMunicipality'
                barangayFieldName='fatherInfo.residence.barangay'
                provinceLabel='Province'
                municipalityLabel='City/Municipality'
                barangayLabel='Barangay'
                isNCRMode={ncrMode}
                showBarangay={true}
                provincePlaceholder='Select province'
                municipalityPlaceholder='Select city/municipality'
                barangayPlaceholder='Select barangay'
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default FatherInformationCard;
