import {
  BARANGAYS,
  CITIES,
  MUNICIPALITIES,
  PROVINCES,
} from '../constants/locations';

/* =======================================================================
   TypeScript interfaces
======================================================================== */

// For province suggestions (and for internal use)
export interface Province {
  id: string;
  name: string;
  regionName: string;
}

// A basic location record with common properties.
interface LocationBase {
  id: string;
  name: string;
  regionName: string;
  provinceName: string | null;
}

// Interfaces for city/municipality records (used in getAllLocations below)
interface City extends LocationBase {
  subMunicipalities: string[];
  municipalities: string[];
}

interface Municipality extends LocationBase {
  cityName: string | null;
  subMunicipalities: string[];
  barangays: string[];
}

// For barangays:
export interface Barangay extends LocationBase {
  cityName: string | null;
  municipalityName: string | null;
}

/* =======================================================================
   New Combined Suggestion Interface
======================================================================== */

/**
 * This interface represents a flattened location suggestion used for
 * city/municipality/sub‑municipality selection.
 */
export interface LocationSuggestion {
  id: string;
  displayName: string;
  region: string;
  province: string | null;
  // If coming from a City record, city is set.
  // If coming from a Municipality record (or its subMunicipalities), municipality is set.
  city?: string | null;
  municipality?: string | null;
  type: 'city' | 'municipality' | 'subMunicipality';
}

/* =======================================================================
   Helper Function: generateId
======================================================================== */
function generateId(parts: (string | null)[]): string {
  return parts
    .filter((part) => part !== null)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/* =======================================================================
   Basic Helpers: getAllProvinces, getAllLocations, getLocationsByProvince,
   getBarangaysByLocation, getBarangaysBySubMunicipality
======================================================================== */

export function getAllProvinces(): Province[] {
  return PROVINCES.map((province) => ({
    id: generateId([province.region, province.name]),
    name: province.name,
    regionName: province.region,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllLocations(): (City | Municipality)[] {
  const locations: (City | Municipality)[] = [];

  // Add cities
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

  // Add municipalities (avoid duplicates)
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
        // For municipality records, we store cityName if available.
        cityName: mun.city,
        subMunicipalities: mun.subMunicipalities,
        barangays: mun.barangays,
      });
    }
  });

  return locations.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns locations filtered by province.
 * In NCR mode, returns all locations in the NCR regardless of provinceId.
 */
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

/**
 * Returns barangays for a given location.
 */
export function getBarangaysByLocation(locationId: string): Barangay[] {
  const location = getAllLocations().find((loc) => loc.id === locationId);
  if (!location) return [];

  return BARANGAYS.filter((barangay) => {
    if ('municipalities' in location) {
      // For cities
      return barangay.city === location.name;
    } else {
      // For municipalities
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

/**
 * Returns barangays for a given sub-municipality.
 */
export function getBarangaysBySubMunicipality(
  locationId: string,
  subMunicipalityName: string
): Barangay[] {
  const location = getAllLocations().find((loc) => loc.id === locationId);
  if (!location) return [];

  return BARANGAYS.filter((barangay) => {
    if ('municipalities' in location) {
      // For cities
      return (
        barangay.city === location.name &&
        location.subMunicipalities.includes(subMunicipalityName)
      );
    } else {
      // For municipalities
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

/* =======================================================================
   NEW HELPER: Combined City Suggestions
======================================================================== */

/**
 * Combines data from CITIES and MUNICIPALITIES into one flattened list.
 * The suggestions include:
 *  - The city itself (type 'city')
 *  - Each subMunicipality from a City (type 'subMunicipality')
 *  - The municipalities declared in a City (type 'municipality')
 *  - Standalone Municipality records (type 'municipality') plus their subMunicipalities.
 *
 * If not in NCR mode and a provinceId is provided, only suggestions
 * from that province are returned.
 * When in NCR mode, only records from NCR are returned.
 */
export function getCombinedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean = false
): LocationSuggestion[] {
  const suggestions: LocationSuggestion[] = [];

  // Find province object if applicable.
  const provinceObj = getAllProvinces().find((p) => p.id === provinceId);

  // Process CITIES array.
  CITIES.forEach((city) => {
    // Filter by province if not in NCR mode.
    if (!isNCRMode && provinceObj && city.province !== provinceObj.name) return;
    if (isNCRMode && city.region !== 'NATIONAL CAPITAL REGION (NCR)') return;

    // Add the city itself.
    const cityId = generateId([city.region, city.province, city.name]);
    suggestions.push({
      id: cityId,
      displayName: city.name,
      region: city.region,
      province: city.province,
      city: city.name,
      municipality: null,
      type: 'city',
    });

    // Add each subMunicipality as its own suggestion.
    city.subMunicipalities.forEach((sub) => {
      const subId = generateId([city.region, city.province, city.name, sub]);
      suggestions.push({
        id: subId,
        displayName: `${sub} (${city.name})`,
        region: city.region,
        province: city.province,
        city: city.name,
        municipality: null,
        type: 'subMunicipality',
      });
    });

    // Add each municipality name declared on the City.
    city.municipalities.forEach((munName) => {
      const munId = generateId([
        city.region,
        city.province,
        city.name,
        munName,
      ]);
      suggestions.push({
        id: munId,
        displayName: munName,
        region: city.region,
        province: city.province,
        city: city.name,
        municipality: munName,
        type: 'municipality',
      });
    });
  });

  // Process MUNICIPALITIES array.
  MUNICIPALITIES.forEach((mun) => {
    // Filter by province if not in NCR mode.
    if (!isNCRMode && provinceObj && mun.province !== provinceObj.name) return;
    if (isNCRMode && mun.region !== 'NATIONAL CAPITAL REGION (NCR)') return;

    // If there is no associated city, add it as a standalone municipality.
    if (!mun.city) {
      const munId = generateId([mun.region, mun.province, mun.name]);
      suggestions.push({
        id: munId,
        displayName: mun.name,
        region: mun.region,
        province: mun.province,
        city: null,
        municipality: mun.name,
        type: 'municipality',
      });
    }
    // Add subMunicipalities from the municipality record.
    mun.subMunicipalities.forEach((sub) => {
      const subId = generateId([mun.region, mun.province, mun.name, sub]);
      suggestions.push({
        id: subId,
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
  return suggestions;
}
