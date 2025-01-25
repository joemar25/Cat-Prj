import { z } from 'zod';

export interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onSubmit?: (data: DeathCertificateFormValues) => void;
}

export const deathCertificateSchema = z.object({
  // Registry Information
  registryNumber: z
    .string()
    .regex(
      /^\d{4}-\d+$/, // Enforces YYYY- followed by one or more digits
      'Registry number must be in the format: YYYY-numbers (e.g., 2025-123456).'
    )
    .refine(
      (value) => {
        const year = parseInt(value.split('-')[0]);
        const currentYear = new Date().getFullYear();
        return year >= 1945 && year <= currentYear;
      },
      {
        message: 'The year must be between 1945 and the current year.',
      }
    )
    .refine(
      (value) => {
        const sequenceNumber = parseInt(value.split('-')[1]);
        return sequenceNumber > 0; // Enforce positive numbers only
      },
      {
        message: 'The sequence number must be a positive number.',
      }
    ),
  province: z
    .string()
    .min(1, 'Please select a province.')
    .max(100, 'Province name is too long.'),
  cityMunicipality: z
    .string()
    .min(1, 'Please select a city or municipality.')
    .max(100, 'City/Municipality name is too long.'),

  // Death Information
  timeOfDeath: z
    .string()
    .min(1, 'Time of death is required')
    .refine((value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message: 'Please enter a valid time in HH:MM format (e.g., 14:30).',
    }),

  // Personal Information
  personalInfo: z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name is too long'),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name is too long'),
    sex: z.string().min(1, 'Please select a sex'),
    dateOfDeath: z
      .string()
      .min(1, 'Date of death is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
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
      province: z.string().min(1, 'Province is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
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
    father: z.object({
      firstName: z.string().min(1, "Father's first name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Father's last name is required"),
    }),
    mother: z.object({
      firstName: z.string().min(1, "Mother's first name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Mother's last name is required"),
    }),
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
      from: z
        .string()
        .min(1, 'Start date is required')
        .refine(
          (value) => {
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
            const [month, day, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              date.getMonth() === month - 1 &&
              date.getDate() === day &&
              date.getFullYear() === year &&
              date <= new Date() // Ensure the date is not in the future
            );
          },
          {
            message: 'Please enter a valid start date in MM/DD/YYYY format.',
          }
        ),
      to: z
        .string()
        .min(1, 'End date is required')
        .refine(
          (value) => {
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
            const [month, day, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              date.getMonth() === month - 1 &&
              date.getDate() === day &&
              date.getFullYear() === year &&
              date <= new Date() // Ensure the date is not in the future
            );
          },
          {
            message: 'Please enter a valid end date in MM/DD/YYYY format.',
          }
        ),
    }),
  }),

  // Certification
  certification: z.object({
    hasAttended: z.string().min(1, 'Please indicate if you attended'),
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    address: z.string().min(1, 'Address is required'),
    date: z
      .string()
      .min(1, 'Date is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
    reviewedBy: z.object({
      name: z.string().min(1, 'Reviewer name is required'),
      title: z.string().min(1, 'Reviewer title is required'),
      position: z.string().min(1, 'Reviewer position is required'),
      date: z
        .string()
        .min(1, 'Review date is required')
        .refine(
          (value) => {
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
            const [month, day, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              date.getMonth() === month - 1 &&
              date.getDate() === day &&
              date.getFullYear() === year &&
              date <= new Date()
            );
          },
          {
            message: 'Please enter a valid date in MM/DD/YYYY format.',
          }
        ),
    }),
  }),

  // Disposal Information
  disposal: z.object({
    method: z.string().min(1, 'Disposal method is required'),
    burialPermit: z.object({
      number: z.string().min(1, 'Burial permit number is required'),
      dateIssued: z
        .string()
        .min(1, 'Date issued is required')
        .refine(
          (value) => {
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
            const [month, day, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              date.getMonth() === month - 1 &&
              date.getDate() === day &&
              date.getFullYear() === year &&
              date <= new Date()
            );
          },
          {
            message: 'Please enter a valid date in MM/DD/YYYY format.',
          }
        ),
    }),
    transferPermit: z.object({
      number: z.string().optional(),
      dateIssued: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) return true;
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
            const [month, day, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              date.getMonth() === month - 1 &&
              date.getDate() === day &&
              date.getFullYear() === year &&
              date <= new Date()
            );
          },
          {
            message: 'Please enter a valid date in MM/DD/YYYY format.',
          }
        ),
    }),
    cemeteryAddress: z.string().min(1, 'Cemetery address is required'),
  }),

  // Informant Details
  informant: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Informant name is required'),
    relationship: z.string().min(1, 'Relationship to deceased is required'),
    address: z.string().min(1, 'Address is required'),
    date: z
      .string()
      .min(1, 'Date is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
  }),

  // Administrative Information
  preparedBy: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z
      .string()
      .min(1, 'Date is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
  }),

  receivedBy: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z
      .string()
      .min(1, 'Date is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
  }),

  registeredAtCivilRegistrar: z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    date: z
      .string()
      .min(1, 'Date is required')
      .refine(
        (value) => {
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
          const [month, day, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          return (
            date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getFullYear() === year &&
            date <= new Date()
          );
        },
        {
          message: 'Please enter a valid date in MM/DD/YYYY format.',
        }
      ),
  }),

  remarks: z.string().optional(),
});

export type DeathCertificateFormValues = z.infer<typeof deathCertificateSchema>;

// export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
//   // Registry Information
//   registryNumber: '',
//   province: '',
//   cityMunicipality: '',

