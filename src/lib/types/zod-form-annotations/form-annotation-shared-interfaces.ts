//src\lib\types\zod-form-annotations\form-annotation-shared-interfaces.ts

export interface BaseForm {
  id: string;
  preparedBy: {
    name: string;
    id: string;
  };
  verifiedBy: {
    name: string;
    id: string;
  };
  receivedByPosition: string | null;
  registeredByPosition: string | null;
  pageNumber: string;
  bookNumber: string;
  registryNumber: string;
  dateOfRegistration: string | Date;
}

export interface NameStructure {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  first?: string;
  middle?: string;
  last?: string;
}

export interface PlaceStructure {
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  hospital?: string;
  toString(): string;
}

export interface MarriagePlaceStructure {
  cityMunicipality?: string;
  province?: string;
  church?: string;
}

export interface ParentMarriageStructure {
  date?: string;
  place?: string | MarriagePlaceStructure;
}
