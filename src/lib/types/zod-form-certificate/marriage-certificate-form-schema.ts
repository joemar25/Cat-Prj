import { z } from 'zod';
import {
  cityMunicipalitySchema,
  dateSchema,
  nameSchema,
  provinceSchema,
  registryNumberSchema,
  signatureSchema,
  timeSchema,
} from './form-certificates-shared-schema';
import WifeConsentInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/wife-consent-info-card';

export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export const marriageCertificateSchema = z.object({
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema,
  cityMunicipality: cityMunicipalitySchema,

  // Consent Information
  husbandConsentPerson: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    relationship: z.string().min(1, 'Relationship is required'),
    residence: z.string().min(1, 'Residence is required'),
  }),
  wifeConsentPerson: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    relationship: z.string().min(1, 'Relationship is required'),
    residence: z.string().min(1, 'Residence is required'),
  }),

  // Husband's Information
  husbandInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    age: z.number().min(18, 'Must be at least 18 years old'),
    dateOfBirth: dateSchema,
    placeOfBirth: z.object({
      province: provinceSchema,
      cityMunicipality: cityMunicipalitySchema,
      specificAddress: z.string().optional(),
    }),
    sex: z.enum(['male', 'female']).default('male'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    residence: z.string().min(1, 'Residence is required'),
    religion: z.string().optional(),
    civilStatus: z.enum(['single', 'widowed', 'divorced']),
  }),

  // Husband's Parents
  husbandParents: z.object({
    father: nameSchema,
    fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
    mother: nameSchema,
    motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  }),

  // Wife's Information
  wifeInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    age: z.number().min(18, 'Must be at least 18 years old'),
    dateOfBirth: dateSchema,
    placeOfBirth: z.object({
      province: provinceSchema,
      cityMunicipality: cityMunicipalitySchema,
      specificAddress: z.string().optional(),
    }),
    sex: z.enum(['male', 'female']).default('female'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    residence: z.string().min(1, 'Residence is required'),
    religion: z.string().optional(),
    civilStatus: z.enum(['single', 'widowed', 'divorced']),
  }),

  // Wife's Parents
  wifeParents: z.object({
    father: nameSchema,
    fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
    mother: nameSchema,
    motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  }),

  // Marriage Details
  marriageDetails: z.object({
    placeOfMarriage: z.object({
      office: z.string().min(1, 'Place of marriage is required'),
      region: z.string().min(1, 'Region is required'),
      cityMunicipality: cityMunicipalitySchema,
      province: provinceSchema,
    }),
    dateOfMarriage: dateSchema,
    timeOfMarriage: timeSchema,
  }),

  // Witnesses
  witnesses: z.object({
    husband: z
      .array(
        z.object({
          name: z.string().min(1, 'Witness name is required'),
          signature: z.string().optional(),
        })
      )
      .min(1, 'At least one witness for husband is required'),
    wife: z
      .array(
        z.object({
          name: z.string().min(1, 'Witness name is required'),
          signature: z.string().optional(),
        })
      )
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

export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;
