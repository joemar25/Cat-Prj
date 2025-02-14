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
import { useFormContext, UseFormSetValue } from 'react-hook-form';

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
  const { clearErrors } = useFormContext();
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
      return result.map((b) => ({ id: b.id, name: b.name }));
    }
    const result: Barangay[] = getBarangaysByLocation(
      `${selectedProvince}-${selectedMunicipality}`.toLowerCase()
    );
    return result.map((b) => ({ id: b.id, name: b.name }));
  }, [selectedProvince, selectedMunicipality]);

  useEffect(() => {
    if (isNCRMode) {
      setSelectedProvince(NCR_PROVINCE_ID);
      setValue(provinceFieldName, NCR_PROVINCE_DISPLAY);
      clearErrors(provinceFieldName);
    } else {
      setSelectedProvince('');
      setValue(provinceFieldName, '');
      clearErrors(provinceFieldName);
    }
    setSelectedMunicipality('');
    setSelectedBarangay('');
    setValue(municipalityFieldName, '');
    if (barangayFieldName) {
      setValue(barangayFieldName, '');
    }
    if (trigger) {
      const fieldsToTrigger = [provinceFieldName, municipalityFieldName];
      if (barangayFieldName) {
        fieldsToTrigger.push(barangayFieldName);
      }
      void trigger(fieldsToTrigger);
    }
  }, [
    isNCRMode,
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    setValue,
    trigger,
    clearErrors,
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
    if (barangayFieldName) {
      setValue(barangayFieldName, '');
    }
    if (trigger) {
      const fieldsToTrigger = [provinceFieldName, municipalityFieldName];
      if (barangayFieldName) {
        fieldsToTrigger.push(barangayFieldName);
      }
      await trigger(fieldsToTrigger);
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
    if (barangayFieldName) {
      setValue(barangayFieldName, '');
    }
    if (trigger) {
      const fieldsToTrigger = [municipalityFieldName];
      if (barangayFieldName) {
        fieldsToTrigger.push(barangayFieldName);
      }
      await trigger(fieldsToTrigger);
    }
    onMunicipalityChange?.(selectedSuggestion.displayName);
  };

  const handleBarangayChange = async (value: string) => {
    if (value === selectedBarangay) return;
    setSelectedBarangay(value);
    if (barangayFieldName) {
      setValue(barangayFieldName, value);
    }
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
