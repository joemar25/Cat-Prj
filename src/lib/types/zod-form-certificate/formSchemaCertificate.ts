import { z } from 'zod';

// Define the form schema
export const marriageCertificateSchema = z.object({
  // Registry Information
  registryNo: z.string(),
  province: z.string(),
  cityMunicipality: z.string(),

  // Husband's Information
  husbandFirstName: z.string(),
  husbandMiddleName: z.string(),
  husbandLastName: z.string(),
  husbandAge: z.string(),
  husbandDateOfBirth: z.date(),
  husbandPlaceOfBirth: z.object({
    cityMunicipality: z.string(),
    province: z.string(),
    country: z.string(),
  }),
  husbandCitizenship: z.string(),
  husbandResidence: z.string(),
  husbandReligion: z.string(),
  husbandCivilStatus: z.string(),
  husbandSex: z.string(),

  // Husband's Parents Information
  husbandFatherName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  husbandFatherCitizenship: z.string(),
  husbandMotherMaidenName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  husbandMotherCitizenship: z.string(),
  husbandConsentGivenBy: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  husbandConsentRelationship: z.string(),
  husbandConsentResidence: z.string(),
  husbandConsentContactNo: z.string(),

  // Wife's Information
  wifeFirstName: z.string(),
  wifeMiddleName: z.string(),
  wifeLastName: z.string(),
  wifeAge: z.string(),
  wifeDateOfBirth: z.date(),
  wifePlaceOfBirth: z.object({
    cityMunicipality: z.string(),
    province: z.string(),
    country: z.string(),
  }),
  wifeCitizenship: z.string(),
  wifeResidence: z.string(),
  wifeReligion: z.string(),
  wifeCivilStatus: z.string(),
  wifeSex: z.string(),

  // Wife's Parents Information
  wifeFatherName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  wifeFatherCitizenship: z.string(),
  wifeMotherMaidenName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  wifeMotherCitizenship: z.string(),
  wifeConsentGivenBy: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  wifeConsentRelationship: z.string(),
  wifeConsentResidence: z.string(),
  wifeConsentContactNo: z.string(), // Added this

  // Marriage Details
  placeOfMarriage: z.object({
    office: z.string(),
    cityMunicipality: z.string(),
    province: z.string(),
  }),
  dateOfMarriage: z.date(),
  timeOfMarriage: z.string(),

  // Marriage License Details
  marriageLicense: z.object({
    number: z.string(),
    dateIssued: z.date(),
    placeIssued: z.string(),
  }),

  // Witnesses
  witnesses: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
      })
    )
    .min(2),

  // Receipt Information
  receivedBy: z.object({
    name: z.string(),
    position: z.string(),
    date: z.date(),
  }),

  // Registration Information
  registeredBy: z.object({
    name: z.string(),
    position: z.string(),
    date: z.date(),
  }),

  remarks: z.string().optional(),
});

export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;

export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
