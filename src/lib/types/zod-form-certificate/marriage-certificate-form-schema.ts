import { z } from 'zod';
import {
  cityMunicipalitySchema,
  dateSchema,
  nameSchema,
  provinceSchema, // note: this is a factory function: provinceSchema(isOptional: boolean)
  registryNumberSchema,
  signatureSchema,
  timeSchema,
} from './form-certificates-shared-schema';

export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

/**
 * Helper schemas for common fields
 */

// Consent Person (used for both husband and wife consent persons)
const consentPersonSchema = nameSchema.extend({
  relationship: z.string().min(1, 'Relationship is required'),
  residence: z.string().min(1, 'Residence is required'),
});

// Person Information (used for husbandInfo and wifeInfo)
const personInfoSchema = z.object({
  firstName: nameSchema.shape.firstName,
  middleName: nameSchema.shape.middleName,
  lastName: nameSchema.shape.lastName,
  age: z.number().min(18, 'Must be at least 18 years old'),
  dateOfBirth: dateSchema,
  placeOfBirth: z.object({
    province: provinceSchema(false),
    cityMunicipality: cityMunicipalitySchema,
    specificAddress: z.string().optional(),
  }),
  citizenship: z.string().min(1, 'Citizenship is required'),
  residence: z.string().min(1, 'Residence is required'),
  religion: z.string().optional(),
  civilStatus: z.enum(['single', 'widowed', 'divorced']),
});

// Parents Information (used for both husbandParents and wifeParents)
const parentsSchema = z.object({
  father: nameSchema,
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  mother: nameSchema,
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
});

// Marriage Details (place, date, and time of marriage)
const marriageDetailsSchema = z.object({
  placeOfMarriage: z.object({
    office: z.string().min(1, 'Place of marriage is required'),
    region: z.string().min(1, 'Region is required'),
    cityMunicipality: cityMunicipalitySchema,
    province: provinceSchema(false),
  }),
  dateOfMarriage: dateSchema,
  timeOfMarriage: timeSchema,
});

// Witness schema (used for each witness entry)
const witnessSchema = z.object({
  name: z.string().min(1, 'Witness name is required'),
  signature: z.string().optional(),
});

/**
 * Main Marriage Certificate Schema
 */
export const marriageCertificateSchema = z.object({
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema(false),
  cityMunicipality: cityMunicipalitySchema,

  // Consent Information
  husbandConsentPerson: consentPersonSchema,
  wifeConsentPerson: consentPersonSchema,

  // Husband's Information (override the sex default to "male")
  husbandInfo: personInfoSchema.extend({
    sex: z.enum(['male', 'female']).default('male'),
  }),

  // Husband's Parents
  husbandParents: parentsSchema,

  // Wife's Information (override the sex default to "female")
  wifeInfo: personInfoSchema.extend({
    sex: z.enum(['male', 'female']).default('female'),
  }),

  // Wife's Parents
  wifeParents: parentsSchema,

  // Marriage Details
  marriageDetails: marriageDetailsSchema,

  // Witnesses
  witnesses: z.object({
    husband: z
      .array(witnessSchema)
      .min(1, 'At least one witness for husband is required'),
    wife: z
      .array(witnessSchema)
      .min(1, 'At least one witness for wife is required'),
  }),

  // Solemnizing Officer
  solemnizingOfficer: z.object({
    name: z.string().min(1, 'Solemnizing officer name is required'),
    position: z.string().min(1, 'Position is required'),
    religion: z.string().min(1, 'Religion is required'),
    registryNoExpiryDate: dateSchema,
  }),

  // Signatures
  signatures: z.object({
    contractingParties: z.object({
      husband: z.string().optional(),
      wife: z.string().optional(),
    }),
    solemnizingOfficer: z.string().optional(),
  }),

  // Marriage License Details
  marriageLicenseDetails: z.object({
    number: z.string().min(1, 'License number is required'),
    dateIssued: dateSchema,
    placeIssued: z.string().min(1, 'Place issued is required'),
  }),

  // Received By
  receivedBy: signatureSchema,

  // Registered By Civil Registrar
  registeredAtCivilRegistrar: signatureSchema,

  remarks: z.string().optional(),
});

// Export the TypeScript type for the form values
export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;
