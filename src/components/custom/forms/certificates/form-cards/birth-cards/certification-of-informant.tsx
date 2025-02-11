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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
;
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

interface CertificationOfInformantCardProps {
  informantAddressNcrMode: boolean;
  setInformantAddressNcrMode: (value: boolean) => void;
}

const CertificationOfInformantCard: React.FC<
  CertificationOfInformantCardProps
> = ({ informantAddressNcrMode, setInformantAddressNcrMode }) => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Informant</CardTitle>
      </CardHeader>
      <CardContent>
        <NCRModeSwitch
          isNCRMode={informantAddressNcrMode}
          setIsNCRMode={setInformantAddressNcrMode}
        />
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Signature and Date */}
            <FormField
              control={control}
              name='informant.signature'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Signature'
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
              name='informant.date'
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

            {/* Name and Relationship */}
            <FormField
              control={control}
              name='informant.name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name in Print</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter name'
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
              name='informant.relationship'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to the Child</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter relationship'
                      {...field}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* House Number and Street */}
            <FormField
              control={control}
              name='informant.address.houseNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter house number'
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
              name='informant.address.street'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter street name'
                      {...field}
                      className='h-10'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selector - Spans 2 columns */}
            <LocationSelector
              provinceFieldName='informant.address.province'
              municipalityFieldName='informant.address.cityMunicipality'
              barangayFieldName='informant.address.barangay'
              provinceLabel='Province'
              municipalityLabel='City/Municipality'
              selectTriggerClassName='h-10 px-3 text-base md:text-sm'
              formItemClassName=''
              formLabelClassName=''
              selectContentClassName=''
              selectItemClassName=''
              provincePlaceholder='Select province'
              municipalityPlaceholder='Select city/municipality'
              className='col-span-2 grid grid-cols-2 gap-4'
              isNCRMode={informantAddressNcrMode}
              showBarangay={true}
              barangayLabel='Barangay'
              barangayPlaceholder='Select barangay'
            />

            {/* Country */}
            <FormField
              control={control}
              name='informant.address.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter country'
                      {...field}
                      className='h-10'
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
  );
};

export default CertificationOfInformantCard;
