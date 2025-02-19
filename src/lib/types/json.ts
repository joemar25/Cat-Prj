// src\lib\types\json.ts
export interface NameObject {
    first: string
    middle?: string
    last: string
}

export interface PlaceOfBirthObject {
    hospital: string
    street?: string
    barangay?: string
    cityMunicipality: string
    province: string
    country: string
}