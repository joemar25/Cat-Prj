// src\lib\constants\locations.ts
import citiesData from '@/lib/jsons/cities.json'
import provincesData from '@/lib/jsons/provinces.json'
import barangaysData from '@/lib/jsons/barangays.json'
import municipalitiesData from '@/lib/jsons/municipalities.json'

/**
 * 
 * Mar-Note (Do not remove)
 * Will always follow this order `${houseNo}, ${street}, ${barangay}, ${cityMunicipality}, ${province}, Philippines` as json file submission of addresses
 * 
 * */

export const COUNTRY = 'Philippines'

export interface Province {
  name: string
  region: string
}

export interface City {
  name: string
  region: string
  province: string | null
  subMunicipalities: string[]
  municipalities: string[]
}

export interface Municipality {
  name: string
  region: string
  province: string | null
  city: string | null
  subMunicipalities: string[]
  barangays: string[]
}

export interface Barangay {
  name: string
  region: string
  province: string | null
  city: string | null
  municipality: string | null
}

export const PROVINCES: Province[] = provincesData as Province[]
export const CITIES: City[] = citiesData as City[]
export const MUNICIPALITIES: Municipality[] = municipalitiesData as Municipality[]
export const BARANGAYS: Barangay[] = barangaysData as Barangay[]
