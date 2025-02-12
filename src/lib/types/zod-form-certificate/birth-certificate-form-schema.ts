// src\lib\types\zod-form-certificate\birth-certificate-form-schema.ts

// src/lib/types/zod-form-certificate/birth-certificate-form-schema.ts
import { z } from 'zod';
import {
  addressSchema,
  cityMunicipalitySchema,
  dateSchema,
  nameSchema,
  parseTimeStringToDate,
  provinceSchema, // NOTE: now this is a factory function
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

/**
 * Factory function that creates the birth certificate schema.
 * When isNCRMode is true, province becomes optional (min 0), otherwise required (min 3).
 */
export const createBirthCertificateSchema = (
  registryNCRMode: boolean,
  childNCRMode: boolean,
  motherResidenceNcrMode: boolean,
  fatherResidenceNcrMode: boolean,
  parentMarriagePlaceNcrMode: boolean,
  attendantAddressNcrMode: boolean,
  informantAddressNcrMode: boolean,
  adminOfficerAddressNcrMode: boolean,
  affiantAddressNcrMode: boolean
) =>
  z.object({
    // Registry Information
    registryNumber: registryNumberSchema,
    province: provinceSchema(registryNCRMode),
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
        province: provinceSchema(childNCRMode),
      }),
      typeOfBirth: z.string().min(1, 'Please select type of birth'),
      multipleBirthOrder: z.string().optional(),
      birthOrder: z.string().min(1, 'Birth order is required'),
      weightAtBirth: z.string().min(1, 'Weight at birth is required'),
    }),

    // Mother Information
    motherInfo: z
      .object({
        firstName: nameSchema.shape.firstName,
        middleName: nameSchema.shape.middleName,
        lastName: nameSchema.shape.lastName,
        citizenship: z.string().min(1, 'Citizenship is required'),
        religion: z.string().min(1, 'Religion is required'),
        occupation: z.string().min(1, 'Occupation is required'),
        age: z.string().min(1, 'Age is required'),
        totalChildrenBornAlive: z
          .string()
          .min(1, 'Required')
          .refine((val) => !isNaN(Number(val)), 'Must be a valid number')
          .refine((val) => Number(val) >= 0, 'Cannot be negative'),
        childrenStillLiving: z
          .string()
          .min(1, 'Required')
          .refine((val) => !isNaN(Number(val)), 'Must be a valid number')
          .refine((val) => Number(val) >= 0, 'Cannot be negative'),
        childrenNowDead: z
          .string()
          .min(1, 'Required')
          .refine((val) => !isNaN(Number(val)), 'Must be a valid number')
          .refine((val) => Number(val) >= 0, 'Cannot be negative'),
        residence: addressSchema(motherResidenceNcrMode),
      })
      .refine(
        (data) => {
          const total = Number(data.totalChildrenBornAlive);
          const living = Number(data.childrenStillLiving);
          const dead = Number(data.childrenNowDead);
          return total === living + dead;
        },
        {
          message:
            'Total children born alive must equal the sum of children still living and children now dead',
          path: ['totalChildrenBornAlive'], // This will show the error on the totalChildrenBornAlive field
        }
      ),

    // Father Information
    fatherInfo: z.object({
      firstName: nameSchema.shape.firstName,
      middleName: nameSchema.shape.middleName,
      lastName: nameSchema.shape.lastName,
      citizenship: z.string().min(1, 'Citizenship is required'),
      religion: z.string().min(1, 'Religion is required'),
      occupation: z.string().min(1, 'Occupation is required'),
      age: z.string().min(1, 'Age is required'),
      // Use the provided prop for father's residence:
      residence: addressSchema(fatherResidenceNcrMode),
    }),

    // Marriage of Parents
    parentMarriage: z.object({
      date: dateSchema,
      // Use the provided prop for marriage place:
      place: addressSchema(parentMarriagePlaceNcrMode),
    }),

    // Certification of Birth Attendant
    attendant: z.object({
      type: z.string().min(1, 'Please select attendant type'),
      certification: z.object({
        time: timeSchema,
        signature: signatureSchema.shape.signature,
        name: signatureSchema.shape.name,
        title: signatureSchema.shape.title,
        // Use the provided prop for attendant's address:
        address: addressSchema(attendantAddressNcrMode),
        date: dateSchema,
      }),
    }),

    // Informant
    informant: z.object({
      signature: signatureSchema.shape.signature,
      name: signatureSchema.shape.name,
      relationship: z.string().min(1, 'Relationship is required'),
      // Use the provided prop for informant's address:
      address: addressSchema(informantAddressNcrMode),
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
          // Use the provided prop for admin officer's address:
          address: addressSchema(adminOfficerAddressNcrMode),
        }),
        ctcInfo: z.object({
          number: z.string().min(1, 'CTC number is required'),
          dateIssued: dateSchema,
          placeIssued: z.string().min(1, 'Place issued is required'),
        }),
      })
      .nullable(),

    isDelayedRegistration: z.boolean().default(false),
    affidavitOfDelayedRegistration: z
      .object({
        affiant: z.object({
          name: z.string().min(1, 'Affiant name is required'),
          // Use the provided prop for affiant's address:
          address: addressSchema(affiantAddressNcrMode),
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
        spouseName: z.string().optional(),
        applicantRelationship: z.string().optional(),
      })
      .nullable(),

    remarks: z.string().optional(),
  });

