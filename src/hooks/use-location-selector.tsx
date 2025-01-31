// hooks/useLocationSelector.ts
import {
  getAllProvinces,
  getCitiesAndMunicipalitiesByProvinceId,
} from '@/lib/utils/location-helpers';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface UseLocationSelectorProps {
  provinceFieldName: string;
  municipalityFieldName: string;
  barangayFieldName?: string;
  isNCRMode: boolean;
  showBarangay?: boolean;
  setValue: UseFormSetValue<any>;
  onProvinceChange?: (province: string) => void;
  onMunicipalityChange?: (municipality: string) => void;
  onBarangayChange?: (barangay: string) => void;
}

interface UseLocationSelectorReturn {
  selectedProvince: string;
  selectedMunicipality: string;
  selectedBarangay: string;
  hoveredCity: string | null;
  provinces: Array<{ id: string; name: string }>;
  municipalities: Array<{
    name: string;
    subMunicipalities?: Array<{ name: string }>;
  }>;
  barangays: string[];
  handleProvinceChange: (value: string) => void;
  handleMunicipalityChange: (value: string) => void;
  handleBarangayChange: (value: string) => void;
  setHoveredCity: (city: string | null) => void;
}
export const useLocationSelector = ({
  provinceFieldName,
  municipalityFieldName,
  barangayFieldName,
  isNCRMode,
  showBarangay,
  setValue,
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
}: UseLocationSelectorProps): UseLocationSelectorReturn => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const provinces = getAllProvinces();
  const municipalities = selectedProvince
    ? getCitiesAndMunicipalitiesByProvinceId(selectedProvince)
    : [];

  const getBarangays = () => {
    // For cities with sub-municipalities (like Manila)
    if (selectedMunicipality.includes(', ')) {
      const [subMunicipalityName, cityName] = selectedMunicipality.split(', ');
      const municipality = municipalities.find((m) => m.name === cityName);
      if (!municipality) return [];

      const subMunicipality = municipality.subMunicipalities?.find(
        (sm) => sm.name === subMunicipalityName
      );
      return subMunicipality?.barangays || [];
    }

    // For cities with direct barangays (like Las Piñas)
    const municipality = municipalities.find(
      (m) => m.name === selectedMunicipality
    );
    if (!municipality) return [];

    return municipality.barangays || [];
  };

  const barangays = selectedMunicipality ? getBarangays() : [];

  useEffect(() => {
    if (isNCRMode) {
      const ncrProvinceId = 'region-1';
      setSelectedProvince(ncrProvinceId);
      setValue(provinceFieldName, 'Metro Manila');
      setValue(municipalityFieldName, '');
      if (barangayFieldName) setValue(barangayFieldName, '');
      setSelectedMunicipality('');
      setSelectedBarangay('');
    } else {
      setSelectedProvince('');
      setSelectedMunicipality('');
      setSelectedBarangay('');
      setValue(provinceFieldName, '');
      setValue(municipalityFieldName, '');
      if (barangayFieldName) setValue(barangayFieldName, '');
    }
  }, [
    isNCRMode,
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    setValue,
  ]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedMunicipality('');
    setSelectedBarangay('');

    const selectedProvinceName =
      provinces.find((p) => p.id === value)?.name || '';
    setValue(provinceFieldName, selectedProvinceName);
    setValue(municipalityFieldName, '');
    if (barangayFieldName) setValue(barangayFieldName, '');

    onProvinceChange?.(selectedProvinceName);
  };

  const handleMunicipalityChange = (value: string) => {
    setSelectedMunicipality(value);
    setSelectedBarangay('');
    setValue(municipalityFieldName, value);
    if (barangayFieldName) setValue(barangayFieldName, '');
    onMunicipalityChange?.(value);
  };

  const handleBarangayChange = (value: string) => {
    setSelectedBarangay(value);
    if (barangayFieldName) setValue(barangayFieldName, value);
    onBarangayChange?.(value);
  };

  return {
    selectedProvince,
    selectedMunicipality,
    selectedBarangay,
    hoveredCity,
    provinces,
    municipalities,
    barangays,
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
    setHoveredCity,
  };
};
