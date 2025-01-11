// src/lib/utils/location-helpers.ts
import { REGIONS } from '@/lib/constants/locations';

interface Province {
  id: string;
  name: string;
  regionId: string;
  originalProvinceId: string;
}

// Function to get all provinces with unique IDs
export function getAllProvinces(): Province[] {
  return REGIONS.flatMap((region) =>
    region.provinces.map((province) => ({
      id: `${region.id}-${province.id}`,
      name: province.name,
      regionId: region.id,
      originalProvinceId: province.id,
    }))
  ).sort((a, b) => a.name.localeCompare(b.name));
}

// Function to get cities/municipalities by province ID
export function getCitiesMunicipalities(selectedProvinceId: string): string[] {
  if (!selectedProvinceId) return [];

  const [regionId, provinceId] = selectedProvinceId.split('-province-');
  const region = REGIONS.find((region) => region.id === regionId);
  const province = region?.provinces.find(
    (province) => province.id === `province-${provinceId}`
  );

  return (
    province?.citiesMunicipalities.slice().sort((a, b) => a.localeCompare(b)) ||
    []
  );
}

// Your existing functions
export function getProvincesByRegion(regionId: string) {
  const region = REGIONS.find((region) => region.id === regionId);
  return region ? region.provinces : [];
}

export function getCitiesByProvince(regionId: string, provinceId: string) {
  const region = REGIONS.find((region) => region.id === regionId);
  if (!region) return [];

  const province = region.provinces.find(
    (province) => province.id === provinceId
  );
  return province ? province.citiesMunicipalities : [];
}
