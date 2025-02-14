// Import JSON files directly
import barangaysData from '@/lib/jsons/barangays.json';
import citiesMunicipalitiesData from '@/lib/jsons/cities_municipalities.json';
import ncrDataFile from '@/lib/jsons/ncr_data.json';
import provincesData from '@/lib/jsons/provinces.json';

// Define interfaces based on your PHP extractor output
export interface NCRData {
  region: {
    id: string;
    name: string;
    code: string;
    population: number;
  };
  administrative_divisions: {
    cities: NCRLocation[];
    districts: NCRLocation[];
    municipalities: NCRLocation[];
  };
  statistics: {
    total_cities: number;
    total_districts: number;
    total_municipalities: number;
    total_population: number;
    last_updated: string;
  };
}

interface NCRLocation {
  id: string;
  name: string;
  code: string;
  population: number;
  geographic_level: string;
  city_class: string | null;
  income_classification: string | null;
  urban_rural: string | null;
}

export interface Province {
  psgc_id: string;
  name: string;
  correspondence_code: string;
  geographic_level: string;
  old_names: string | null;
  city_class: string | null;
  income_classification: string | null;
  urban_rural: string | null;
  population: string;
  status: string | null;
}

export interface City {
  psgc_id: string;
  name: string;
  correspondence_code: string;
  geographic_level: string;
  old_names: string | null;
  city_class: string | null;
  income_classification: string | null;
  urban_rural: string | null;
  population: string;
  status: string | null;
}

export interface Barangay {
  psgc_id: string;
  name: string;
  correspondence_code: string;
  geographic_level: string;
  old_names: string | null;
  city_class: string | null;
  income_classification: string | null;
  urban_rural: string | null;
  population: string;
  status: string | null;
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

export function getAllProvinces(): Province[] {
  return provinces.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllCitiesMunicipalities(isNCRMode: boolean = false): City[] {
  if (isNCRMode) {
    const ncrCities = ncrData.administrative_divisions.cities.map((city) => ({
      psgc_id: city.id,
      name: city.name,
      correspondence_code: city.code,
      geographic_level: city.geographic_level,
      old_names: null,
      city_class: city.city_class,
      income_classification: city.income_classification,
      urban_rural: city.urban_rural,
      population: city.population.toString(),
      status: null,
    }));

    const ncrMunicipalities =
      ncrData.administrative_divisions.municipalities.map((mun) => ({
        psgc_id: mun.id,
        name: mun.name,
        correspondence_code: mun.code,
        geographic_level: mun.geographic_level,
        old_names: null,
        city_class: mun.city_class,
        income_classification: mun.income_classification,
        urban_rural: mun.urban_rural,
        population: mun.population.toString(),
        status: null,
      }));

    return [...ncrCities, ...ncrMunicipalities];
  }
  return citiesMunicipalities;
}

export function getBarangaysByLocation(cityId: string): Barangay[] {
  // Get parent city/municipality ID by taking first 7 digits and adding '000'
  const parentId = cityId.substring(0, 7) + '000';
  return barangays.filter((barangay) => barangay.psgc_id.startsWith(parentId));
}

export function getCitiesByProvince(
  provinceId: string,
  isNCRMode: boolean = false
): City[] {
  if (isNCRMode) {
    return getAllCitiesMunicipalities(true);
  }

  const cities = getAllCitiesMunicipalities();
  // Get parent province ID by taking first 4 digits and adding '00000'
  const parentId = provinceId.substring(0, 4) + '00000';
  return cities.filter((city) => city.psgc_id.startsWith(parentId));
}

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

// Cache object for suggestions
const suggestionCache: { [key: string]: LocationSuggestion[] } = {};

export function getCachedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean
): LocationSuggestion[] {
  const cacheKey = `${provinceId}-${isNCRMode ? 'ncr' : 'non-ncr'}`;

  if (suggestionCache[cacheKey]) {
    return suggestionCache[cacheKey];
  }

  const cities = getCitiesByProvince(provinceId, isNCRMode);
  const suggestions = cities.map(formatLocationForDisplay);

  suggestionCache[cacheKey] = suggestions;
  return suggestions;
}
