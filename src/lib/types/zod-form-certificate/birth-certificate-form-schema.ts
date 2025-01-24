// src\lib\types\zod-form-certificate\birth-certificate-form-schema.ts

import { z } from 'zod';

export interface BirthCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export const birthCertificateSchema = z.object({
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

  // Child Information
  childInfo: z.object({
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
    dateOfBirth: z
      .string()
      .min(1, 'Birth date is required')
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
          message: 'Please enter a valid birth date in MM/DD/YYYY format.',
        }
      ),
    placeOfBirth: z.object({
      hospital: z.string().min(1, 'Hospital/Clinic name is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
    }),
    typeOfBirth: z.string().min(1, 'Please select type of birth'),
    multipleBirthOrder: z.string().optional(),
    birthOrder: z.string().min(1, 'Birth order is required'),
    weightAtBirth: z.string().min(1, 'Weight at birth is required'),
  }),

  // Mother Information
  motherInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    totalChildrenBornAlive: z.string().min(1, 'Required'),
    childrenStillLiving: z.string().min(1, 'Required'),
    childrenNowDead: z.string().min(1, 'Required'),
    residence: z.object({
      address: z.string().min(1, 'Address is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  // Father Information
  fatherInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    residence: z.object({
      address: z.string().min(1, 'Address is required'),
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  // Marriage of Parents
  parentMarriage: z.object({
    date: z
      .string()
      .min(1, 'Marriage date is required')
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
          message: 'Please enter a valid marriage date in MM/DD/YYYY format.',
        }
      ),
    place: z.object({
      cityMunicipality: z.string().min(1, 'City/Municipality is required'),
      province: z.string().min(1, 'Province is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  // Certification of Birth Attendant
  attendant: z.object({
    type: z.string().min(1, 'Please select attendant type'),
    certification: z.object({
      time: z
        .string()
        .min(1, 'Time of birth is required')
        .refine((value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
          message: 'Please enter a valid time in HH:MM format (e.g., 14:30).',
        }),
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
    }),
  }),

  // Informant
  informant: z.object({
    signature: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
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

  // Prepared By
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

  // Received By
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

  // Registered By Civil Registry
  registeredByOffice: z.object({
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

  remarks: z.string().optional(),
});

// Type inference
export type BirthCertificateFormValues = z.infer<typeof birthCertificateSchema>;

export const defaultBirthCertificateFormValues: BirthCertificateFormValues = {
  // Registry Information
  registryNumber: '',
  province: '',
  cityMunicipality: '',

  // Child Information
  childInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    dateOfBirth: '',
    placeOfBirth: {
      hospital: '',
      cityMunicipality: '',
      province: '',
    },
    typeOfBirth: '',
    multipleBirthOrder: '',
    birthOrder: '',
    weightAtBirth: '',
  },

  // Mother Information
  motherInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    citizenship: '',
    religion: '',
    occupation: '',
    age: '',
    totalChildrenBornAlive: '',
    childrenStillLiving: '',
    childrenNowDead: '',
    residence: {
      address: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
  },

  // Father Information
  fatherInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    citizenship: '',
    religion: '',
    occupation: '',
    age: '',
    residence: {
      address: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
  },

  // Marriage of Parents
  parentMarriage: {
    date: '',
    place: {
      cityMunicipality: '',
      province: '',
      country: '',
    },
  },

  // Birth Attendant
  attendant: {
    type: '',
    certification: {
      time: '',
      signature: '',
      name: '',
      title: '',
      address: '',
      date: '',
    },
  },

  // Informant
  informant: {
    signature: '',
    name: '',
    relationship: '',
    address: '',
    date: '',
  },

  // Prepared By
  preparedBy: {
    signature: '',
    name: '',
    title: '',
    date: '',
  },

  // Received By
  receivedBy: {
    signature: '',
    name: '',
    title: '',
    date: '',
  },

  // Registered By Civil Registry
  registeredByOffice: {
    signature: '',
    name: '',
    title: '',
    date: '',
  },

  // Remarks
  remarks: '',
};

//For testing purposes

// export const defaultBirthCertificateFormValues: BirthCertificateFormValues = {
//   // Registry Information
//   registryNumber: '2023-123456',
//   province: 'Metro Manila',
//   cityMunicipality: 'Manila',

//   // Child Information
//   childInfo: {
//     firstName: 'Juan',
//     middleName: 'Dela',
//     lastName: 'Cruz',
//     sex: 'Male',
//     dateOfBirth: '01/15/2023',
//     placeOfBirth: {
//       hospital: 'Manila General Hospital',
//       cityMunicipality: 'Manila',
//       province: 'Metro Manila',
//     },
//     typeOfBirth: 'Single',
//     multipleBirthOrder: '',
//     birthOrder: '1',
//     weightAtBirth: '3.5',
//   },

//   // Mother Information
//   motherInfo: {
//     firstName: 'Maria',
//     middleName: 'Santos',
//     lastName: 'Dela Cruz',
//     citizenship: 'Filipino',
//     religion: 'Roman Catholic',
//     occupation: 'Teacher',
//     age: '30',
//     totalChildrenBornAlive: '2',
//     childrenStillLiving: '2',
//     childrenNowDead: '0',
//     residence: {
//       address: '123 Main Street',
//       cityMunicipality: 'Manila',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//   },

//   // Father Information
//   fatherInfo: {
//     firstName: 'Pedro',
//     middleName: 'Dela',
//     lastName: 'Cruz',
//     citizenship: 'Filipino',
//     religion: 'Roman Catholic',
//     occupation: 'Engineer',
//     age: '35',
//     residence: {
//       address: '123 Main Street',
//       cityMunicipality: 'Manila',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//   },

//   // Marriage of Parents
//   parentMarriage: {
//     date: '06/20/2015',
//     place: {
//       cityMunicipality: 'Manila',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//   },

//   // Birth Attendant
//   attendant: {
//     type: 'Physician',
//     certification: {
//       time: '14:30',
//       signature: '',
//       name: 'Dr. John Smith',
//       title: 'MD',
//       address: '456 Hospital Road, Manila',
//       date: '01/15/2023',
//     },
//   },

//   // Informant
//   informant: {
//     signature: '',
//     name: 'Maria Dela Cruz',
//     relationship: 'Mother',
//     address: '123 Main Street, Manila',
//     date: '01/16/2023',
//   },

//   // Prepared By
//   preparedBy: {
//     signature: '',
//     name: 'Clerk John Doe',
//     title: 'Civil Registry Clerk',
//     date: '01/16/2023',
//   },

//   // Received By
//   receivedBy: {
//     signature: '',
//     name: 'Officer Jane Doe',
//     title: 'Civil Registry Officer',
//     date: '01/16/2023',
//   },

//   // Registered By Civil Registry
//   registeredByOffice: {
//     signature: '',
//     name: 'Registrar Juan Dela Cruz',
//     title: 'Civil Registrar',
//     date: '01/16/2023',
//   },

//   // Remarks
//   remarks: 'No remarks.',
// };
