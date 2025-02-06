//src\lib\types\zod-form-annotations\marriage-annotation-form-schema.ts
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action';
import { Row } from '@tanstack/react-table';
import { z } from 'zod';
import {
  MarriagePlaceStructure,
  NameStructure,
  PlaceStructure,
} from './form-annotation-shared-interfaces';


export interface MarriageAnnotationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
}

export interface ExtendedMarriageAnnotationFormProps extends MarriageAnnotationFormProps {
  formData: BaseRegistryFormWithRelations
}

export interface MarriageCertificateForm {
  id: string;
  baseFormId: string;
  husbandFirstName: string;
  husbandMiddleName: string;
  husbandLastName: string;
  husbandDateOfBirth: string | Date;
  husbandAge: number;
  husbandPlaceOfBirth: PlaceStructure;
  husbandSex: string;
  husbandCitizenship: string;
  husbandResidence: string;
  husbandReligion: string;
  husbandCivilStatus: string;
  husbandFatherName: NameStructure;
  husbandMotherMaidenName: NameStructure;
  husbandFatherCitizenship: string;
  husbandMotherCitizenship: string;
  wifeFirstName: string;
  wifeMiddleName: string;
  wifeLastName: string;
  wifeDateOfBirth: string | Date;
  wifeAge: number;
  wifePlaceOfBirth: PlaceStructure;
  wifeSex: string;
  wifeCitizenship: string;
  wifeResidence: string;
  wifeReligion: string;
  wifeCivilStatus: string;
  wifeFatherName: NameStructure;
  wifeMotherMaidenName: NameStructure;
  wifeFatherCitizenship: string;
  wifeMotherCitizenship: string;
  placeOfMarriage: MarriagePlaceStructure;
  dateOfMarriage: string | Date;
  timeOfMarriage: string;
  marriageSettlement: boolean;
}

export const marriageAnnotationSchema = z.object({
  // Base Form Fields (matching civilRegistryFormBase)
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  issuedTo: z.string().min(1, 'Issued to is required'),
  purpose: z.string().min(1, 'Purpose is required'),

  // Officials Information
  preparedByName: z.string().min(1, 'Prepared by name is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedByName: z.string().min(1, 'Verified by name is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
  civilRegistrar: z.string().min(1, 'Civil registrar is required'),
  civilRegistrarPosition: z
    .string()
    .min(1, 'Civil registrar position is required'),

  // Payment Information
  amountPaid: z.number().min(0, 'Amount paid must be a positive number'),
  orNumber: z.string().optional(),
  datePaid: z.date().optional(),

  // Marriage Form Specific Fields
  husbandName: z.string().min(1, "Husband's name is required"),
  husbandDateOfBirthAge: z
    .string()
    .min(1, "Husband's Date of Birth/Age is required"),
  husbandCitizenship: z.string().min(1, "Husband's citizenship is required"),
  husbandCivilStatus: z.string().min(1, "Husband's civil status is required"),
  husbandMother: z.string().min(1, "Husband's mother's name is required"),
  husbandFather: z.string().min(1, "Husband's father's name is required"),

  wifeName: z.string().min(1, "Wife's name is required"),
  wifeDateOfBirthAge: z.string().min(1, "Wife's Date of Birth/Age is required"),
  wifeCitizenship: z.string().min(1, "Wife's citizenship is required"),
  wifeCivilStatus: z.string().min(1, "Wife's civil status is required"),
  wifeMother: z.string().min(1, "Wife's mother's name is required"),
  wifeFather: z.string().min(1, "Wife's father's name is required"),

  dateOfMarriage: z.date({
    required_error: 'Marriage date is required',
  }),
  placeOfMarriage: z.string().min(1, 'Place of marriage is required'),
});

export type MarriageAnnotationFormValues = z.infer<
  typeof marriageAnnotationSchema
>;
