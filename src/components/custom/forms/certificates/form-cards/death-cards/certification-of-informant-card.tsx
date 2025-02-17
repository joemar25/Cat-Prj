'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';

const CertificationInformantCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <h3 className='text-sm font-semibold'>Certification of Informant</h3>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Signature */}
        <FormField
          control={control}
          name='informant.signature'
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

        {/* Name */}
        <FormField
          control={control}
          name='informant.nameInPrint'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className='h-10' placeholder='Enter name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Relationship to Deceased */}
        <FormField
          control={control}
          name='informant.relationshipToDeceased'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to the Deceased</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Enter relationship'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <LocationSelector
          provinceFieldName='informant.address.province'
          municipalityFieldName='informant.address.cityMunicipality'
          barangayFieldName='informant.address.barangay'
          provinceLabel='Province'
          municipalityLabel='City/Municipality'
          barangayLabel='Barangay'
          provincePlaceholder='Select province...'
          municipalityPlaceholder='Select city/municipality...'
          barangayPlaceholder='Select barangay...'
          showBarangay={true}
          isNCRMode={false}
        />

        {/* House No. and Street */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='informant.address.houseNo'
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
            name='informant.address.st'
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
        </div>

        {/* Country */}
        <FormField
          control={control}
          name='informant.address.country'
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

        {/* Informant Date */}
        <FormField
          control={control}
          name='informant.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value ?? null,
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
                ref={field.ref}
              />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationInformantCard;
