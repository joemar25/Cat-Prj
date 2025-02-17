//src\lib\types\location-selector.ts
// types
export type SubMunicipality = {
  name: string;
  barangays: string[];
};

export type CityWithDirectBarangays = {
  name: string;
  barangays: string[];
  subMunicipalities: never[];
};

export type CityWithSubMunicipalities = {
  name: string;
  barangays: never[];
  subMunicipalities: SubMunicipality[];
};

export type RegularCity = {
  name: string;
  barangays: string[];
};

export type Region =
  | {
    id: string;
    name: string;
    provinces: null;
    citiesMunicipalities: (
      | CityWithDirectBarangays
      | CityWithSubMunicipalities
    )[];
  }
  | {
    id: string;
    name: string;
    provinces: {
      id: string;
      name: string;
      citiesMunicipalities: RegularCity[];
    }[];
  };

export type Province = {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  citiesMunicipalities: (
    | CityWithDirectBarangays
    | CityWithSubMunicipalities
    | RegularCity
  )[];
};

export type CityMunicipality = {
  name: string;
  barangays: string[];
  provinceId?: string;
  provinceName?: string;
  regionId: string;
  regionName: string;
  subMunicipalities?: SubMunicipality[];
};

// Interfaces

export interface LocationSelectorProps {
  provinceFieldName?: string;
  municipalityFieldName?: string;
  provinceLabel?: string;
  municipalityLabel?: string;
  isNCRMode?: boolean;
  className?: string;
  provincePlaceholder?: string;
  municipalityPlaceholder?: string;
  onProvinceChange?: (province: string) => void;
  onMunicipalityChange?: (municipality: string) => void;
  // Style customization props
  selectTriggerClassName?: string;
  formItemClassName?: string;
  formLabelClassName?: string;
  selectContentClassName?: string;
  selectItemClassName?: string;

  barangayFieldName?: string;
  barangayLabel?: string;
  barangayPlaceholder?: string;
  showBarangay?: boolean;
  onBarangayChange?: (barangay: string) => void;
}