export type BirthCertificateFormValues = WithNullableDates<
  z.infer<ReturnType<typeof createBirthCertificateSchema>>
>;

// Production default values with real data and affidavit sections turned off.
export const defaultBirthCertificateFormValues: BirthCertificateFormValues = {
  // Registry Information
  registryNumber: '2024-0001',
  province: 'Metro Manila',
  cityMunicipality: 'Quezon City',

  // Child Information
  childInfo: {
    firstName: 'Gabriel',
    middleName: 'Reyes',
    lastName: 'De Guzman',
    sex: 'Male',
    dateOfBirth: new Date('2024-02-10T15:45:00'),
    placeOfBirth: {
      hospital: 'Quirino Memorial Medical Center',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
    },
    typeOfBirth: 'Single',
    multipleBirthOrder: '',
    birthOrder: '2',
    weightAtBirth: '2.8',
  },

  // Mother Information
  motherInfo: {
    firstName: 'Isabella',
    middleName: 'Santos',
    lastName: 'Reyes',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    occupation: 'Accountant',
    age: '31',
    totalChildrenBornAlive: '2',
    childrenStillLiving: '2',
    childrenNowDead: '0',
    residence: {
      houseNumber: '143',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Father Information
  fatherInfo: {
    firstName: 'Antonio',
    middleName: 'Cruz',
    lastName: 'De Guzman',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    occupation: 'Software Developer',
    age: '33',
    residence: {
      houseNumber: '143',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Marriage of Parents
  parentMarriage: {
    date: new Date('2020-06-25T00:00:00'),
    place: {
      houseNumber: '1',
      street: 'Cathedral Road',
      barangay: 'San Roque',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
  },

  // Birth Attendant
  attendant: {
    type: 'Physician',
    certification: {
      time: parseTimeStringToDate('15:45'),
      signature: 'Dr. Santos',
      name: 'Dr. Patricia Santos',
      title: 'OB-GYN',
      address: {
        houseNumber: '88',
        street: 'Matalino Street',
        barangay: 'Central',
        cityMunicipality: 'Quezon City',
        province: 'Metro Manila',
        country: 'Philippines',
      },
      date: new Date('2024-02-10T15:45:00'),
    },
  },

  // Informant
  informant: {
    signature: 'ADGuzman',
    name: 'Antonio De Guzman',
    relationship: 'Father',
    address: {
      houseNumber: '143',
      street: 'Maginhawa Street',
      barangay: 'Teachers Village',
      cityMunicipality: 'Quezon City',
      province: 'Metro Manila',
      country: 'Philippines',
    },
    date: new Date('2024-02-11T10:30:00'),
  },

  // Keeping original preparer info
  preparedBy: {
    signature: 'Staff3',
    name: 'Staff User 3',
    title: 'Registration Officer',
    date: new Date('2024-01-04T10:00:00'),
  },

  // Keeping original received by info
  receivedBy: {
    signature: 'Staff4',
    name: 'Staff User 4',
    title: 'Document Processing Officer',
    date: new Date('2024-01-05T11:00:00'),
  },

  // Keeping original registered by info
  registeredByOffice: {
    signature: 'Admin1',
    name: 'Admin User 1',
    title: 'Civil Registrar',
    date: new Date('2024-01-06T12:00:00'),
  },

  // Affidavit sections
  hasAffidavitOfPaternity: false,
  affidavitOfPaternityDetails: null,
  isDelayedRegistration: false,
  affidavitOfDelayedRegistration: null,

  // Remarks
  remarks: '',
};

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
//       houseNumber: '',
//       street: '',
//       barangay: '',
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
//       houseNumber: '',
//       street: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },

//   // Marriage of Parents
//   parentMarriage: {
//     date: null,
//     place: {
//       houseNumber: '',
//       street: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },

//   // Certification of Birth Attendant
//   attendant: {
//     type: '',
//     certification: {
//       time: null,
//       signature: '',
//       name: '',
//       title: '',
//       address: {
//         houseNumber: '',
//         street: '',
//         barangay: '',
//         cityMunicipality: '',
//         province: '',
//         country: '',
//       },
//       date: null,
//     },
//   },

//   // Informant
//   informant: {
//     signature: '',
//     name: '',
//     relationship: '',
//     address: {
//       houseNumber: '',
//       street: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//     date: null,
//   },

//   // Prepared By
//   preparedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null,
//   },

//   // Received By
//   receivedBy: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null,
//   },

//   // Registered By Civil Registry
//   registeredByOffice: {
//     signature: '',
//     name: '',
//     title: '',
//     date: null,
//   },

//   // Affidavit of Paternity
//   hasAffidavitOfPaternity: false,
//   affidavitOfPaternityDetails: {
//     father: {
//       signature: '',
//       name: '',
//       title: '',
//     },
//     mother: {
//       signature: '',
//       name: '',
//       title: '',
//     },
//     dateSworn: new Date(),
//     adminOfficer: {
//       signature: '',
//       name: '',
//       position: '',
//       address: {
//         houseNumber: '',
//         street: '',
//         barangay: '',
//         cityMunicipality: '',
//         province: '',
//         country: '',
//       },
//     },
//     ctcInfo: {
//       number: '',
//       dateIssued: new Date(),
//       placeIssued: '',
//     },
//   },

//   // Delayed Registration
//   isDelayedRegistration: false,
//   affidavitOfDelayedRegistration: {
//     affiant: {
//       name: '',
//       address: {
//         houseNumber: '',
//         street: '',
//         barangay: '',
//         cityMunicipality: '',
//         province: '',
//         country: '',
//       },
//       civilStatus: '',
//       citizenship: '',
//     },
//     registrationType: 'SELF', // or you can set to an empty string if preferred
//     parentMaritalStatus: 'MARRIED', // or an empty string if preferred
//     reasonForDelay: '',
//     dateSworn: new Date(),
//     adminOfficer: {
//       signature: '',
//       name: '',
//       position: '',
//     },
//     ctcInfo: {
//       number: '',
//       dateIssued: new Date(),
//       placeIssued: '',
//     },
//     spouseName: '',
//     applicantRelationship: '',
//   },

//   // Remarks
//   remarks: '',
// };
