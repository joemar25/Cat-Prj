// src/lib/types/zod-form-annotations/birth-annotation-form-schema.ts
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { z } from 'zod'
import {
  BaseForm,
  NameStructure,
  ParentMarriageStructure,
  PlaceStructure,
} from './form-annotation-shared-interfaces'
export interface BirthAnnotationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
}

export interface ExtendedBirthAnnotationFormProps extends BirthAnnotationFormProps {
  formData?: BaseRegistryFormWithRelations
}

export interface BirthAnnotationFormStructure extends BaseForm {
  childName: NameStructure
  sex: string
  dateOfBirth: string | Date
  placeOfBirth: PlaceStructure | string
  motherMaidenName: NameStructure
  motherCitizenship: string
  fatherName: NameStructure
  fatherCitizenship: string
  parentMarriage?: ParentMarriageStructure
  remarks?: string
}

export const BirthAnnotationFormSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.string().min(1, 'Date of registration is required'),
  childFirstName: z.string().min(1, 'Child first name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Child last name is required'),
  sex: z.enum(['Male', 'Female', 'Other'], { required_error: 'Sex is required' }).optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  motherName: z.string().min(1, "Mother's name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  parentsMarriageDate: z.string().min(1, 'Date of marriage of parents is required'),
  parentsMarriagePlace: z.string().min(1, 'Place of marriage of parents is required'),
  remarks: z.string().optional(),
  preparedBy: z.string().min(1, 'Prepared by name is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedBy: z.string().min(1, 'Verified by name is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
})

export type BirthAnnotationFormValues = z.infer<typeof BirthAnnotationFormSchema>
