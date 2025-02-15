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
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import ReligionSelector from '../shared-components/religion-selector';

const MotherInformationCard: React.FC = () => {
  const { control, watch, setError, clearErrors } =
    useFormContext<BirthCertificateFormValues>();
  const [ncrMode, setNcrMode] = useState(false);

  // Watch the three fields in real time
  const total = watch('motherInfo.totalChildrenBornAlive');
  const living = watch('motherInfo.childrenStillLiving');
  const dead = watch('motherInfo.childrenNowDead');

  // Run a side effect whenever these three fields change
  useEffect(() => {
    // If all three fields have some value (non-empty)
    if (total.trim() !== '' && living.trim() !== '' && dead.trim() !== '') {
      const totalNum = Number(total);
      const livingNum = Number(living);
      const deadNum = Number(dead);

      // If they are valid numbers, check the sum
      if (!isNaN(totalNum) && !isNaN(livingNum) && !isNaN(deadNum)) {
        if (totalNum !== livingNum + deadNum) {
          // Immediately set a manual error on totalChildrenBornAlive
          setError('motherInfo.totalChildrenBornAlive', {
            type: 'manual',
            message:
              'Total children born alive must equal sum of living and deceased children',
          });
        } else {
          // Clear the error if they now match
          clearErrors('motherInfo.totalChildrenBornAlive');
        }
      }
    } else {
      // If the user hasn't filled all three fields yet, clear the sum error
      clearErrors('motherInfo.totalChildrenBornAlive');
    }
  }, [total, living, dead, setError, clearErrors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Mother Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information */}
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

        {/* Additional Details */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
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
                      <ReligionSelector
                        value={field.value}
                        onValueChange={field.onChange}
                        ref={field.ref}
                        placeholder='Select religion'
                        name='motherInfo.religion'
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
              <FormField
                control={control}
                name='motherInfo.age'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter age'
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

        {/* Children Information */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Children Information
            </CardTitle>
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
                        placeholder='Enter total'
                        {...field}
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
                    <FormLabel>Children Still Living</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter number'
                        {...field}
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
                    <FormLabel>Children Now Dead</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter number'
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

        {/* Residence */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>Residence</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='motherInfo.residence.houseNo'
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
              <FormField
                control={control}
                name='motherInfo.residence.st'
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
            <div className='mt-4 space-y-2'>
              <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setNcrMode} />
              <LocationSelector
                provinceFieldName='motherInfo.residence.province'
                municipalityFieldName='motherInfo.residence.cityMunicipality'
                barangayFieldName='motherInfo.residence.barangay'
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

export default MotherInformationCard;
