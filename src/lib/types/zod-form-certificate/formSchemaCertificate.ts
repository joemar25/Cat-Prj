// src\lib\types\zod-form-certificate\formSchemaCertificate.ts
import { COUNTRY } from '@/lib/constants/locations';
import { z } from 'zod';

// Sub-schemas
const nameSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional(),
  last: z.string().min(1, 'Last name is required'),
});

const placeOfBirthSchema = z.object({
  region: z.string().min(1, 'Region is required'), // Add this line
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

// Main schema
export const marriageCertificateSchema = z.object({
  // Registry Information
  registryNo: z.string().min(1, 'Registry number is required'),

  province: z.string().min(1, 'Province is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),

  // Husband's Information
  husbandFirstName: z.string().min(1, 'First name is required'),
  husbandMiddleName: z.string().optional(),
  husbandLastName: z.string().min(1, 'Last name is required'),
  husbandAge: z.number().min(18, 'Must be at least 18 years old'),
  husbandDateOfBirth: z.date(),
  husbandPlaceOfBirth: placeOfBirthSchema,
  husbandSex: z.enum(['male', 'female']).default('male'),
  husbandCitizenship: z.string().min(1, 'Citizenship is required'),
  husbandResidence: z.string().min(1, 'Residence is required'),
  husbandReligion: z.string().optional(),
  husbandCivilStatus: z.enum(['single', 'widowed', 'divorced']),

  // Husband's Parents
  husbandFatherName: nameSchema,
  husbandFatherCitizenship: z
    .string()
    .min(1, "Father's citizenship is required"),
  husbandMotherMaidenName: nameSchema,
  husbandMotherCitizenship: z
    .string()
    .min(1, "Mother's citizenship is required"),

  // Wife's Information
  wifeFirstName: z.string().min(1, 'First name is required'),
  wifeMiddleName: z.string().optional(),
  wifeLastName: z.string().min(1, 'Last name is required'),
  wifeAge: z.number().min(18, 'Must be at least 18 years old'),
  wifeDateOfBirth: z.date(),
  wifePlaceOfBirth: placeOfBirthSchema,
  wifeSex: z.enum(['male', 'female']).default('female'),
  wifeCitizenship: z.string().min(1, 'Citizenship is required'),
  wifeResidence: z.string().min(1, 'Residence is required'),
  wifeReligion: z.string().optional(),
  wifeCivilStatus: z.enum(['single', 'widowed', 'divorced']),

  // Wife's Parents
  wifeFatherName: nameSchema,
  wifeFatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  wifeMotherMaidenName: nameSchema,
  wifeMotherCitizenship: z.string().min(1, "Mother's citizenship is required"),

  // Consent Information (Husband)
  husbandConsentGivenBy: nameSchema.optional(),
  husbandConsentRelationship: z
    .enum(['father', 'mother', 'guardian', 'other'])
    .optional(),
  husbandConsentResidence: z.string().optional(),

  // Consent Information (Wife)
  wifeConsentGivenBy: nameSchema.optional(),
  wifeConsentRelationship: z
    .enum(['father', 'mother', 'guardian', 'other'])
    .optional(),
  wifeConsentResidence: z.string().optional(),

  // Marriage Details
  placeOfMarriage: z.object({
    office: z.string().min(1, 'Place of marriage is required'),
    region: z.string().min(1, 'Region is required'),
    cityMunicipality: z.string().min(1, 'City/Municipality is required'),
    province: z.string().min(1, 'Province is required'),
  }),
  dateOfMarriage: z.date(),
  timeOfMarriage: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),

  // Additional Required Fields
  marriageSettlement: z.boolean().default(false),
  noMarriageLicense: z.boolean().default(false),
  executiveOrderApplied: z.boolean().default(false),
  presidentialDecreeApplied: z.boolean().default(false),

  // Witnesses Array
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1, 'Witness name is required'),
        signature: z.string().optional(),
      })
    )
    .min(2, 'At least two witnesses are required'),

  // Solemnizing Officer
  solemnizingOfficer: z.object({
    name: z.string().min(1, 'Solemnizing officer name is required'),
    position: z.string().min(1, 'Position is required'),
    religion: z.string().min(1, 'Religion is required'),
    registryNoExpiryDate: z.string().min(1, 'Registry expiry date is required'),
  }),

  // Signatures
  contractingPartiesSignature: z
    .object({
      husband: z.string().optional(),
      wife: z.string().optional(),
    })
    .optional(),

  solemnizingOfficerSignature: z.string().optional(),

  // Marriage License Details
  marriageLicenseDetails: z
    .object({
      number: z.string().min(1, 'License number is required'),
      dateIssued: z.string().min(1, 'Date issued is required'),
      placeIssued: z.string().min(1, 'Place issued is required'),
    })
    .optional(),
});
// Type inference
export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;

