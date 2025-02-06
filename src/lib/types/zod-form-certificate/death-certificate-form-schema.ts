// death-certificate-form-schema.ts
import { z } from 'zod';
import {
  addressSchema,
  cityMunicipalitySchema,
  dateSchema,
  nameSchema,
  parseTimeStringToDate,
  provinceSchema,
  registryNumberSchema,
  signatureSchema,
  timeSchema,
  WithNullableDates,
} from './form-certificates-shared-schema';

export interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onSubmit?: (data: DeathCertificateFormValues) => void;
}

/**
 * The death certificate schema has been restructured so that address fields
 * (such as residence, placeOfDeath, certification.address, and informant.address)
 * use the shared `addressSchema` rather than custom objects.
 */
export const deathCertificateSchema = z.object({
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema(false),
  cityMunicipality: cityMunicipalitySchema,

  // Death Information
  timeOfDeath: timeSchema,

  // Personal Information
  personalInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    sex: z.string().min(1, 'Please select a sex'),
    dateOfDeath: dateSchema,
    dateOfBirth: dateSchema,
    ageAtDeath: z.object({
      years: z
        .string()
        .min(1, 'Years is required')
        .refine(
          (value) => /^\d+$/.test(value) && parseInt(value, 10) >= 0,
          'Years must be a non-negative number.'
        ),
      months: z
        .string()
        .optional()
        .refine(
          (value) =>
            !value || (/^\d+$/.test(value) && parseInt(value, 10) >= 0),
          'Months must be a non-negative number.'
        ),
      days: z
        .string()
        .optional()
        .refine(
          (value) =>
            !value || (/^\d+$/.test(value) && parseInt(value, 10) >= 0),
          'Days must be a non-negative number.'
        ),
      hours: z
        .string()
        .optional()
        .refine(
          (value) =>
            !value || (/^\d+$/.test(value) && parseInt(value, 10) >= 0),
          'Hours must be a non-negative number.'
        ),
    }),
    // Replace the custom placeOfDeath object with addressSchema
    placeOfDeath: addressSchema(false),
    civilStatus: z.string().min(1, 'Please select civil status'),
    religion: z.string().min(1, 'Religion is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    residence: addressSchema(false),
    occupation: z.string().min(1, 'Occupation is required'),
  }),

  // Family Information
  familyInfo: z.object({
    father: nameSchema,
    mother: nameSchema,
  }),

  // Medical Certificate
  medicalCertificate: z.object({
    causesOfDeath: z.object({
      immediate: z.string().min(1, 'Immediate cause of death is required'),
      antecedent: z.string().min(1, 'Antecedent cause is required'),
      underlying: z.string().min(1, 'Underlying cause is required'),
      contributingConditions: z.string().optional(),
    }),
    maternalCondition: z.string().optional(),
    externalCauses: z.object({
      mannerOfDeath: z.string().min(1, 'Manner of death is required'),
      placeOfOccurrence: z.string().min(1, 'Place of occurrence is required'),
    }),
  }),

  // Medical Attendance
  attendant: z.object({
    type: z.string().min(1, 'Please select attendant type'),
    attendance: z.object({
      from: dateSchema,
      to: dateSchema,
    }),
  }),

  // Certification
  certification: z.object({
    hasAttended: z.string().min(1, 'Please indicate if you attended'),
    signature: signatureSchema.shape.signature,
    name: signatureSchema.shape.name,
    title: signatureSchema.shape.title,
    // Use addressSchema for the certifier's address:
    address: addressSchema(false),
    date: dateSchema,
    reviewedBy: z.object({
      name: signatureSchema.shape.name,
      title: signatureSchema.shape.title,
      position: z.string().min(1, 'Reviewer position is required'),
      date: dateSchema,
    }),
  }),

  // Disposal Information
  disposal: z.object({
    method: z.string().min(1, 'Disposal method is required'),
    burialPermit: z.object({
      number: z.string().min(1, 'Burial permit number is required'),
      dateIssued: dateSchema,
    }),
    transferPermit: z.object({
      number: z.string().optional(),
      dateIssued: dateSchema.optional().nullable(),
    }),
    cemeteryAddress: z.string().min(1, 'Cemetery address is required'),
  }),

  // Informant Details
  informant: z.object({
    signature: signatureSchema.shape.signature,
    name: signatureSchema.shape.name,
    relationship: z.string().min(1, 'Relationship to deceased is required'),
    // Use addressSchema for the informant's address:
    address: addressSchema(false),
    date: dateSchema,
  }),

  // Administrative Information
  preparedBy: signatureSchema,
  receivedBy: signatureSchema,
  registeredAtCivilRegistrar: signatureSchema,

  remarks: z.string().optional(),
});

