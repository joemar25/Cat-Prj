import { z } from 'zod';
import {
  addressSchema,
  cityMunicipalitySchema,
  dateSchema,
  nameSchema,
  provinceSchema,
  registryNumberSchema,
  signatureSchema,
  timeSchema,
} from './form-certificates-shared-schema';

export interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onSubmit?: (data: DeathCertificateFormValues) => void;
}

export const deathCertificateSchema = z.object({
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema,
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
    placeOfDeath: z.object({
      province: provinceSchema,
      cityMunicipality: cityMunicipalitySchema,
      specificAddress: z
        .string()
        .max(200, 'Specific address must not exceed 200 characters')
        .optional(),
    }),
    civilStatus: z.string().min(1, 'Please select civil status'),
    religion: z.string().min(1, 'Religion is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    residence: z.string().min(1, 'Residence is required'),
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
    address: addressSchema.shape.address,
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
      dateIssued: dateSchema.optional(),
    }),
    cemeteryAddress: z.string().min(1, 'Cemetery address is required'),
  }),

  // Informant Details
  informant: z.object({
    signature: signatureSchema.shape.signature,
    name: signatureSchema.shape.name,
    relationship: z.string().min(1, 'Relationship to deceased is required'),
    address: addressSchema.shape.address,
    date: dateSchema,
  }),

  // Administrative Information
  preparedBy: signatureSchema,
  receivedBy: signatureSchema,
  registeredAtCivilRegistrar: signatureSchema,

  remarks: z.string().optional(),
});

export type DeathCertificateFormValues = z.infer<typeof deathCertificateSchema>;

export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
  // Registry Information
  registryNumber: '',
  province: '',
  cityMunicipality: '',

  // Death Information
  timeOfDeath: '',

  // Personal Information
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    dateOfDeath: '',
    dateOfBirth: '',
    ageAtDeath: {
      years: '',
      months: '',
      days: '',
      hours: '',
    },
    placeOfDeath: {
      province: '',
      cityMunicipality: '',
      specificAddress: '',
    },
    civilStatus: '',
    religion: '',
    citizenship: '',
    residence: '',
    occupation: '',
  },

  // Family Information
  familyInfo: {
    father: {
      firstName: '',
      middleName: '',
      lastName: '',
    },
    mother: {
      firstName: '',
      middleName: '',
      lastName: '',
    },
  },

  // Medical Certificate
  medicalCertificate: {
    causesOfDeath: {
      immediate: '',
      antecedent: '',
      underlying: '',
      contributingConditions: '',
    },
    maternalCondition: '',
    externalCauses: {
      mannerOfDeath: '',
      placeOfOccurrence: '',
    },
  },

  // Medical Attendance
  attendant: {
    type: '',
    attendance: {
      from: '',
      to: '',
    },
  },

  // Certification
  certification: {
    hasAttended: '',
    signature: '',
    name: '',
    title: '',
    address: '',
    date: '',
    reviewedBy: {
      name: '',
      title: '',
      position: '',
      date: '',
    },
  },

  // Disposal Information
  disposal: {
    method: '',
    burialPermit: {
      number: '',
      dateIssued: '',
    },
    transferPermit: {
      number: '',
      dateIssued: '',
    },
    cemeteryAddress: '',
  },

  // Informant Details
  informant: {
    signature: '',
    name: '',
    relationship: '',
    address: '',
    date: '',
  },

  // Administrative Information
  preparedBy: {
    signature: '',
    name: '',
    title: '',
    date: '',
  },

  receivedBy: {
    signature: '',
    name: '',
    title: '',
    date: '',
  },

  registeredAtCivilRegistrar: {
    name: '',
    title: '',
    date: '',
  },

  // Remarks
  remarks: '',
};

// export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
//   // Registry Information
//   registryNumber: '2023-123456',
//   province: 'Metro Manila',
//   cityMunicipality: 'Quezon City',

//   // Death Information
//   timeOfDeath: '14:30',

//   // Personal Information
//   personalInfo: {
//     firstName: 'Juan',
//     middleName: 'Dela',
//     lastName: 'Cruz',
//     sex: 'Male',
//     dateOfDeath: '10/15/2023',
//     dateOfBirth: '05/20/1950',
//     ageAtDeath: {
//       years: '73',
//       months: '4',
//       days: '25',
//       hours: '12',
//     },
//     placeOfDeath: {
//       province: 'Metro Manila',
//       cityMunicipality: 'Quezon City',
//       specificAddress: '123 Main Street',
//     },
//     civilStatus: 'Married',
//     religion: 'Roman Catholic',
//     citizenship: 'Filipino',
//     residence: '456 Elm Street, Quezon City',
//     occupation: 'Retired Teacher',
//   },

//   // Family Information
//   familyInfo: {
//     father: {
//       firstName: 'Pedro',
//       middleName: 'Sanchez',
//       lastName: 'Cruz',
//     },
//     mother: {
//       firstName: 'Maria',
//       middleName: 'Dela',
//       lastName: 'Cruz',
//     },
//   },

//   // Medical Certificate
//   medicalCertificate: {
//     causesOfDeath: {
//       immediate: 'Cardiac Arrest',
//       antecedent: 'Hypertension',
//       underlying: 'Diabetes Mellitus',
//       contributingConditions: 'Obesity',
//     },
//     maternalCondition: 'N/A',
//     externalCauses: {
//       mannerOfDeath: 'Natural',
//       placeOfOccurrence: 'Home',
//     },
//   },

//   // Medical Attendance
//   attendant: {
//     type: 'Physician',
//     attendance: {
//       from: '10/10/2023',
//       to: '10/15/2023',
//     },
//   },

//   // Certification
//   certification: {
//     hasAttended: 'Yes',
//     signature: 'Dr. John Doe',
//     name: 'Dr. John Doe',
//     title: 'Medical Doctor',
//     address: '789 Health Center, Quezon City',
//     date: '10/16/2023',
//     reviewedBy: {
//       name: 'Dr. Jane Smith',
//       title: 'Chief Medical Officer',
//       position: 'Head of Department',
//       date: '10/16/2023',
//     },
//   },

//   // Disposal Information
//   disposal: {
//     method: 'Burial',
//     burialPermit: {
//       number: 'BP-2023-123',
//       dateIssued: '10/16/2023',
//     },
//     transferPermit: {
//       number: 'TP-2023-456',
//       dateIssued: '10/16/2023',
//     },
//     cemeteryAddress: 'Heavenly Gardens Memorial Park, Quezon City',
//   },

//   // Informant Details
//   informant: {
//     signature: 'Maria Cruz',
//     name: 'Maria Cruz',
//     relationship: 'Spouse',
//     address: '456 Elm Street, Quezon City',
//     date: '10/16/2023',
//   },

//   // Administrative Information
//   preparedBy: {
//     signature: 'Juan Dela Cruz Jr.',
//     name: 'Juan Dela Cruz Jr.',
//     title: 'Son',
//     date: '10/16/2023',
//   },

//   receivedBy: {
//     signature: 'Officer Juan',
//     name: 'Officer Juan',
//     title: 'Civil Registrar',
//     date: '10/16/2023',
//   },

//   registeredAtCivilRegistrar: {
//     name: 'Quezon City Civil Registry',
//     title: 'Civil Registry Office',
//     date: '10/16/2023',
//   },

//   // Remarks
//   remarks: 'Deceased was a respected member of the community.',
// };
