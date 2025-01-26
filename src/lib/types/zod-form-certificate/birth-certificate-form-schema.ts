// src\lib\types\zod-form-certificate\birth-certificate-form-schema.ts

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
  WithNullableDates,
} from './form-certificates-shared-schema';
export interface BirthCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export const birthCertificateSchema = z.object({
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema,
  cityMunicipality: cityMunicipalitySchema,

  // Child Information
  childInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    sex: z.string().min(1, 'Please select a sex'),
    dateOfBirth: dateSchema,
    placeOfBirth: z.object({
      hospital: z.string().min(1, 'Hospital/Clinic name is required'),
      cityMunicipality: cityMunicipalitySchema,
      province: provinceSchema,
    }),
    typeOfBirth: z.string().min(1, 'Please select type of birth'),
    multipleBirthOrder: z.string().optional(),
    birthOrder: z.string().min(1, 'Birth order is required'),
    weightAtBirth: z.string().min(1, 'Weight at birth is required'),
  }),

  // Mother Information
  motherInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    totalChildrenBornAlive: z.string().min(1, 'Required'),
    childrenStillLiving: z.string().min(1, 'Required'),
    childrenNowDead: z.string().min(1, 'Required'),
    residence: addressSchema,
  }),

  // Father Information
  fatherInfo: z.object({
    firstName: nameSchema.shape.firstName,
    middleName: nameSchema.shape.middleName,
    lastName: nameSchema.shape.lastName,
    citizenship: z.string().min(1, 'Citizenship is required'),
    religion: z.string().min(1, 'Religion is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    age: z.string().min(1, 'Age is required'),
    residence: addressSchema,
  }),

  // Marriage of Parents
  parentMarriage: z.object({
    date: dateSchema,
    place: z.object({
      cityMunicipality: cityMunicipalitySchema,
      province: provinceSchema,
      country: z.string().min(1, 'Country is required'),
    }),
  }),

  // Certification of Birth Attendant
  attendant: z.object({
    type: z.string().min(1, 'Please select attendant type'),
    certification: z.object({
      time: timeSchema,
      signature: signatureSchema.shape.signature,
      name: signatureSchema.shape.name,
      title: signatureSchema.shape.title,
      address: addressSchema.shape.address,
      date: dateSchema,
    }),
  }),

  // Informant
  informant: z.object({
    signature: signatureSchema.shape.signature,
    name: signatureSchema.shape.name,
    relationship: z.string().min(1, 'Relationship is required'),
    address: addressSchema.shape.address,
    date: dateSchema,
  }),

  // Prepared By
  preparedBy: signatureSchema,

  // Received By
  receivedBy: signatureSchema,

  // Registered By Civil Registry
  registeredByOffice: signatureSchema,

  remarks: z.string().optional(),
});

export type BirthCertificateFormValues = WithNullableDates<
  z.infer<typeof birthCertificateSchema>
>;

// export const defaultBirthCertificateFormValues: BirthCertificateFormValues = {
//   // Registry Information
//   registryNumber: '',
//   province: '',
//   cityMunicipality: '',

//   // Child Information
//   childInfo: {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     sex: '',
//     dateOfBirth: null,
//     placeOfBirth: {
//       hospital: '',
//       cityMunicipality: '',
//       province: '',
//     },
//     typeOfBirth: '',
//     multipleBirthOrder: '',
//     birthOrder: '',
//     weightAtBirth: '',
//   },

//   // Mother Information
//   motherInfo: {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     citizenship: '',
//     religion: '',
//     occupation: '',
//     age: '',
//     totalChildrenBornAlive: '',
//     childrenStillLiving: '',
//     childrenNowDead: '',
//     residence: {
//       address: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },

//   // Father Information
//   fatherInfo: {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     citizenship: '',
//     religion: '',
//     occupation: '',
//     age: '',
//     residence: {
//       address: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },

//   // Marriage of Parents
//   parentMarriage: {
//     date: null, // Default to null
//     place: {
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },

//   // Birth Attendant
//   attendant: {
//     type: '',
//     certification: {
//       time: '',
//       signature: '',
//       name: '',
//       title: '',
//       address: '',
//       date: null, // Default to null
//     },
//   },

//   // Informant
//   informant: {
//     signature: '',
//     name: '',
//     relationship: '',
//     address: '',
//     date: null, // Default to null
//   },

//   // Prepared By
//   preparedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null, // Default to null
//   },

//   // Received By
//   receivedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null, // Default to null
//   },

//   // Registered By Civil Registry
//   registeredByOffice: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null, // Default to null
//   },

//   // Remarks
//   remarks: '',
// };

// For testing purposes

export const defaultBirthCertificateFormValues: BirthCertificateFormValues = {
  // Registry Information
  registryNumber: '2024-00001',
  province: 'Metro Manila',
  cityMunicipality: 'Quezon City',

  // Child Information
  childInfo: {
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    sex: 'Male',
    dateOfBirth: new Date('2024-01-15'),
    placeOfBirth: {
      hospital: "St. Luke's Medical Center",
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
    },
    typeOfBirth: 'Single',
    multipleBirthOrder: '',
    birthOrder: '1',
    weightAtBirth: '3.2',
  },

  // Mother Information
  motherInfo: {
    firstName: 'Maria',
    middleName: 'Garcia',
    lastName: 'Santos',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    occupation: 'Teacher',
    age: '28',
    totalChildrenBornAlive: '1',
    childrenStillLiving: '1',
    childrenNowDead: '0',
    residence: {
      address: '123 Maginhawa Street',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Father Information
  fatherInfo: {
    firstName: 'Jose',
    middleName: 'Martinez',
    lastName: 'Dela Cruz',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    occupation: 'Software Engineer',
    age: '30',
    residence: {
      address: '123 Maginhawa Street',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Marriage of Parents
  parentMarriage: {
    date: new Date('2022-06-15'),
    place: {
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Birth Attendant
  attendant: {
    type: 'Physician',
    certification: {
      time: '14:30',
      signature: 'DrSantos',
      name: 'Dr. Ana Santos',
      title: 'OB-GYN',
      address: "St. Luke's Medical Center, Quezon City",
      date: new Date('2024-01-15'),
    },
  },

  // Informant
  informant: {
    signature: 'JoseDC',
    name: 'Jose Dela Cruz',
    relationship: 'Father',
    address: '123 Maginhawa Street, Quezon City',
    date: new Date('2024-01-16'),
  },

  // Prepared By
  preparedBy: {
    signature: 'Staff3',
    name: 'Staff User 3',
    title: 'Registration Officer',
    date: new Date('2024-01-16'),
  },

  // Received By
  receivedBy: {
    signature: 'Staff4',
    name: 'Staff User 4',
    title: 'Document Processing Officer',
    date: new Date('2024-01-16'),
  },

  // Registered By Civil Registry
  registeredByOffice: {
    signature: 'Admin1',
    name: 'Admin User 1',
    title: 'Civil Registrar',
    date: new Date('2024-01-16'),
  },

  // Remarks
  remarks: 'No special remarks',
};
