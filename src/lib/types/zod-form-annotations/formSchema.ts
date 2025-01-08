import { z } from 'zod';

export interface BirthAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export const birthAnnotationSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  childFirstName: z.string().min(1, 'First name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Last name is required'),
  sex: z.string().min(1, 'Sex is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  motherName: z.string().min(1, "Mother's name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  parentsMarriageDate: z.date({
    required_error: 'Marriage date is required',
  }),
  parentsMarriagePlace: z.string().min(1, 'Marriage place is required'),
  remarks: z.string().optional(),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  verifiedBy: z.string().min(1, 'Verified by is required'),
});

export type BirthAnnotationFormValues = z.infer<typeof birthAnnotationSchema>;
