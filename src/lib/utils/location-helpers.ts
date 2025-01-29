// src/lib/utils/location-helpers.ts
import { REGIONS } from '@/lib/constants/locations';

type Region =
  | {
      id: string;
      name: string;
      provinces: null;
      citiesMunicipalities: {
        name: string;
        barangays: string[];
      }[];
    }
  | {
      id: string;
      name: string;
      provinces: {
        id: string;
        name: string;
        citiesMunicipalities: {
          name: string;
          barangays: string[];
        }[];
      }[];
    };

type Province = {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  citiesMunicipalities: {
    name: string;
    barangays: string[];
  }[];
};

type CityMunicipality = {
  name: string;
  barangays: string[];
  provinceId?: string;
  provinceName?: string;
  regionId: string;
  regionName: string;
};

export function getAllProvinces(): Province[] {
  const provinces: Province[] = [];

  REGIONS.forEach((region) => {
    if (region.provinces) {
      // Process regions that have provinces
      region.provinces.forEach((province) => {
        provinces.push({
          id: `${region.id}-${province.id}`, // Unique province ID
          name: province.name,
          regionId: region.id,
          regionName: region.name,
          citiesMunicipalities: province.citiesMunicipalities,
        });
      });
    } else if (region.id === 'region-1') {
      // Special handling for NCR (region-1)
      const provinceId = region.id;
      const provinceName = region.name;

      provinces.push({
        id: provinceId,
        name: provinceName,
        regionId: region.id,
        regionName: region.name,
        citiesMunicipalities: region.citiesMunicipalities,
      });
    }
  });

  // Sort provinces alphabetically by name
  return provinces.sort((a, b) => a.name.localeCompare(b.name));
}

// Get cities/municipalities by province ID, sorted alphabetically
export function getCitiesAndMunicipalitiesByProvinceId(
  provinceId: string
): CityMunicipality[] {
  const province = getAllProvinces().find((p) => p.id === provinceId);
  if (!province) return [];

  const cities = province.citiesMunicipalities.map((city) => ({
    name: city.name,
    barangays: city.barangays,
    provinceId: province.id,
    provinceName: province.name,
    regionId: province.regionId,
    regionName: province.regionName,
  }));

  // Sort cities/municipalities alphabetically by name
  return cities.sort((a, b) => a.name.localeCompare(b.name));
}
