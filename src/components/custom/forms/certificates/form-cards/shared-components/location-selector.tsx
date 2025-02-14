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

  // For NCR mode, define a static province with proper keys.
  const provinceOptions = isNCRMode
    ? [
        {
          psgc_id: 'metro-manila',
          name: 'Metro Manila',
          geographic_level: 'Region',
        },
      ]
    : provinces;

  // Styling classes for select triggers.
  const selectTriggerClasses =
    'h-10 px-3 text-base md:text-sm rounded-md border border-input bg-background text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800';

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
                  field.onChange(value);
                  handleProvinceChange(value);
                  trigger(provinceFieldName);
                }}
                disabled={isNCRMode}
              >
                <SelectTrigger ref={field.ref} className={selectTriggerClasses}>
                  <SelectValue
                    placeholder={
                      isNCRMode ? 'Metro Manila' : provincePlaceholder
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provinceOptions.map((prov) => (
                    <SelectItem key={prov.psgc_id} value={prov.psgc_id}>
                      {isNCRMode ? 'Metro Manila' : prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
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
                <SelectTrigger ref={field.ref} className={selectTriggerClasses}>
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
                  <SelectTrigger
                    ref={field.ref}
                    className={selectTriggerClasses}
                  >
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
