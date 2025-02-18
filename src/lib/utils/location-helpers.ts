// src/lib/utils/location-helpers.ts
import ncrDataFile from '@/lib/jsons/ncr_data.json'
import barangaysData from '@/lib/jsons/barangays.json'
import provincesData from '@/lib/jsons/provinces.json'
import citiesMunicipalitiesData from '@/lib/jsons/cities_municipalities.json'

/**
 * Will always follow this order:
 * `${houseNo}, ${street}, ${barangay}, ${cityMunicipality}, ${province}, Philippines`
 * as json file submission of addresses.
 */

export const COUNTRY = 'Philippines'

/**
 * Updated interfaces to match the PHP extractor output.
 */
export interface BaseLocation {
  psgc_id: string
  name: string
  correspondence_code: string
  geographic_level: string
  old_names: string
  city_class: string
  income_classification: string
  urban_rural: string
  population: string
  status: string
}

export interface NCRRegion extends BaseLocation { }

export interface NCRLocation {
  psgc_id: string
  name: string
  correspondence_code: string
  geographic_level: string
}

export interface NCRData {
  region: NCRRegion
  cities: NCRLocation[]
}

export interface Province extends BaseLocation { }

export interface City extends BaseLocation { }

export interface Barangay {
  psgc_id: string
  name: string
  geographic_level: string
  old_names: string | null
}

export interface LocationSuggestion {
  id: string
  displayName: string
  psgc_id: string
  type: 'city' | 'municipality' | 'subMunicipality'
}

// Cast the imported data to their proper types
const provinces = provincesData as Province[]
const citiesMunicipalities = citiesMunicipalitiesData as City[]
const barangays = barangaysData as Barangay[]
const ncrData = ncrDataFile as NCRData

// Get all provinces sorted by name
export function getAllProvinces(): Province[] {
  return provinces.sort((a, b) => a.name.localeCompare(b.name))
}

const suggestionCache: { [key: string]: LocationSuggestion[] } = {}

export function getCachedCitySuggestions(
  provinceId: string,
  isNCRMode: boolean
): LocationSuggestion[] {
  const cacheKey = `${provinceId}-${isNCRMode ? 'ncr' : 'non-ncr'}`
  if (suggestionCache[cacheKey]) {
    return suggestionCache[cacheKey]
  }

  let filteredCities: City[] = []
  if (isNCRMode) {
    // In NCR mode, get cities and districts
    const ncrCities = ncrData.cities
      .filter((city) => {
        // Exclude City of Manila but include its districts
        if (city.psgc_id === '1380600000') return false
        if (city.geographic_level === 'SubMun') {
          // Include districts of Manila
          return city.psgc_id.startsWith('138060')
        }
        // Include other NCR cities
        return city.geographic_level === 'City'
      })
      .map((city) => ({
        psgc_id: city.psgc_id,
        name:
          city.geographic_level === 'SubMun'
            ? `${city.name}, Manila City`
            : city.name,
        correspondence_code: city.correspondence_code,
        geographic_level: city.geographic_level,
        old_names: '',
        city_class: '',
        income_classification: '',
        urban_rural: '',
        population: '',
        status: '',
      }))

    filteredCities = [...ncrCities]
  } else {
    // Find the selected province to get its correspondence_code
    const selectedProvince = provinces.find((p) => p.psgc_id === provinceId)
    if (!selectedProvince) return []

    // Get the province correspondence code prefix (first 4 digits)
    const provinceCorrespondencePrefix =
      selectedProvince.correspondence_code.substring(0, 4)

    // Filter cities based on correspondence_code matching
    filteredCities = citiesMunicipalities.filter((city) =>
      city.correspondence_code.startsWith(provinceCorrespondencePrefix)
    )
  }

  // Sort the suggestions by name and format for display
  const suggestions = filteredCities
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((city) => formatLocationForDisplay(city))

  suggestionCache[cacheKey] = suggestions
  return suggestions
}

// Get all cities/municipalities.
export function getAllCitiesMunicipalities(isNCRMode: boolean = false): City[] {
  if (isNCRMode) {
    // If NCR, return the NCR cities from ncrData.
    return ncrData.cities.map((city) => ({
      psgc_id: city.psgc_id,
      name: city.name,
      geographic_level: city.geographic_level,
      correspondence_code: city.correspondence_code,
      old_names: '',
      city_class: '',
      income_classification: '',
      urban_rural: '',
      population: '',
      status: '',
    }))
  }
  return citiesMunicipalities.sort((a, b) => a.name.localeCompare(b.name))
}

// Get barangays filtered by the parent city/municipality ID.
export function getBarangaysByLocation(cityId: string): Barangay[] {
  const parentId = cityId.substring(0, 7)
  return barangays.filter((barangay) => barangay.psgc_id.startsWith(parentId))
}

// Cache for barangay suggestions based on cityId and search term.
const barangayCache: { [key: string]: Barangay[] } = {}

/**
 * Get cached barangay suggestions for a specific city and search term.
 * @param cityId The selected city's psgc_id.
 * @param searchTerm The search term to filter barangays.
 * @returns A list of matching Barangays.
 */
export function getCachedBarangaySuggestions(
  cityId: string,
  searchTerm: string = ''
): Barangay[] {
  const cacheKey = `${cityId}-${searchTerm.toLowerCase()}`
  if (barangayCache[cacheKey]) {
    return barangayCache[cacheKey]
  }
  // Get all barangays for the given city.
  const allBarangays = getBarangaysByLocation(cityId)
  // Filter by the search term.
  const suggestions = allBarangays.filter((barangay) =>
    barangay.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  barangayCache[cacheKey] = suggestions
  return suggestions
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
        : location.geographic_level.toLowerCase() === 'submun'
          ? 'subMunicipality'
          : 'municipality',
  }
}
