// src/lib/utils/location-helpers.ts

import { REGIONS } from '../constants/locations';
import { CityMunicipality, Province } from '../types/location-selector';

export function getAllProvinces(): Province[] {
  const provinces: Province[] = [];

  REGIONS.forEach((region) => {
    if (region.provinces) {
      // Process regions that have provinces
      region.provinces.forEach((province) => {
        provinces.push({
          id: `${region.id}-${province.id}`,
          name: province.name,
          regionId: region.id,
          regionName: region.name,
          citiesMunicipalities: province.citiesMunicipalities,
        });
      });
    } else if (region.id === 'region-1') {
      // Special handling for NCR (region-1)
      provinces.push({
        id: region.id,
        name: region.name,
        regionId: region.id,
        regionName: region.name,
        citiesMunicipalities: region.citiesMunicipalities,
      });
    }
  });

  return provinces.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCitiesAndMunicipalitiesByProvinceId(
  provinceId: string
): CityMunicipality[] {
  const province = getAllProvinces().find((p) => p.id === provinceId);
  if (!province) return [];

  const cities = province.citiesMunicipalities.map((city) => {
    const baseCity = {
      name: city.name,
      provinceId: province.id,
      provinceName: province.name,
      regionId: province.regionId,
      regionName: province.regionName,
    };

    // Check if city has subMunicipalities property and it's an array with items
    if (
      'subMunicipalities' in city &&
      Array.isArray(city.subMunicipalities) &&
      city.subMunicipalities.length > 0
    ) {
      return {
        ...baseCity,
        barangays: [],
        subMunicipalities: city.subMunicipalities,
      };
    }

    // For cities with direct barangays
    return {
      ...baseCity,
      barangays: 'barangays' in city ? city.barangays : [],
      subMunicipalities: undefined,
    };
  });

  return cities.sort((a, b) => a.name.localeCompare(b.name));
}
