import { z } from 'zod';

// Sub-schemas
const nameSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional(),
  last: z.string().min(1, 'Last name is required'),
});

const placeOfBirthSchema = z.object({
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
    province: 'Bulacan',
    cityMunicipality: 'Malolos',

    husbandFirstName: 'Juan Miguel',
    husbandMiddleName: 'Santos',
    husbandLastName: 'Dela Cruz',
    husbandAge: 28,
    husbandDateOfBirth: new Date('1995-06-15'),
    husbandPlaceOfBirth: {
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
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
      cityMunicipality: 'Malolos',
      province: 'Bulacan',
      country: 'Philippines',
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
      office:
        'Malolos Cathedral (Minor Basilica and Cathedral of the Immaculate Conception)',
      cityMunicipality: 'Malolos',
      province: 'Bulacan',
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
