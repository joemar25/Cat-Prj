import { z } from 'zod';

// Common name object schema
const nameSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional(),
  last: z.string().min(1, 'Last name is required'),
});

// Common place schema
const placeSchema = z.object({
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

// Define the form schema
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
  husbandPlaceOfBirth: placeSchema,
  husbandSex: z.enum(['male', 'female']),
  husbandCitizenship: z.string().min(1, 'Citizenship is required'),
  husbandResidence: z.string().min(1, 'Residence is required'),
  husbandReligion: z.string().optional(),
  husbandCivilStatus: z.enum(['single', 'widowed', 'divorced']),

  // Husband's Parents Information
  husbandFatherName: nameSchema,
  husbandFatherCitizenship: z
    .string()
    .min(1, "Father's citizenship is required"),
  husbandMotherMaidenName: nameSchema,
  husbandMotherCitizenship: z
    .string()
    .min(1, "Mother's citizenship is required"),

  // Husband's Consent Information
  husbandConsentGivenBy: nameSchema.optional(),
  husbandConsentRelationship: z
    .enum(['father', 'mother', 'guardian', 'other'])
    .optional(),
  husbandConsentResidence: z.string().optional(),
  husbandConsentContactNo: z.string().optional(),

  // Wife's Information
  wifeFirstName: z.string().min(1, 'First name is required'),
  wifeMiddleName: z.string().optional(),
  wifeLastName: z.string().min(1, 'Last name is required'),
  wifeAge: z.number().min(18, 'Must be at least 18 years old'),
  wifeDateOfBirth: z.date(),
  wifePlaceOfBirth: placeSchema,
  wifeSex: z.enum(['male', 'female']),
  wifeCitizenship: z.string().min(1, 'Citizenship is required'),
  wifeResidence: z.string().min(1, 'Residence is required'),
  wifeReligion: z.string().optional(),
  wifeCivilStatus: z.enum(['single', 'widowed', 'divorced']),

  // Wife's Parents Information
  wifeFatherName: nameSchema,
  wifeFatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  wifeMotherMaidenName: nameSchema,
  wifeMotherCitizenship: z.string().min(1, "Mother's citizenship is required"),

  // Wife's Consent Information
  wifeConsentGivenBy: nameSchema.optional(),
  wifeConsentRelationship: z
    .enum(['father', 'mother', 'guardian', 'other'])
    .optional(),
  wifeConsentResidence: z.string().optional(),
  wifeConsentContactNo: z.string().optional(),

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

  // Legal Documentation
  marriageSettlement: z.boolean().default(false),
  noMarriageLicense: z.boolean().default(false),
  executiveOrderApplied: z.boolean().default(false),
  presidentialDecreeApplied: z.boolean().default(false),

  // Solemnizing Officer Details
  solemnizingOfficer: z.object({
    name: z.string().min(1, 'Officer name is required'),
    position: z.string().min(1, 'Position is required'),
    religion: z.string().min(1, 'Religion is required'),
    registryNo: z.string().min(1, 'Registry number is required'),
    expiryDate: z.date(),
  }),
  solemnizingOfficerSignature: z.string().optional(),

  // Contracting Parties Signatures
  contractingPartiesSignature: z.object({
    husband: z.any().nullable(),
    wife: z.any().nullable(),
  }),

  // Witnesses
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1, 'Witness name is required'),
        signature: z.any().nullable(), // or more specific type if you're using a particular file upload solution
      })
    )
    .min(2),

  // Receipt Information
  receivedBy: z.object({
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    date: z.date(),
  }),

  // Registration Information
  registeredBy: z.object({
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    date: z.date(),
  }),

  // Remarks
  remarks: z.string().optional(),
});

// Type inference
export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;

// Props interface
export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

// Default values
export const defaultMarriageCertificateValues: Partial<MarriageCertificateFormValues> =
  {
    husbandSex: 'male',
    wifeSex: 'female',
    marriageSettlement: false,
    noMarriageLicense: false,
    executiveOrderApplied: false,
    presidentialDecreeApplied: false,
    witnesses: [
      { name: '', signature: null },
      { name: '', signature: null },
    ],
    solemnizingOfficer: {
      name: '',
      position: '',
      religion: '',
      registryNo: '',
      expiryDate: new Date(),
    },
    contractingPartiesSignature: {
      husband: null,
      wife: null,
    },
    dateOfMarriage: new Date(),
  };