// Realistic default values
export const defaultMarriageCertificateValues: Partial<MarriageCertificateFormValues> =
  {
    registryNo: '2024-0001',
    province: '',
    cityMunicipality: '',

    husbandFirstName: 'Juan Miguel',
    husbandMiddleName: 'Santos',
    husbandLastName: 'Dela Cruz',
    husbandAge: 28,
    husbandDateOfBirth: new Date('1995-06-15'),
    husbandPlaceOfBirth: {
      region: 'Ilocos Region', // Region 1 name from constants
      cityMunicipality: 'Laoag City', // Valid city from Ilocos Norte
      province: 'Ilocos Norte', // Valid province from Region 1
      country: COUNTRY, // Using the constant
    },
    husbandSex: 'male',
    husbandCitizenship: 'Filipino',
    husbandResidence: '123 Sampaguita Street, Brgy. San Jose, Malolos, Bulacan',
    husbandReligion: 'Roman Catholic',
    husbandCivilStatus: 'single',

    husbandFatherName: {
      first: 'Roberto',
      middle: 'Manuel',
      last: 'Dela Cruz',
    },
    husbandFatherCitizenship: 'Filipino',
    husbandMotherMaidenName: {
      first: 'Maria',
      middle: 'Reyes',
      last: 'Santos',
    },
    husbandMotherCitizenship: 'Filipino',

    wifeFirstName: 'Maria Clara',
    wifeMiddleName: 'Rodriguez',
    wifeLastName: 'Reyes',
    wifeAge: 26,
    wifeDateOfBirth: new Date('1997-09-23'),
    wifePlaceOfBirth: {
      region: 'Ilocos Region',
      cityMunicipality: 'Vigan City', // City from Ilocos Sur
      province: 'Ilocos Sur', // Province from Region 1
      country: COUNTRY, // Using the constant
    },
    wifeSex: 'female',
    wifeCitizenship: 'Filipino',
    wifeResidence:
      '456 Ilang-Ilang Street, Brgy. Santa Isabel, Malolos, Bulacan',
    wifeReligion: 'Roman Catholic',
    wifeCivilStatus: 'single',

    wifeFatherName: {
      first: 'Antonio',
      middle: 'Garcia',
      last: 'Reyes',
    },
    wifeFatherCitizenship: 'Filipino',
    wifeMotherMaidenName: {
      first: 'Teresa',
      middle: 'Santos',
      last: 'Rodriguez',
    },
    wifeMotherCitizenship: 'Filipino',

    placeOfMarriage: {
      office: 'Vigan Cathedral',
      region: 'Ilocos Region',
      cityMunicipality: 'Vigan City',
      province: 'Ilocos Sur',
    },
    dateOfMarriage: new Date('2024-02-14'),
    timeOfMarriage: '10:30',

    // Husband's Side Consent Information
    husbandConsentGivenBy: {
      first: 'Roberto',
      middle: 'Manuel',
      last: 'Dela Cruz',
    },
    husbandConsentRelationship: 'father',
    husbandConsentResidence:
      '123 Sampaguita Street, Brgy. San Jose, Malolos, Bulacan',

    // Wife's Side Consent Information
    wifeConsentGivenBy: {
      first: 'Antonio',
      middle: 'Garcia',
      last: 'Reyes',
    },
    wifeConsentRelationship: 'father',
    wifeConsentResidence:
      '456 Ilang-Ilang Street, Brgy. Santa Isabel, Malolos, Bulacan',

    // Additional required fields
    marriageSettlement: false,
    noMarriageLicense: false,
    executiveOrderApplied: false,
    presidentialDecreeApplied: false,
    witnesses: [
      {
        name: 'Juan dela Torre',
        signature: '',
      },
      {
        name: 'Maria Santos',
        signature: '',
      },
    ],
    solemnizingOfficer: {
      name: 'Rev. Fr. Jose Santos',
      position: 'Parish Priest',
      religion: 'Roman Catholic',
      registryNoExpiryDate: '2025-12-31',
    },
    contractingPartiesSignature: {
      husband: '',
      wife: '',
    },
    solemnizingOfficerSignature: '',
    marriageLicenseDetails: {
      number: '2024-001',
      dateIssued: new Date('2024-01-14').toISOString(), // 30 days before marriage
      placeIssued: 'Malolos City Civil Registry',
    },
  };

