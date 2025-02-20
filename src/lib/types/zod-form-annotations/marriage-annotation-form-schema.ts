//src\lib\types\zod-form-annotations\marriage-annotation-form-schema.ts
import { z } from 'zod'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'

export interface MarriageAnnotationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
}

export interface ExtendedMarriageAnnotationFormProps extends MarriageAnnotationFormProps {
  formData: BaseRegistryFormWithRelations
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
})

export type MarriageAnnotationFormValues = z.infer<
  typeof marriageAnnotationSchema
>
