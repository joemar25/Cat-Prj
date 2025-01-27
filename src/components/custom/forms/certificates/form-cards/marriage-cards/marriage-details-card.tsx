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
import { REGIONS } from '@/lib/constants/locations';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const MarriageDetailsCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  // Get all provinces from all regions and sort alphabetically
  const getAllProvinces = () => {
    return REGIONS.flatMap((region) =>
      region.provinces.map((province) => ({
        id: `${region.id}-${province.id}`,
        name: province.name,
        regionId: region.id,
        originalProvinceId: province.id,
      }))
    ).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  };

  const allProvinces = getAllProvinces();

  const getCitiesMunicipalities = (selectedProvinceId: string) => {
    if (!selectedProvinceId) return [];

    const [regionId, provinceId] = selectedProvinceId.split('-province-');
    const region = REGIONS.find((region) => region.id === regionId);
    const province = region?.provinces.find(
      (province) => province.id === `province-${provinceId}`
    );

    // Return sorted cities/municipalities
    return (
      province?.citiesMunicipalities
        .slice()
        .sort((a, b) => a.localeCompare(b)) || []
    );
  };

  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Marriage Details</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Place of Marriage */}
          <FormField
            control={control}
            name='placeOfMarriage.office'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Marriage</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter office/church/mosque name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province */}
          <FormField
            control={control}
            name='placeOfMarriage.province'
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
                    allProvinces.find((p) => p.name === field.value)?.id || ''
                  }
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
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

          {/* City/Municipality */}
          <FormField
            control={control}
            name='placeOfMarriage.cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  disabled={!selectedProvince}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
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

          {/* Date of Marriage */}
          <FormField
            control={control}
            name='dateOfMarriage'
            render={({ field }) => (
              <DatePickerField field={field} label='Date of Marriage' />
            )}
          />

          {/* Time of Marriage */}
          <FormField
            control={control}
            name='timeOfMarriage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Marriage</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    type='time'
                    placeholder='Enter time of marriage'
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
  );
};

export default MarriageDetailsCard;