// Props interface
export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
// ------------------------------------- Death Certificate Schema --------------------//////

// Main Death Certificate Schema
export const deathCertificateSchema = z.object({
  // Registry Information
  registryNumber: z.string().min(1, 'Registry number is required'),
  province: z.string().min(1, 'Province is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),

  // Time of death format
  timeOfDeath: z.object({
    hour: z.string(),
    minute: z.string(),
  }),

  // Personal Information
  name: nameSchema,
  sex: z.enum(['Male', 'Female']),
  dateOfDeath: z.date(),
  dateOfBirth: z.date(),
  ageAtDeath: z.object({
    years: z.number().optional(),
    months: z.number().optional(),
    days: z.number().optional(),
    hours: z.number().optional(),
  }),
  placeOfDeath: z.string().min(1, 'Place of death is required'),
  civilStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced']),
  religion: z.string().min(1, 'Religion is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  residence: z.string().min(1, 'Residence is required'),
  occupation: z.string().min(1, 'Occupation is required'),

  // Family Information
  fatherName: nameSchema,
  motherMaidenName: nameSchema,

  // Medical Certificate
  causesOfDeath: z.object({
    immediate: z.string().min(1, 'Immediate cause is required'),
    antecedent: z.string().min(1, 'Antecedent cause is required'),
    underlying: z.string().min(1, 'Underlying cause is required'),
    contributingConditions: z.string().optional(),
  }),

  // Maternal Condition (for females)
  maternalCondition: z
    .enum([
      'pregnant_not_in_labour',
      'pregnant_in_labour',
      'less_than_42_days',
      '42_days_to_1_year',
      'none',
    ])
    .optional(),

  // External Causes
  deathByExternalCauses: z.object({
    mannerOfDeath: z.string().min(1, 'Manner of death is required'),
    placeOfOccurrence: z.string().min(1, 'Place of occurrence is required'),
  }),

  // Medical Attendance
  attendant: z.object({
    type: z.enum([
      'Private Physician',
      'Public Health Officer',
      'Hospital Authority',
      'None',
      'Others',
    ]),
    duration: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }),
  }),

  // Certification

  certification: z.object({
    hasAttended: z.boolean(),
    deathDateTime: z.string().min(1, 'Date and time of death is required'),
    signature: z.string().optional(),
    nameInPrint: z.string().min(1, 'Name is required'),
    titleOfPosition: z.string().min(1, 'Title/Position is required'),
    address: z.string().min(1, 'Address is required'),
    date: z.date(),
    reviewedBy: z.object({
      name: z.string().min(1, 'Name is required'), // Staff name
      title: z.string().min(1, 'Title is required'), // Auto-filled title
      position: z.string().min(1, 'Position is required'), // Auto-filled position
      date: z.date(), // Review date
    }),
  }),

  // Disposal Information
  disposal: z.object({
    method: z.string().min(1, 'Disposal method is required'),
    burialPermit: z.object({
      number: z.string().min(1, 'Permit number is required'),
      dateIssued: z.date(),
    }),
    transferPermit: z.object({
      number: z.string().optional(),
      dateIssued: z.date(),
    }),
  }),
  cemeteryAddress: z.string().min(1, 'Cemetery address is required'),

  // Informant Details
  informant: z.object({
    signature: z.string().optional(),
    nameInPrint: z.string().min(1, 'Informant name is required'),
    relationshipToDeceased: z.string().min(1, 'Relationship is required'),
    address: z.string().min(1, 'Address is required'),
    date: z.date(),
  }),

  // Administrative Information
  preparedBy: z.object({
    signature: z.string().optional(), // Signature field
    name: z.string().min(1, 'Name is required'), // Name in Print field
    title: z.string().min(1, 'Title/Position is required'), // Title or Position field
    date: z.date(), // Date field
  }),

  receivedBy: z.object({
    signature: z.string().optional(), // Signature field
    name: z.string().min(1, 'Name is required'), // Name field
    title: z.string().min(1, 'Title/Position is required'), // Title field
    date: z.date(), // Date field
  }),

  registeredAtCivilRegistrar: z.object({
    name: z.string().min(1, 'Name is required'), // Name in Print field
    title: z.string().min(1, 'Title/Position is required'), // Title field
    date: z.date(), // Date field
  }),

  remarks: z.string().optional(),
});

