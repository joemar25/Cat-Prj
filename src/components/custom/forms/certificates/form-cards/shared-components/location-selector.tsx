'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocationSelector } from '@/hooks/use-location-selector';
import { LocationSelectorProps } from '@/lib/types/location-selector';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  provinceFieldName = 'province',
  municipalityFieldName = 'cityMunicipality',
  barangayFieldName = 'barangay',
  provinceLabel = 'Province',
  municipalityLabel = 'City/Municipality',
  barangayLabel = 'Barangay',
  isNCRMode = false,
  showBarangay = false,
  provincePlaceholder = 'Select a province...',
  municipalityPlaceholder = 'Select a city/municipality...',
  barangayPlaceholder = 'Select a barangay...',
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  formItemClassName = '',
  formLabelClassName = '',
}) => {
  const {
    control,
    setValue,
    trigger,
    formState: { isSubmitted },
  } = useFormContext();

  const {
    selectedProvince,
    selectedMunicipality,
    selectedBarangay,
    provinces,
    municipalities,
    barangays,
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
  } = useLocationSelector({
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    isNCRMode,
    showBarangay,
    setValue,
    onProvinceChange,
    onMunicipalityChange,
    onBarangayChange,
  });

  const provinceOptions = isNCRMode
    ? [
        {
          id: 'metro-manila',
          name: 'Metro Manila',
          regionName: 'NATIONAL CAPITAL REGION (NCR)',
        },
      ]
    : provinces;

  return (
    <>
      {/* Province/Region Field */}
      <FormField
        control={control}
        name={provinceFieldName}
        render={({ field, fieldState }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={formLabelClassName}>
              {isNCRMode ? 'Region' : provinceLabel}
            </FormLabel>
            <FormControl>
              <Select
                value={selectedProvince}
                onValueChange={(value: string) => {
                  // Update react-hook-form state and custom state
                  field.onChange(value);
                  handleProvinceChange(value);
                  // Force immediate revalidation
                  trigger(provinceFieldName);
                }}
                disabled={isNCRMode}
              >
                <SelectTrigger className='text-sm dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'>
                  <SelectValue
                    placeholder={
                      isNCRMode ? 'Metro Manila' : provincePlaceholder
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provinceOptions.map((prov) => (
                    <SelectItem key={prov.id} value={prov.id}>
                      {isNCRMode ? 'Metro Manila' : prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {/* Render error message unconditionally */}
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Municipality/City Field */}
      <FormField
        control={control}
        name={municipalityFieldName}
        render={({ field, fieldState }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={formLabelClassName}>
              {municipalityLabel}
            </FormLabel>
            <FormControl>
              <Select
                value={selectedMunicipality}
                onValueChange={(value: string) => {
                  field.onChange(value);
                  handleMunicipalityChange(value);
                  trigger(municipalityFieldName);
                }}
                disabled={!selectedProvince}
              >
                <SelectTrigger className='text-sm dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'>
                  <SelectValue placeholder={municipalityPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map((mun) => (
                    <SelectItem key={mun.id} value={mun.id}>
                      {mun.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Barangay Field (if applicable) */}
      {showBarangay && (
        <FormField
          control={control}
          name={barangayFieldName}
          render={({ field, fieldState }) => (
            <FormItem className={formItemClassName}>
              <FormLabel className={formLabelClassName}>
                {barangayLabel}
              </FormLabel>
              <FormControl>
                <Select
                  value={selectedBarangay}
                  onValueChange={(value: string) => {
                    field.onChange(value);
                    handleBarangayChange(value);
                    trigger(barangayFieldName);
                  }}
                  disabled={!selectedMunicipality}
                >
                  <SelectTrigger className='text-sm dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'>
                    <SelectValue placeholder={barangayPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays.map((bar) => (
                      <SelectItem key={bar.id} value={bar.name}>
                        {bar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default LocationSelector;
