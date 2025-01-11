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
import { REGIONS } from '@/lib/constants/locations';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const RegistryInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  const [selectedProvince, setSelectedProvince] = useState('');

  // Get all provinces from all regions with unique IDs and sort alphabetically
  const getAllProvinces = () => {
    return REGIONS.flatMap((region) =>
      region.provinces.map((province) => ({
        id: `${region.id}-${province.id}`,
        name: province.name,
        regionId: region.id,
        originalProvinceId: province.id,
      }))
    ).sort((a, b) => a.name.localeCompare(b.name)); // Sort provinces alphabetically
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
        <CardTitle>Registry Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Registry Number */}
          <FormField
            control={control}
            name='registryNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registry No.</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter registry number'
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
            name='province'
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
            name='cityMunicipality'
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistryInfoCard;