// Type inference
export type DeathCertificateFormValues = z.infer<typeof deathCertificateSchema>;
export const defaultDeathCertificateValues: Partial<DeathCertificateFormValues> =
  {
    // Registry Information
    registryNumber: '2024-0002',
    province: 'Bulacan',
    cityMunicipality: 'Malolos',

    // Personal Information
    name: {
      first: 'Ricardo',
      middle: 'Santos',
      last: 'Dela Cruz',
    },
    sex: 'Male',
    dateOfDeath: new Date('2024-01-15'),
    dateOfBirth: new Date('1950-06-20'),
    timeOfDeath: {
      hour: '08',
      minute: '30',
    },
    ageAtDeath: {
      years: 73,
      months: 6,
      days: 25,
      hours: 8,
    },
    placeOfDeath: 'Bulacan Medical Center, Malolos City',
    civilStatus: 'Married',
    religion: 'Roman Catholic',
    citizenship: 'Filipino',
    residence: '123 Rizal Street, Brgy. Tikay, Malolos, Bulacan',
    occupation: 'Retired Teacher',

    // Family Information
    fatherName: {
      first: 'Roberto',
      middle: 'Martinez',
      last: 'Dela Cruz',
    },
    motherMaidenName: {
      first: 'Maria',
      middle: 'Reyes',
      last: 'Santos',
    },

    // Medical Certificate
    causesOfDeath: {
      immediate: 'Acute Myocardial Infarction',
      antecedent: 'Coronary Artery Disease',
      underlying: 'Hypertension',
      contributingConditions: 'Diabetes Mellitus Type 2',
    },
    maternalCondition: 'none',
    deathByExternalCauses: {
      mannerOfDeath: 'Natural',
      placeOfOccurrence: 'Hospital',
    },
    attendant: {
      type: 'Hospital Authority',
      duration: {
        from: new Date('2024-01-14'),
        to: new Date('2024-01-15'),
      },
    },

    // Certification
    certification: {
      hasAttended: true,
      deathDateTime: '2024-01-15T08:30',
      signature: '',
      nameInPrint: 'Dr. Juan Perez',
      titleOfPosition: 'Attending Physician',
      address: 'Bulacan Medical Center, Malolos City',
      date: new Date('2024-01-15'),
      reviewedBy: {
        name: '',
        title: '',
        position: '',
        date: new Date(), // Default to current date
      },
    },

    // Disposal Information
    disposal: {
      method: 'Burial',
      burialPermit: {
        number: 'BP-2024-0015',
        dateIssued: new Date('2024-01-16'),
      },
      transferPermit: {
        number: 'N/A',
        dateIssued: new Date('2024-01-16'),
      },
    },
    cemeteryAddress: 'Malolos Catholic Cemetery, Malolos City, Bulacan',

    // Informant Information
    informant: {
      signature: '',
      nameInPrint: 'Maria Elena Dela Cruz',
      relationshipToDeceased: 'Spouse',
      address: '123 Rizal Street, Brgy. Tikay, Malolos, Bulacan',
      date: new Date('2024-01-15'),
    },

    // Administrative Details
    preparedBy: {
      signature: '',
      name: 'Ana Santos', // Default staff name
      title: 'Civil Registry Staff', // Auto-filled title
      date: new Date(), // Default to today's date
    },

    // Received By
    receivedBy: {
      signature: '',
      name: 'Pedro Reyes', // Default staff name
      title: 'Registration Officer', // Auto-filled title
      date: new Date(), // Default to today's date
    },

    // Civil Registrar Details
    registeredAtCivilRegistrar: {
      name: 'Maria Clara Torres', // Default staff name
      title: 'Civil Registrar', // Default title
      date: new Date(), // Default to today's date
    },

    remarks: '',
  };

export interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onSubmit?: (data: DeathCertificateFormValues) => void;
}

