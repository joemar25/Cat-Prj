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
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  getAllProvinces,
  getCitiesAndMunicipalitiesByProvinceId,
} from '@/lib/utils/location-helpers';

interface LocationSelectorProps {
  provinceFieldName?: string;
  municipalityFieldName?: string;
  provinceLabel?: string;
  municipalityLabel?: string;
  isNCRMode?: boolean;
  className?: string;
  provincePlaceholder?: string;
  municipalityPlaceholder?: string;
  onProvinceChange?: (province: string) => void;
  onMunicipalityChange?: (municipality: string) => void;
  // Style customization props
  selectTriggerClassName?: string;
  formItemClassName?: string;
  formLabelClassName?: string;
  selectContentClassName?: string;
  selectItemClassName?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  provinceFieldName = 'province',
  municipalityFieldName = 'cityMunicipality',
  provinceLabel = 'Province',
  municipalityLabel = 'City/Municipality',
  isNCRMode = false,
  className = '',
  provincePlaceholder = 'Select province',
  municipalityPlaceholder = 'Select city/municipality',
  onProvinceChange,
  onMunicipalityChange,
  // Style props with defaults
  selectTriggerClassName = 'h-10',
  formItemClassName = '',
  formLabelClassName = '',
  selectContentClassName = '',
  selectItemClassName = '',
}) => {
  const { control, setValue } = useFormContext();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  const provinces = getAllProvinces();
  const municipalities = selectedProvince
    ? getCitiesAndMunicipalitiesByProvinceId(selectedProvince)
    : [];

  useEffect(() => {
    if (isNCRMode) {
      const ncrProvinceId = 'region-1';
      setSelectedProvince(ncrProvinceId);
      setValue(provinceFieldName, 'N/A');
    } else {
      setSelectedProvince('');
      setSelectedMunicipality('');
      setValue(provinceFieldName, '');
      setValue(municipalityFieldName, '');
    }
  }, [isNCRMode, provinceFieldName, municipalityFieldName, setValue]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedMunicipality('');

    const selectedProvinceName =
      provinces.find((p) => p.id === value)?.name || '';
    setValue(provinceFieldName, selectedProvinceName);
    setValue(municipalityFieldName, '');

    onProvinceChange?.(selectedProvinceName);
  };

  const handleMunicipalityChange = (value: string) => {
    setSelectedMunicipality(value);
    setValue(municipalityFieldName, value);
    onMunicipalityChange?.(value);
  };

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
                  <SelectItem
                    key={city.name}
                    value={city.name}
                    className={selectItemClassName}
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LocationSelector;