export type DeathCertificateFormValues = WithNullableDates<
  z.infer<typeof deathCertificateSchema>
>;

export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
  // Registry Information
  registryNumber: '2024-00001',
  province: 'Metro Manila',
  cityMunicipality: 'Quezon City',

  // Death Information
  timeOfDeath: parseTimeStringToDate('14:30'),

  // Personal Information
  personalInfo: {
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    sex: 'Male',
    dateOfDeath: new Date('2024-01-20'),
    dateOfBirth: new Date('1950-05-15'),
    ageAtDeath: {
      years: '73',
      months: '8',
      days: '5',
      hours: '3',
    },
    // Update placeOfDeath to use addressSchema fields:
    placeOfDeath: {
      houseNumber: '',
      street: "St. Luke's Medical Center, E Rodriguez Sr. Ave",
      barangay: '',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
    civilStatus: 'Married',
    religion: 'Roman Catholic',
    citizenship: 'Filipino',
    // Update residence to follow addressSchema:
    residence: {
      houseNumber: '123',
      street: 'Maginhawa Street, Teachers Village',
      barangay: '',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
    occupation: 'Retired Teacher',
  },

  // Family Information
  familyInfo: {
    father: {
      firstName: 'Pedro',
      middleName: 'Martinez',
      lastName: 'Dela Cruz',
    },
    mother: {
      firstName: 'Maria',
      middleName: 'Santos',
      lastName: 'Garcia',
    },
  },

  // Medical Certificate
  medicalCertificate: {
    causesOfDeath: {
      immediate: 'Cardiac Arrest',
      antecedent: 'Acute Myocardial Infarction',
      underlying: 'Coronary Artery Disease',
      contributingConditions: 'Diabetes Mellitus, Type 2',
    },
    maternalCondition: '',
    externalCauses: {
      mannerOfDeath: 'Natural',
      placeOfOccurrence: 'Hospital',
    },
  },

  // Medical Attendance
  attendant: {
    type: 'Physician',
    attendance: {
      from: new Date('2024-01-18'),
      to: new Date('2024-01-20'),
    },
  },

  // Certification
  certification: {
    hasAttended: 'Yes',
    signature: 'DrSantos',
    name: 'Dr. Ana Santos',
    title: 'Attending Physician',
    address: {
      houseNumber: '',
      street: "St. Luke's Medical Center, E Rodriguez Sr. Ave",
      barangay: '',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
    date: new Date('2024-01-20'),
    reviewedBy: {
      name: 'Dr. Jose Reyes',
      title: 'Chief of Hospital',
      position: 'Department Head',
      date: new Date('2024-01-20'),
    },
  },

  // Disposal Information
  disposal: {
    method: 'Burial',
    burialPermit: {
      number: 'BP-2024-001',
      dateIssued: new Date('2024-01-21'),
    },
    transferPermit: {
      number: '',
      dateIssued: null,
    },
    cemeteryAddress: 'Himlayang Pilipino Memorial Park, Quezon City',
  },

  // Informant Details
  informant: {
    signature: 'MCruz',
    name: 'Maria Cruz',
    relationship: 'Spouse',
    address: {
      houseNumber: '',
      street: '123 Maginhawa Street, Teachers Village',
      barangay: '',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
    date: new Date('2024-01-20'),
  },

  // Administrative Information
  preparedBy: {
    signature: 'Staff3',
    name: 'Staff User 3',
    title: 'Registration Officer',
    date: new Date('2024-01-21'),
  },
  receivedBy: {
    signature: 'Staff4',
    name: 'Staff User 4',
    title: 'Document Processing Officer',
    date: new Date('2024-01-21'),
  },
  registeredAtCivilRegistrar: {
    signature: 'Admin1',
    name: 'Admin User 1',
    title: 'Civil Registrar',
    date: new Date('2024-01-21'),
  },

  // Remarks
  remarks: 'Document processed and verified.',
};
