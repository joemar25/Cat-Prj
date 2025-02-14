// Import JSON files directly
import barangaysData from '@/lib/jsons/barangays.json';
import citiesMunicipalitiesData from '@/lib/jsons/cities_municipalities.json';
import ncrDataFile from '@/lib/jsons/ncr_data.json';
import provincesData from '@/lib/jsons/provinces.json';

/**
 * Updated interfaces to match the PHP extractor output.
 */
export interface NCRRegion {
  psgc_id: string;
  name: string;
  correspondence_code: string;
  geographic_level: string;
  old_names: string;
  city_class: string;
  income_classification: string;
  urban_rural: string;
  population: string;
  status: string;
}

export interface NCRLocation {
  psgc_id: string;
  name: string;
  correspondence_code: string;
  geographic_level: string;
}

export interface NCRData {
  region: NCRRegion;
  cities: NCRLocation[];
}

export interface Province {
  psgc_id: string;
  name: string;
  geographic_level: string;
}

export interface City {
  psgc_id: string;
  name: string;
  geographic_level: string;
}

export interface Barangay {
  psgc_id: string;
  name: string;
  geographic_level: string;
  old_names: string | null;
}

export interface LocationSuggestion {
  id: string;
  displayName: string;
  psgc_id: string;
  type: 'city' | 'municipality' | 'subMunicipality';
}

// Cast the imported data to their proper types
const provinces = provincesData as Province[];
const citiesMunicipalities = citiesMunicipalitiesData as City[];
const barangays = barangaysData as Barangay[];
const ncrData = ncrDataFile as NCRData;

// Get all provinces sorted by name
export function getAllProvinces(): Province[] {
  return provinces.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns city/municipality suggestions based on the selected province.
 * For NCR mode, it uses the NCR data file; for non‑NCR provinces,
 * it filters the cities/municipalities based on a matching prefix.
 *
 * We assume that for non‑NCR provinces, the first 4 characters of the province psgc_id
 * should match the first 4 characters of the city/municipality psgc_id.
 */
const suggestionCache: { [key: string]: LocationSuggestion[] } = {};

export function getCachedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean
): LocationSuggestion[] {
  const cacheKey = `${provinceId}-${isNCRMode ? 'ncr' : 'non-ncr'}`;
  if (suggestionCache[cacheKey]) {
    return suggestionCache[cacheKey];
  }

  let filteredCities: City[] = [];
  if (isNCRMode) {
    // In NCR mode, get cities and districts
    const ncrCities = ncrData.cities
      .filter((city) => {
        // Include all cities except City of Manila, but include its districts
        if (city.psgc_id === '1380600000') return false; // Exclude City of Manila
        if (city.geographic_level === 'SubMun') {
          // Include districts of Manila
          return city.psgc_id.startsWith('138060');
        }
        // Include other NCR cities
        return city.geographic_level === 'City';
      })
      .map((city) => ({
        psgc_id: city.psgc_id,
        name:
          city.geographic_level === 'SubMun'
            ? `${city.name}, Manila City` // Add "Manila City" to district names
            : city.name,
        geographic_level: city.geographic_level,
      }));

    filteredCities = [...ncrCities];
  } else {
    // Non-NCR logic remains the same
    const provincePrefix = provinceId.substring(0, 4);
    filteredCities = citiesMunicipalities.filter((city) =>
      city.psgc_id.startsWith(provincePrefix)
    );
  }

  // Sort the suggestions by name
  const suggestions = filteredCities
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((city) => formatLocationForDisplay(city));

  suggestionCache[cacheKey] = suggestions;
  return suggestions;
}

// Get all cities/municipalities.
// (Not used directly in the UI if filtering by province is desired.)
export function getAllCitiesMunicipalities(isNCRMode: boolean = false): City[] {
  if (isNCRMode) {
    // If NCR, return the NCR cities from ncrData.
    return ncrData.cities.map((city) => ({
      psgc_id: city.psgc_id,
      name: city.name,
      geographic_level: city.geographic_level,
    }));
  }
  return citiesMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
}

// Get barangays filtered by the parent city/municipality ID.
// We derive the parent ID by taking the first 7 digits of the city/municipality psgc_id and appending '000'.
export function getBarangaysByLocation(cityId: string): Barangay[] {
  const parentId = cityId.substring(0, 7);

  return barangays.filter((barangay) => barangay.psgc_id.startsWith(parentId));
}

// (If needed) Dummy implementation for sub-municipality filtering.
export function getBarangaysBySubMunicipality(
  locationId: string,
  subMun: string
): Barangay[] {
  // For now, fall back to filtering by locationId.
  return getBarangaysByLocation(locationId);
}

// Format a city/municipality for display as a suggestion.
export function formatLocationForDisplay(location: City): LocationSuggestion {
  return {
    id: location.psgc_id,
    displayName: location.name,
    psgc_id: location.psgc_id,
    type:
      location.geographic_level.toLowerCase() === 'city'
        ? 'city'
        : 'municipality',
  };
}
