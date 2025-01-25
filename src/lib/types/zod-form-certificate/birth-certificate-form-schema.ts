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

// For testing purposes

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