// --------------------------------- Birth Certificate Schema --------------------------//
// Define the Zod schema for the birth certificate form
export const birthCertificateSchema = z.object({
  registryNo: z.string().min(1, 'Registry number is required'),
  province: z.string().min(1, 'Province is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),

  childInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    sex: z.enum(['Male', 'Female']),
    dateOfBirth: z.object({
      day: z.string().min(1, 'Day is required'),
      month: z.string().min(1, 'Month is required'),
      year: z.string().min(1, 'Year is required'),
    }),
    placeOfBirth: z.object({
      hospital: z.string().min(1, 'Hospital is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
    }),
    typeOfBirth: z.string().min(1, 'Type of birth is required'),
    multipleBirth: z.string().optional(),
    birthOrder: z.string().min(1, 'Birth order is required'),
    weight: z.string().min(1, 'Weight is required'),
  }),

  motherInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    totalChildren: z.string().min(1, 'Total children is required'),
    livingChildren: z.string().min(1, 'Living children is required'),
    childrenDead: z.string().min(1, 'Children dead is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    residence: z.object({
      address: z.string().min(1, 'Address is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  fatherInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    residence: z.object({
      address: z.string().min(1, 'Address is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  marriageOfParents: z.object({
    date: z.object({
      month: z.string().min(1, 'Month is required'),
      day: z.string().min(1, 'Day is required'),
      year: z.string().min(1, 'Year is required'),
    }),
    place: z.object({
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  attendant: z.object({
    type: z.enum(['Physician', 'Nurse', 'Midwife', 'Hilot', 'Others']),
    certification: z.object({
      time: z.string().min(1, 'Time is required'),
      signature: z.string().optional(),
      name: z.string().min(1, 'Name is required'),
      title: z.string().min(1, 'Title is required'),
      address: z.string().min(1, 'Address is required'),
      date: z.string().min(1, 'Date is required'),
    }),
  }),

  informant: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    address: z.string().min(1, 'Address is required'),
    date: z.string().min(1, 'Date is required'),
  }),

  preparedBy: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
  }),

  receivedBy: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
  }),

  registeredByOffice: z.object({
    // New name to match component
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
  }),

  remarks: z.string().optional(),
});

// Type inference
export type BirthCertificateFormValues = z.infer<typeof birthCertificateSchema>;

// Default data for the birth certificate form
export const defaultBirthCertificateValues: Partial<BirthCertificateFormValues> =
  {
    registryNo: '2024-0003',
    province: '',
    cityMunicipality: '',

    childInfo: {
      firstName: 'Juan',
      middleName: 'Santos',
      lastName: 'Dela Cruz',
      sex: 'Male',
      dateOfBirth: {
        day: '15',
        month: '6',
        year: '2024',
      },
      placeOfBirth: {
        hospital: 'Bulacan Medical Center',
        cityMunicipality: '',
        province: '',
      },
      typeOfBirth: 'Single',
      birthOrder: '1',
      weight: '3.2',
    },

    motherInfo: {
      firstName: 'Maria',
      middleName: 'Garcia',
      lastName: 'Santos',
      citizenship: 'Filipino',
      religion: 'Roman Catholic',
      totalChildren: '2',
      livingChildren: '2',
      childrenDead: '0',
      occupation: 'Teacher',
      age: '28',
      residence: {
        address: '123 Main St., Brgy. Mojon',
        cityMunicipality: '',
        province: '',
        country: 'Philippines',
      },
    },

    fatherInfo: {
      firstName: 'Juan',
      middleName: 'Reyes',
      lastName: 'Dela Cruz',
      citizenship: 'Filipino',
      religion: 'Roman Catholic',
      occupation: 'Engineer',
      age: '30',
      residence: {
        address: '123 Main St., Brgy. Mojon',
        cityMunicipality: '',
        province: '',
        country: 'Philippines',
      },
    },

    marriageOfParents: {
      date: {
        month: '12',
        day: '25',
        year: '2020',
      },
      place: {
        cityMunicipality: '',
        province: '',
        country: 'Philippines',
      },
    },

    attendant: {
      type: 'Physician',
      certification: {
        time: '10:30',
        name: 'Dr. John Smith',
        title: 'Obstetrician',
        address: 'Bulacan Medical Center',
        date: '2024-06-15',
      },
    },

    informant: {
      name: 'Maria Santos Dela Cruz',
      relationship: 'Mother',
      address: '123 Main St., Brgy. Mojon, Malolos, Bulacan',
      date: '2024-06-15',
    },

    preparedBy: {
      name: '',
      title: '',
      date: '',
    },

    receivedBy: {
      name: '',
      title: '',
      date: '',
    },

    registeredByOffice: {
      // New name to match component
      name: '',
      title: '',
      date: '',
    },

    remarks: '',
  };

export interface BirthCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
