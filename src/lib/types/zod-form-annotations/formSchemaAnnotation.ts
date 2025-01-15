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

export const deathAnnotationSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  nameOfDeceased: z.string().min(1, 'Name of deceased is required'),
  sex: z.string().min(1, 'Sex is required'),
  age: z.number().min(0, 'Age must be a positive number'),
  civilStatus: z.string().min(1, 'Civil status is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  dateOfDeath: z.date({
    required_error: 'Date of death is required',
  }),
  placeOfDeath: z.string().min(1, 'Place of death is required'),
  causeOfDeath: z.string().min(1, 'Cause of death is required'),
  issuedTo: z.string().min(1, 'Issued to is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  remarks: z.string().optional(),
  preparedByName: z.string().min(1, 'Prepared by name is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedByName: z.string().min(1, 'Verified by name is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
  civilRegistrar: z.string().min(1, 'Civil registrar is required'),
  civilRegistrarPosition: z
    .string()
    .min(1, 'Civil registrar position is required'),
  amountPaid: z.number().min(0, 'Amount paid must be a positive number'),
  orNumber: z.string().optional(),
  datePaid: z.date().optional(),
});

export type DeathAnnotationFormValues = z.infer<typeof deathAnnotationSchema>;
export const deathAnnotationDefaultValues: DeathAnnotationFormValues = {
  pageNumber: '1',
  bookNumber: '1',
  registryNumber: 'D-2023-001',
  dateOfRegistration: new Date(),
  nameOfDeceased: 'John Doe',
  sex: 'Male',
  age: 45,
  civilStatus: 'Married',
  citizenship: 'Filipino',
  dateOfDeath: new Date(),
  placeOfDeath: 'City Hospital',
  causeOfDeath: 'Heart Attack',
  issuedTo: 'Jane Doe',
  purpose: 'Legal Purposes',
  remarks: 'N/A',
  preparedByName: 'Clerk Name',
  preparedByPosition: 'Clerk',
  verifiedByName: 'Verifier Name',
  verifiedByPosition: 'Verifier',
  civilRegistrar: 'Registrar Name',
  civilRegistrarPosition: 'Civil Registrar',
  amountPaid: 100,
  orNumber: 'OR-2023-001',
  datePaid: new Date(),
};
