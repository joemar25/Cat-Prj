import {
  BARANGAYS,
  CITIES,
  MUNICIPALITIES,
  PROVINCES,
} from '../constants/locations';

export interface Province {
  id: string;
  name: string;
  regionName: string;
}

interface LocationBase {
  id: string;
  name: string;
  regionName: string;
  provinceName: string | null;
}

interface City extends LocationBase {
  subMunicipalities: string[];
  municipalities: string[];
}

interface Municipality extends LocationBase {
  cityName: string | null;
  subMunicipalities: string[];
  barangays: string[];
}

export interface Barangay extends LocationBase {
  cityName: string | null;
  municipalityName: string | null;
}

export interface LocationSuggestion {
  id: string;
  displayName: string;
  region: string;
  province: string | null;
  city?: string | null;
  municipality?: string | null;
  type: 'city' | 'municipality' | 'subMunicipality';
}

function generateId(parts: (string | null)[]): string {
  return parts
    .filter((part) => part !== null)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function getAllProvinces(): Province[] {
  return PROVINCES.map((province) => ({
    id: generateId([province.region, province.name]),
    name: province.name,
    regionName: province.region,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllLocations(): (City | Municipality)[] {
  const locations: (City | Municipality)[] = [];
  CITIES.forEach((city) => {
    locations.push({
      id: generateId([city.region, city.province, city.name]),
      name: city.name,
      regionName: city.region,
      provinceName: city.province,
      subMunicipalities: city.subMunicipalities,
      municipalities: city.municipalities,
    });
  });
  MUNICIPALITIES.forEach((mun) => {
    if (
      !locations.some(
        (loc) => loc.name === mun.name && loc.provinceName === mun.province
      )
    ) {
      locations.push({
        id: generateId([mun.region, mun.province, mun.city, mun.name]),
        name: mun.name,
        regionName: mun.region,
        provinceName: mun.province,
        cityName: mun.city,
        subMunicipalities: mun.subMunicipalities,
        barangays: mun.barangays,
      });
    }
  });
  return locations.sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocationsByProvince(
  provinceId: string,
  isNCRMode: boolean = false
): (City | Municipality)[] {
  if (isNCRMode) {
    return getAllLocations().filter(
      (location) => location.regionName === 'NATIONAL CAPITAL REGION (NCR)'
    );
  }
  const province = getAllProvinces().find((p) => p.id === provinceId);
  if (!province) return [];
  return getAllLocations().filter(
    (location) => location.provinceName === province.name
  );
}

export function getBarangaysByLocation(locationId: string): Barangay[] {
  const location = getAllLocations().find((loc) => loc.id === locationId);
  if (!location) return [];
  return BARANGAYS.filter((barangay) => {
    if ('municipalities' in location) {
      return barangay.city === location.name;
    } else {
      return barangay.municipality === location.name;
    }
  })
    .map((barangay) => ({
      id: generateId([
        barangay.region,
        barangay.province,
        barangay.city,
        barangay.municipality,
        barangay.name,
      ]),
      name: barangay.name,
      regionName: barangay.region,
      provinceName: barangay.province,
      cityName: barangay.city,
      municipalityName: barangay.municipality,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBarangaysBySubMunicipality(
  locationId: string,
  subMunicipalityName: string
): Barangay[] {
  const location = getAllLocations().find((loc) => loc.id === locationId);
  if (!location) return [];
  return BARANGAYS.filter((barangay) => {
    if ('municipalities' in location) {
      return (
        barangay.city === location.name &&
        location.subMunicipalities.includes(subMunicipalityName)
      );
    } else {
      return (
        barangay.municipality === location.name &&
        location.subMunicipalities.includes(subMunicipalityName)
      );
    }
  })
    .map((barangay) => ({
      id: generateId([
        barangay.region,
        barangay.province,
        barangay.city,
        barangay.municipality,
        barangay.name,
      ]),
      name: barangay.name,
      regionName: barangay.region,
      provinceName: barangay.province,
      cityName: barangay.city,
      municipalityName: barangay.municipality,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCombinedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean = false
): LocationSuggestion[] {
  const suggestions: LocationSuggestion[] = [];
  const provinceObj = getAllProvinces().find((p) => p.id === provinceId);
  const modePrefix = isNCRMode ? 'ncr' : 'non-ncr';
  CITIES.forEach((city) => {
    if (!isNCRMode && provinceObj && city.province !== provinceObj.name) return;
    if (isNCRMode && city.region !== 'NATIONAL CAPITAL REGION (NCR)') return;
    const cityId = generateId([city.region, city.province, city.name]);
    suggestions.push({
      id: `${modePrefix}-city-${cityId}`,
      displayName: city.name,
      region: city.region,
      province: city.province,
      city: city.name,
      municipality: null,
      type: 'city',
    });
    city.subMunicipalities.forEach((sub) => {
      const subId = generateId([city.region, city.province, city.name, sub]);
      suggestions.push({
        id: `${modePrefix}-sub-${subId}`,
        displayName: `${sub} (${city.name})`,
        region: city.region,
        province: city.province,
        city: city.name,
        municipality: null,
        type: 'subMunicipality',
      });
    });
    city.municipalities.forEach((munName) => {
      const munId = generateId([
        city.region,
        city.province,
        city.name,
        munName,
      ]);
      suggestions.push({
        id: `${modePrefix}-mun-${munId}`,
        displayName: munName,
        region: city.region,
        province: city.province,
        city: city.name,
        municipality: munName,
        type: 'municipality',
      });
    });
  });
  MUNICIPALITIES.forEach((mun) => {
    if (!isNCRMode && provinceObj && mun.province !== provinceObj.name) return;
    if (isNCRMode && mun.region !== 'NATIONAL CAPITAL REGION (NCR)') return;
    if (!mun.city) {
      const munId = generateId([mun.region, mun.province, mun.name]);
      suggestions.push({
        id: `${modePrefix}-mun-${munId}`,
        displayName: mun.name,
        region: mun.region,
        province: mun.province,
        city: null,
        municipality: mun.name,
        type: 'municipality',
      });
    }
    mun.subMunicipalities.forEach((sub) => {
      const subId = generateId([mun.region, mun.province, mun.name, sub]);
      suggestions.push({
        id: `${modePrefix}-sub-${subId}`,
        displayName: `${sub} (${mun.name})`,
        region: mun.region,
        province: mun.province,
        city: mun.city || null,
        municipality: mun.name,
        type: 'subMunicipality',
      });
    });
  });
  suggestions.sort((a, b) => a.displayName.localeCompare(b.displayName));
  const seen = new Set<string>();
  const uniqueSuggestions = suggestions.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  return uniqueSuggestions;
}

const suggestionCache: { [key: string]: LocationSuggestion[] } = {};

export function getCachedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean
): LocationSuggestion[] {
  const cacheKey = `${provinceId}-${isNCRMode ? 'ncr' : 'non-ncr'}`;
  if (suggestionCache[cacheKey]) {
    return suggestionCache[cacheKey];
  }
  const suggestions = getCombinedCitySuggestions(provinceId, isNCRMode);
  suggestionCache[cacheKey] = suggestions;
  return suggestions;
}

export function formatAddress(address: {
  houseNumber?: string;
  street?: string;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
  country?: string;
  region?: string;
}) {
  let region = address.region || '';
  const provinces = getAllProvinces();
  if (address.province) {
    const prov = provinces.find(
      (p) => p.name.toLowerCase() === address.province!.toLowerCase()
    );
    if (prov) {
      region = prov.regionName;
    }
  }
  return {
    houseNo: address.houseNumber || '',
    street: address.street || '',
    barangay: address.barangay || '',
    cityMunicipality: address.cityMunicipality || '',
    province: address.province || '',
    region,
    country: address.country || '',
  };
}
