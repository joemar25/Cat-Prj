import {
  Barangay,
  getAllProvinces,
  getBarangaysByLocation,
  getBarangaysBySubMunicipality,
  getCachedCitySuggestions,
  LocationSuggestion,
  Province,
} from '@/lib/utils/location-helpers';
import { useEffect, useMemo, useState } from 'react';
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
  trigger?: (name: string | string[]) => Promise<boolean>;
}

const NCR_PROVINCE_ID = 'metro-manila';
const NCR_PROVINCE_DISPLAY = 'Metro Manila';

export const useLocationSelector = ({
  provinceFieldName,
  municipalityFieldName,
  barangayFieldName,
  isNCRMode,
  setValue,
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  trigger,
}: UseLocationSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string>(
    isNCRMode ? NCR_PROVINCE_ID : ''
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedBarangay, setSelectedBarangay] = useState<string>('');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const provinces: Province[] = useMemo(() => {
    const allProvinces = getAllProvinces();
    return isNCRMode
      ? allProvinces.filter(
          (p) => p.regionName === 'NATIONAL CAPITAL REGION (NCR)'
        )
      : allProvinces;
  }, [isNCRMode]);

  const municipalities: LocationSuggestion[] = useMemo(() => {
    if (!selectedProvince) return [];
    return getCachedCitySuggestions(selectedProvince, isNCRMode);
  }, [selectedProvince, isNCRMode]);

  const barangays = useMemo((): { id: string; name: string }[] => {
    if (!selectedMunicipality) return [];
    if (selectedMunicipality.includes(', ')) {
      const [subMun, locationName] = selectedMunicipality.split(', ');
      const result: Barangay[] = getBarangaysBySubMunicipality(
        `${selectedProvince}-${locationName}`.toLowerCase(),
        subMun
      );
      return result.map((barangay) => ({
        id: barangay.id,
        name: barangay.name,
      }));
    }
    const result: Barangay[] = getBarangaysByLocation(
      `${selectedProvince}-${selectedMunicipality}`.toLowerCase()
    );
    return result.map((barangay) => ({ id: barangay.id, name: barangay.name }));
  }, [selectedProvince, selectedMunicipality]);

  useEffect(() => {
    if (isNCRMode) {
      setSelectedProvince(NCR_PROVINCE_ID);
      setValue(provinceFieldName, NCR_PROVINCE_DISPLAY);
    } else {
      setSelectedProvince('');
      setValue(provinceFieldName, '');
    }
    setSelectedMunicipality('');
    setSelectedBarangay('');
    setValue(municipalityFieldName, '');
    if (barangayFieldName) setValue(barangayFieldName, '');
  }, [
    isNCRMode,
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    setValue,
  ]);

  const handleProvinceChange = async (value: string) => {
    if (value === selectedProvince) return;
    setSelectedProvince(value);
    setSelectedMunicipality('');
    setSelectedBarangay('');
    const selectedProvinceName = isNCRMode
      ? NCR_PROVINCE_DISPLAY
      : provinces.find((p) => p.id === value)?.name || '';
    setValue(provinceFieldName, selectedProvinceName);
    setValue(municipalityFieldName, '');
    if (barangayFieldName) setValue(barangayFieldName, '');
    if (trigger) {
      await trigger(provinceFieldName);
      await trigger(municipalityFieldName);
    }
    onProvinceChange?.(selectedProvinceName);
  };

  const handleMunicipalityChange = async (value: string) => {
    if (value === selectedMunicipality) return;
    const selectedSuggestion = municipalities.find((s) => s.id === value);
    if (!selectedSuggestion) return;
    setSelectedMunicipality(selectedSuggestion.id);
    setSelectedBarangay('');
    setValue(municipalityFieldName, selectedSuggestion.displayName);
    if (barangayFieldName) setValue(barangayFieldName, '');
    if (trigger) {
      await trigger(municipalityFieldName);
    }
    onMunicipalityChange?.(selectedSuggestion.displayName);
  };

  const handleBarangayChange = async (value: string) => {
    if (value === selectedBarangay) return;
    setSelectedBarangay(value);
    if (barangayFieldName) setValue(barangayFieldName, value);
    if (trigger && barangayFieldName) {
      await trigger(barangayFieldName);
    }
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
