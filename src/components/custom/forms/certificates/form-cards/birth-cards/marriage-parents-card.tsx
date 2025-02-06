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
import React from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

interface MarriageOfParentsCardProps {
  parentMarriagePlaceNcrMode: boolean;
  setParentMarriagePlaceNcrMode: (value: boolean) => void;
}

const MarriageOfParentsCard: React.FC<MarriageOfParentsCardProps> = ({
  parentMarriagePlaceNcrMode,
  setParentMarriagePlaceNcrMode,
}) => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marriage of Parents</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Marriage Date Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Date of Marriage</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='parentMarriage.date'
              render={({ field }) => (
                <DatePickerField
                  field={{
                    value: field.value,
                    onChange: field.onChange,
                  }}
                  label='Marriage Date'
                  placeholder='Select marriage date'
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Marriage Place Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Place of Marriage</h3>
          </CardHeader>
          <CardContent>
            <NCRModeSwitch
              isNCRMode={parentMarriagePlaceNcrMode}
              setIsNCRMode={setParentMarriagePlaceNcrMode}
            />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <LocationSelector
                provinceFieldName='parentMarriage.place.province'
                municipalityFieldName='parentMarriage.place.cityMunicipality'
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
                isNCRMode={parentMarriagePlaceNcrMode}
              />

              <FormField
                control={control}
                name='parentMarriage.place.country'
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
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MarriageOfParentsCard;
