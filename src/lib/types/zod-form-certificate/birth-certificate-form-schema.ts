// src\lib\types\zod-form-certificate\birth-certificate-form-schema.ts

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
    place: addressSchema,
  }),

  // Certification of Birth Attendant
  attendant: z.object({
    type: z.string().min(1, 'Please select attendant type'),
    certification: z.object({
      time: timeSchema,
      signature: signatureSchema.shape.signature,
      name: signatureSchema.shape.name,
      title: signatureSchema.shape.title,
      address: addressSchema,
      date: dateSchema,
    }),
  }),

  // Informant
  informant: z.object({
    signature: signatureSchema.shape.signature,
    name: signatureSchema.shape.name,
    relationship: z.string().min(1, 'Relationship is required'),
    address: addressSchema,
    date: dateSchema,
  }),

  // Prepared By
  preparedBy: signatureSchema,

  // Received By
  receivedBy: signatureSchema,

  // Registered By Civil Registry
  registeredByOffice: signatureSchema,

  hasAffidavitOfPaternity: z.boolean().default(false),
  affidavitOfPaternityDetails: z
    .object({
      father: signatureSchema.omit({ date: true }),
      mother: signatureSchema.omit({ date: true }),
      dateSworn: dateSchema,
      adminOfficer: z.object({
        signature: z.string(),
        name: z.string().min(1, 'Officer name is required'),
        position: z.string().min(1, 'Position is required'),
        address: addressSchema,
      }),
      ctcInfo: z.object({
        number: z.string().min(1, 'CTC number is required'),
        dateIssued: dateSchema,
        placeIssued: z.string().min(1, 'Place issued is required'),
      }),
    })
    .optional(),

  // Add this to your birthCertificateSchema
  isDelayedRegistration: z.boolean().default(false),
  affidavitOfDelayedRegistration: z
    .object({
      affiant: z.object({
        name: z.string().min(1, 'Affiant name is required'),
        address: addressSchema,
        civilStatus: z.string().min(1, 'Civil status is required'),
        citizenship: z.string().min(1, 'Citizenship is required'),
      }),
      registrationType: z.enum(['SELF', 'OTHER']),
      parentMaritalStatus: z.enum(['MARRIED', 'NOT_MARRIED']),
      reasonForDelay: z.string().min(1, 'Reason for delay is required'),
      dateSworn: dateSchema,
      adminOfficer: z.object({
        signature: z.string(),
        name: z.string().min(1, 'Officer name is required'),
        position: z.string().min(1, 'Position is required'),
      }),
      ctcInfo: z.object({
        number: z.string().min(1, 'CTC number is required'),
        dateIssued: dateSchema,
        placeIssued: z.string().min(1, 'Place issued is required'),
      }),
      spouseName: z.string().optional(), // Add this line
      applicantRelationship: z.string().optional(), // Add this line
    })
    .optional(),

  remarks: z.string().optional(),
});

export type BirthCertificateFormValues = WithNullableDates<
  z.infer<typeof birthCertificateSchema>
>;

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
      houseNumber: '123',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
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
      houseNumber: '123',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Marriage of Parents
  parentMarriage: {
    date: new Date('2022-06-15'),
    place: {
      houseNumber: '123',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Birth Attendant
  attendant: {
    type: 'Physician',
    certification: {
      time: parseTimeStringToDate('14:30'),
      signature: 'DrSantos',
      name: 'Dr. Ana Santos',
      title: 'OB-GYN',
      address: {
        houseNumber: '279',
        street: 'E Rodriguez Sr. Avenue',
        barangay: 'Kalusugan',
        cityMunicipality: 'Quezon City',
        province: 'Metro Manila',
        country: 'Philippines',
      },
      date: new Date('2024-01-15'),
    },
  },

  // Informant
  informant: {
    signature: 'JoseDC',
    name: 'Jose Dela Cruz',
    relationship: 'Father',
    address: {
      houseNumber: '279',
      street: 'E Rodriguez Sr. Avenue',
      barangay: 'Kalusugan',
      cityMunicipality: 'Quezon City',
      province: '',
      country: 'Philippines',
    },
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

  // Affidavit of Paternity
  hasAffidavitOfPaternity: false,
  affidavitOfPaternityDetails: {
    father: {
      signature: 'JoseDC',
      name: 'Jose Dela Cruz',
      title: 'Father',
    },
    mother: {
      signature: 'MariaS',
      name: 'Maria Santos',
      title: 'Mother',
    },
    dateSworn: new Date('2024-01-16'),
    adminOfficer: {
      signature: 'AdminSign',
      name: 'Administrator Name',
      position: 'Notary Public',
      address: {
        houseNumber: '456',
        street: 'Padre Faura Street',
        barangay: 'Ermita',
        cityMunicipality: 'Manila',
        province: 'Metro Manila',
        country: 'Philippines',
      },
    },
    ctcInfo: {
      number: '12345-2024',
      dateIssued: new Date('2024-01-16'),
      placeIssued: 'Quezon City',
    },
  },

  // Delayed Registration
  isDelayedRegistration: false,
  affidavitOfDelayedRegistration: {
    affiant: {
      name: 'Jose Dela Cruz',
      address: {
        houseNumber: '279',
        street: 'E Rodriguez Sr. Avenue',
        barangay: 'Kalusugan',
        cityMunicipality: 'Quezon City',
        province: 'Metro Manila',
        country: 'Philippines',
      },
      civilStatus: 'Married',
      citizenship: 'Filipino',
    },
    registrationType: 'SELF',
    parentMaritalStatus: 'MARRIED',
    reasonForDelay: 'Documentation processing delay',
    dateSworn: new Date('2024-01-16'),
    adminOfficer: {
      signature: 'AdminSign',
      name: 'Administrator Name',
      position: 'Notary Public',
    },
    ctcInfo: {
      number: '12345-2024',
      dateIssued: new Date('2024-01-16'),
      placeIssued: 'Quezon City',
    },
    spouseName: 'Maria Santos Dela Cruz',
    applicantRelationship: 'Self',
  },

  // Remarks
  remarks: 'No special remarks',
};
