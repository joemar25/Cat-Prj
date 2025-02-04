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
  SelectGroup,
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
  className = '',
  provincePlaceholder = 'Select province',
  municipalityPlaceholder = 'Select city/municipality',
  barangayPlaceholder = 'Select barangay',
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  selectTriggerClassName = 'h-10',
  formItemClassName = '',
  formLabelClassName = '',
  selectContentClassName = '',
  selectItemClassName = '',
}) => {
  const { control, setValue, trigger } = useFormContext();

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
    trigger,
  });
  return (
    <>
      <FormField
        control={control}
        name={provinceFieldName}
        render={({ field }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={formLabelClassName}>
              {isNCRMode ? 'Region' : provinceLabel}
            </FormLabel>
            <Select
              onValueChange={handleProvinceChange}
              value={selectedProvince}
              disabled={isNCRMode}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue
                    placeholder={isNCRMode ? 'N/A' : provincePlaceholder}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={selectContentClassName}>
                {provinces.map((province) => (
                  <SelectItem
                    key={province.id}
                    value={province.id}
                    className={selectItemClassName}
                  >
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
        name={municipalityFieldName}
        render={({ field }) => (
          <FormItem className={formItemClassName}>
            <FormLabel className={formLabelClassName}>
              {municipalityLabel}
            </FormLabel>
            <Select
              onValueChange={handleMunicipalityChange}
              value={selectedMunicipality}
              disabled={!selectedProvince && !isNCRMode}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue
                    placeholder={
                      isNCRMode
                        ? 'Select NCR city'
                        : selectedProvince
                        ? municipalityPlaceholder
                        : 'Select province first'
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={selectContentClassName}>
                {municipalities.map((city) => (
                  <SelectGroup key={`group-${city.name}`}>
                    {isNCRMode &&
                    city.subMunicipalities &&
                    city.subMunicipalities.length > 0 ? (
                      city.subMunicipalities.map((subMunicipality) => (
                        <SelectItem
                          key={`${city.name}-${subMunicipality.name}`}
                          value={`${subMunicipality.name}, ${city.name}`}
                          className={selectItemClassName}
                        >
                          {`${subMunicipality.name} (${city.name})`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        key={`city-${city.name}`}
                        value={city.name}
                        className={selectItemClassName}
                      >
                        {city.name}
                      </SelectItem>
                    )}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {showBarangay && (
        <FormField
          control={control}
          name={barangayFieldName}
          render={({ field }) => (
            <FormItem className={formItemClassName}>
              <FormLabel className={formLabelClassName}>
                {barangayLabel}
              </FormLabel>
              <Select
                onValueChange={handleBarangayChange}
                value={selectedBarangay}
                disabled={!selectedMunicipality}
              >
                <FormControl>
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue
                      placeholder={
                        selectedMunicipality
                          ? barangayPlaceholder
                          : 'Select city/municipality first'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClassName}>
                  {barangays.map((barangay) => (
                    <SelectItem
                      key={barangay}
                      value={barangay}
                      className={selectItemClassName}
                    >
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default LocationSelector;