//   // Death Information
//   timeOfDeath: '',

//   // Personal Information
//   personalInfo: {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     sex: '',
//     dateOfDeath: '',
//     dateOfBirth: '',
//     ageAtDeath: {
//       years: '',
//       months: '',
//       days: '',
//       hours: '',
//     },
//     placeOfDeath: {
//       province: '',
//       cityMunicipality: '',
//       specificAddress: '',
//     },
//     civilStatus: '',
//     religion: '',
//     citizenship: '',
//     residence: '',
//     occupation: '',
//   },

//   // Family Information
//   familyInfo: {
//     father: {
//       firstName: '',
//       middleName: '',
//       lastName: '',
//     },
//     mother: {
//       firstName: '',
//       middleName: '',
//       lastName: '',
//     },
//   },

//   // Medical Certificate
//   medicalCertificate: {
//     causesOfDeath: {
//       immediate: '',
//       antecedent: '',
//       underlying: '',
//       contributingConditions: '',
//     },
//     maternalCondition: '',
//     externalCauses: {
//       mannerOfDeath: '',
//       placeOfOccurrence: '',
//     },
//   },

//   // Medical Attendance
//   attendant: {
//     type: '',
//     attendance: {
//       from: '',
//       to: '',
//     },
//   },

//   // Certification
//   certification: {
//     hasAttended: '',
//     signature: '',
//     name: '',
//     title: '',
//     address: '',
//     date: '',
//     reviewedBy: {
//       name: '',
//       title: '',
//       position: '',
//       date: '',
//     },
//   },

//   // Disposal Information
//   disposal: {
//     method: '',
//     burialPermit: {
//       number: '',
//       dateIssued: '',
//     },
//     transferPermit: {
//       number: '',
//       dateIssued: '',
//     },
//     cemeteryAddress: '',
//   },

//   // Informant Details
//   informant: {
//     signature: '',
//     name: '',
//     relationship: '',
//     address: '',
//     date: '',
//   },

//   // Administrative Information
//   preparedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: '',
//   },

//   receivedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: '',
//   },

//   registeredAtCivilRegistrar: {
//     name: '',
//     title: '',
//     date: '',
//   },

//   // Remarks
//   remarks: '',
// };

export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
  // Registry Information
  registryNumber: '2023-123456',
  province: 'Metro Manila',
  cityMunicipality: 'Quezon City',

  // Death Information
  timeOfDeath: '14:30',

  // Personal Information
  personalInfo: {
    firstName: 'Juan',
    middleName: 'Dela',
    lastName: 'Cruz',
    sex: 'Male',
    dateOfDeath: '10/15/2023',
    dateOfBirth: '05/20/1950',
    ageAtDeath: {
      years: '73',
      months: '4',
      days: '25',
      hours: '12',
    },
    placeOfDeath: {
      province: 'Metro Manila',
      cityMunicipality: 'Quezon City',
      specificAddress: '123 Main Street',
    },
    civilStatus: 'Married',
    religion: 'Roman Catholic',
    citizenship: 'Filipino',
    residence: '456 Elm Street, Quezon City',
    occupation: 'Retired Teacher',
  },

  // Family Information
  familyInfo: {
    father: {
      firstName: 'Pedro',
      middleName: 'Sanchez',
      lastName: 'Cruz',
    },
    mother: {
      firstName: 'Maria',
      middleName: 'Dela',
      lastName: 'Cruz',
    },
  },

  // Medical Certificate
  medicalCertificate: {
    causesOfDeath: {
      immediate: 'Cardiac Arrest',
      antecedent: 'Hypertension',
      underlying: 'Diabetes Mellitus',
      contributingConditions: 'Obesity',
    },
    maternalCondition: 'N/A',
    externalCauses: {
      mannerOfDeath: 'Natural',
      placeOfOccurrence: 'Home',
    },
  },

  // Medical Attendance
  attendant: {
    type: 'Physician',
    attendance: {
      from: '10/10/2023',
      to: '10/15/2023',
    },
  },

  // Certification
  certification: {
    hasAttended: 'Yes',
    signature: 'Dr. John Doe',
    name: 'Dr. John Doe',
    title: 'Medical Doctor',
    address: '789 Health Center, Quezon City',
    date: '10/16/2023',
    reviewedBy: {
      name: 'Dr. Jane Smith',
      title: 'Chief Medical Officer',
      position: 'Head of Department',
      date: '10/16/2023',
    },
  },

  // Disposal Information
  disposal: {
    method: 'Burial',
    burialPermit: {
      number: 'BP-2023-123',
      dateIssued: '10/16/2023',
    },
    transferPermit: {
      number: 'TP-2023-456',
      dateIssued: '10/16/2023',
    },
    cemeteryAddress: 'Heavenly Gardens Memorial Park, Quezon City',
  },

  // Informant Details
  informant: {
    signature: 'Maria Cruz',
    name: 'Maria Cruz',
    relationship: 'Spouse',
    address: '456 Elm Street, Quezon City',
    date: '10/16/2023',
  },

  // Administrative Information
  preparedBy: {
    signature: 'Juan Dela Cruz Jr.',
    name: 'Juan Dela Cruz Jr.',
    title: 'Son',
    date: '10/16/2023',
  },

  receivedBy: {
    signature: 'Officer Juan',
    name: 'Officer Juan',
    title: 'Civil Registrar',
    date: '10/16/2023',
  },

  registeredAtCivilRegistrar: {
    name: 'Quezon City Civil Registry',
    title: 'Civil Registry Office',
    date: '10/16/2023',
  },

  // Remarks
  remarks: 'Deceased was a respected member of the community.',
};
