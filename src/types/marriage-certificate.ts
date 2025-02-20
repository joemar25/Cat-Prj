// src/types/marriage-certificate.ts

export type PersonName = {
  first: string;
  middle?: string | null;
  last: string;
};

export type Place = {
  cityMunicipality: string;
  province: string;
  country?: string;
  office?: string;
  houseNo?: string;
  st?:string;
  barangay?:string;
};

export type ConsentPerson = {
  name: PersonName;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  residence: string;
};

export type SolemnizingOfficer = {
  name: string;
  position: string;
  religion: string;
  registryNoExpiryDate: string;
};

export type Witness = {
  name: string;
  signature?: string;
};

// Add a new type for grouped witnesses
export type WitnessGroups = {
  husband: Witness[];
  wife: Witness[];
};

// Main MarriageFormData type
export type MarriageFormData = {
  // Registry Information
  registryNo: string;
  province: string;
  cityMunicipality: string;

  // Husband's Information
  husbandFirstName: string;
  husbandMiddleName?: string;
  husbandLastName: string;
  husbandAge: number;
  husbandDateOfBirth: string | null; // Changed from Date
  husbandPlaceOfBirth: Place;
  husbandSex: 'male' | 'female';
  husbandCitizenship: string;
  husbandResidence: string;
  husbandReligion?: string;
  husbandCivilStatus: 'single' | 'widowed' | 'divorced';

  // Husband's Parents
  husbandFatherName: PersonName;
  husbandFatherCitizenship: string;
  husbandMotherMaidenName: PersonName;
  husbandMotherCitizenship: string;

  // Wife's Information
  wifeFirstName: string;
  wifeMiddleName?: string;
  wifeLastName: string;
  wifeAge: number;
  wifeDateOfBirth: string | null; // Changed from Date
  wifePlaceOfBirth: Place;
  wifeSex: 'male' | 'female';
  wifeCitizenship: string;
  wifeResidence: string;
  wifeReligion?: string;
  wifeCivilStatus: 'single' | 'widowed' | 'divorced';

  // Wife's Parents
  wifeFatherName: PersonName;
  wifeFatherCitizenship: string;
  wifeMotherMaidenName: PersonName;
  wifeMotherCitizenship: string;

  // Marriage Details
  placeOfMarriage: Place;
  dateOfMarriage: string | null; // Changed from Date
  timeOfMarriage: string;

  // Additional Fields
  marriageSettlement: boolean;
  noMarriageLicense: boolean;
  executiveOrderApplied: boolean;
  presidentialDecreeApplied: boolean;

  // Consent Information
  husbandConsentPerson?: ConsentPerson | null;
  wifeConsentPerson?: ConsentPerson | null;

  // Witnesses
  witnesses: WitnessGroups;

  // Officials
  solemnizingOfficer?: SolemnizingOfficer;
  solemnizingOfficerSignature?: string;

  // Marriage License Details
  marriageLicenseDetails?: {
    number: string;
    dateIssued: string;
    placeIssued: string;
  };

  // Signatures
  contractingPartiesSignature?: {
    husband: string;
    wife: string;
  };

  receivedBy: {
    signature: string;
    name: string;
    title: string;
    date: string; // should match the format used in your form
  };

  // Registered at Civil Registrar
  registeredAtCivilRegistrar: {
    signature: string;
    name: string;
    title: string;
    date: string; // should match the format used in your form
  };

  remarks?: string;
};

// Preview component props
export interface MarriageCertificatePreviewProps {
  data: Partial<MarriageFormData>;
}
