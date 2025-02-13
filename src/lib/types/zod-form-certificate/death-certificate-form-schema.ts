// // src/lib/types/zod-form-certificate/death-certificate-form-schema.ts
// import { z } from 'zod';
// import {
//   addressSchema,
//   cityMunicipalitySchema,
//   dateSchema,
//   nameSchema,
//   provinceSchema,
//   registryNumberSchema,
//   WithNullableDates,
// } from './form-certificates-shared-schema';

// /**
//  * Factory function that creates the death certificate schema.
//  * The boolean flags allow you to control whether province is optional in certain address fields.
//  */
// export const createDeathCertificateSchema = (
//   registryNCRMode: boolean,
//   deceasedResidenceNcrMode: boolean,
//   certifierAddressNcrMode: boolean,
//   informantAddressNcrMode: boolean
// ) =>
//   z.object({
//     // Registry Information
//     registryNumber: registryNumberSchema,
//     province: provinceSchema(registryNCRMode),
//     cityMunicipality: cityMunicipalitySchema,

//     // Deceased Information
//     deceasedInfo: z.object({
//       deceasedName: nameSchema, // expects { firstName, middleName?, lastName }
//       sex: z.enum(['Male', 'Female']),
//       dateOfDeath: dateSchema,
//       dateOfBirth: dateSchema.nullable(),
//       placeOfDeath: addressSchema(deceasedResidenceNcrMode),
//       placeOfBirth: addressSchema(deceasedResidenceNcrMode),
//       civilStatus: z.string().min(1, 'Civil status is required'),
//       religion: z.string().optional(),
//       citizenship: z.string().min(1, 'Citizenship is required'),
//       residence: addressSchema(deceasedResidenceNcrMode),
//       occupation: z.string().optional(),
//       pregnancy: z.boolean().optional(),
//     }),

//     // Family Information
//     familyInfo: z.object({
//       nameOfFather: nameSchema,
//       nameOfMother: nameSchema,
//     }),

//     // Medical Information
//     medicalInfo: z.object({
//       causesOfDeath: z.object({
//         immediate: z.string().min(1, 'Immediate cause is required'),
//         antecedent: z.string().min(1, 'Antecedent cause is required'),
//         underlying: z.string().min(1, 'Underlying cause is required'),
//         contributingConditions: z.string().optional(),
//       }),
//       deathInterval: z.object({
//         duration: z.string().min(1, 'Death interval is required'),
//       }),
//       maternalCondition: z
//         .object({
//           condition: z.string().optional(),
//         })
//         .nullable(),
//       autopsyPerformed: z.boolean().optional(),
//     }),

//     // Attendance Information
//     attendance: z.object({
//       attendedByPhysician: z.boolean(),
//       attendanceDuration: z
//         .object({
//           from: dateSchema,
//           to: dateSchema,
//         })
//         .nullable(),
//     }),

//     // External Causes
//     externalCauses: z.object({
//       mannerOfDeath: z.string().optional(),
//       externalCause: z.string().optional(),
//       placeOfOccurrence: z.string().optional(),
//     }),

//     // Certification Information
//     certification: z.object({
//       certificationType: z.string().min(1, 'Certification type is required'),
//       certifier: z.object({
//         signature: z.string().optional(),
//         name: z.string().min(1, 'Certifier name is required'),
//         title: z.string().min(1, 'Certifier title is required'),
//         date: dateSchema,
//         address: addressSchema(certifierAddressNcrMode),
//       }),
//     }),

//     // Disposal Information
//     disposal: z.object({
//       disposalDetails: z.any().optional(),
//       burialPermit: z
//         .object({
//           number: z.string().min(1, 'Burial permit number is required'),
//           dateIssued: dateSchema,
//         })
//         .nullable(),
//       transferPermit: z
//         .object({
//           number: z.string().optional(),
//           dateIssued: dateSchema.nullable(),
//         })
//         .nullable(),
//       cemeteryDetails: z
//         .object({
//           address: z.string().min(1, 'Cemetery address is required'),
//         })
//         .nullable(),
//     }),

//     // Additional Details
//     additionalDetails: z.object({
//       postmortemDetails: z
//         .object({
//           performed: z.boolean().optional(),
//           remarks: z.string().optional(),
//         })
//         .nullable(),
//       embalmerDetails: z
//         .object({
//           name: z.string().min(1, 'Embalmer name is required'),
//           licenseNumber: z.string().optional(),
//         })
//         .nullable(),
//       infantDeathDetails: z
//         .object({
//           birthWeight: z.string().optional(),
//           gestationalAge: z.string().optional(),
//         })
//         .nullable(),
//     }),

//     // Delayed Registration
//     delayedRegistration: z
//       .object({
//         reason: z.string().min(1, 'Reason for delay is required'),
//         dateSworn: dateSchema,
//         adminOfficer: z.object({
//           signature: z.string().min(1, 'Officer signature is required'),
//           name: z.string().min(1, 'Officer name is required'),
//           position: z.string().min(1, 'Position is required'),
//         }),
//         ctcInfo: z.object({
//           number: z.string().min(1, 'CTC number is required'),
//           dateIssued: dateSchema,
//           placeIssued: z.string().min(1, 'Place issued is required'),
//         }),
//       })
//       .nullable(),

//     // New Fields (optional)
//     ageAtDeath: z
//       .object({
//         years: z.string().min(1, 'Years is required'),
//         months: z.string().optional(),
//         days: z.string().optional(),
//         hours: z.string().optional(),
//       })
//       .nullable(),
//     reviewedBy: z
//       .object({
//         name: z.string().min(1, 'Reviewer name is required'),
//         title: z.string().min(1, 'Reviewer title is required'),
//         position: z.string().min(1, 'Reviewer position is required'),
//         date: dateSchema,
//       })
//       .nullable(),

//     // Informant and Preparer Information
//     informant: z.object({
//       signature: z.string().optional(),
//       name: z.string().min(1, 'Informant name is required'),
//       relationship: z.string().min(1, 'Relationship is required'),
//       address: addressSchema(informantAddressNcrMode),
//       date: dateSchema,
//     }),
//     preparer: z.object({
//       signature: z.string().optional(),
//       name: z.string().min(1, 'Preparer name is required'),
//       title: z.string().min(1, 'Preparer title is required'),
//       date: dateSchema,
//     }),

//     // Administrative Fields for BaseRegistryForm
//     receivedBy: z.object({
//       signature: z.string().optional(),
//       name: z.string().min(1, 'Received by name is required'),
//       title: z.string().min(1, 'Received by title is required'),
//       date: dateSchema,
//     }),
//     registeredAtCivilRegistrar: z.object({
//       signature: z.string().optional(),
//       name: z.string().min(1, 'Registered by name is required'),
//       title: z.string().min(1, 'Registered by title is required'),
//       date: dateSchema,
//     }),
//     remarks: z.string().optional(),
//   });

// export type DeathCertificateFormValues = WithNullableDates<
//   z.infer<ReturnType<typeof createDeathCertificateSchema>>
// >;

// // Default values for testing or initial form state.
// export const defaultDeathCertificateFormValues: DeathCertificateFormValues = {
//   // Registry Information
//   registryNumber: '2024-00001',
//   province: 'Metro Manila',
//   cityMunicipality: 'Quezon City',

//   // Deceased Information
//   deceasedInfo: {
//     deceasedName: {
//       firstName: 'Juan',
//       middleName: 'Santos',
//       lastName: 'Dela Cruz',
//     },
//     sex: 'Male',
//     dateOfDeath: new Date('2024-01-20'),
//     dateOfBirth: new Date('1950-05-15'),
//     placeOfDeath: {
//       houseNumber: '',
//       street: "St. Luke's Medical Center, E Rodriguez Sr. Ave",
//       barangay: '',
//       cityMunicipality: 'Quezon City',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//     placeOfBirth: {
//       houseNumber: '456',
//       street: 'Some Street',
//       barangay: 'Barangay 123',
//       cityMunicipality: 'Quezon City',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//     civilStatus: 'Married',
//     religion: 'Roman Catholic',
//     citizenship: 'Filipino',
//     residence: {
//       houseNumber: '123',
//       street: 'Maginhawa Street, Teachers Village',
//       barangay: '',
//       cityMunicipality: 'Quezon City',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//     occupation: 'Retired Teacher',
//     pregnancy: false,
//   },

//   // Family Information
//   familyInfo: {
//     nameOfFather: {
//       firstName: 'Pedro',
//       middleName: 'Martinez',
//       lastName: 'Dela Cruz',
//     },
//     nameOfMother: {
//       firstName: 'Maria',
//       middleName: 'Santos',
//       lastName: 'Garcia',
//     },
//   },

//   // Medical Information
//   medicalInfo: {
//     causesOfDeath: {
//       immediate: 'Cardiac Arrest',
//       antecedent: 'Acute Myocardial Infarction',
//       underlying: 'Coronary Artery Disease',
//       contributingConditions: 'Diabetes Mellitus, Type 2',
//     },
//     deathInterval: {
//       duration: '2 hours',
//     },
//     maternalCondition: null,
//     autopsyPerformed: true,
//   },

//   // Attendance Information
//   attendance: {
//     attendedByPhysician: true,
//     attendanceDuration: {
//       from: new Date('2024-01-18'),
//       to: new Date('2024-01-20'),
//     },
//   },

//   // External Causes
//   externalCauses: {
//     mannerOfDeath: 'Natural',
//     externalCause: 'None',
//     placeOfOccurrence: 'Hospital',
//   },

//   // Certification Information
//   certification: {
//     certificationType: 'Physician',
//     certifier: {
//       signature: 'DrSantos',
//       name: 'Dr. Ana Santos',
//       title: 'Attending Physician',
//       date: new Date('2024-01-20'),
//       address: {
//         houseNumber: '',
//         street: "St. Luke's Medical Center, E Rodriguez Sr. Ave",
//         barangay: '',
//         cityMunicipality: 'Quezon City',
//         province: 'Metro Manila',
//         country: 'Philippines',
//       },
//     },
//   },

//   // Disposal Information
//   disposal: {
//     disposalDetails: undefined,
//     burialPermit: {
//       number: 'BP-2024-001',
//       dateIssued: new Date('2024-01-21'),
//     },
//     transferPermit: {
//       number: '',
//       dateIssued: null,
//     },
//     cemeteryDetails: {
//       address: 'Himlayang Pilipino Memorial Park, Quezon City',
//     },
//   },

//   // Additional Details
//   additionalDetails: {
//     postmortemDetails: null,
//     embalmerDetails: null,
//     infantDeathDetails: null,
//   },

//   // Delayed Registration
//   delayedRegistration: null,

//   // New Fields
//   ageAtDeath: null,
//   reviewedBy: null,

//   // Informant Information
//   informant: {
//     signature: 'MCruz',
//     name: 'Maria Cruz',
//     relationship: 'Spouse',
//     address: {
//       houseNumber: '',
//       street: '123 Maginhawa Street, Teachers Village',
//       barangay: '',
//       cityMunicipality: 'Quezon City',
//       province: 'Metro Manila',
//       country: 'Philippines',
//     },
//     date: new Date('2024-01-20'),
//   },

//   // Preparer Information
//   preparer: {
//     signature: 'Staff3',
//     name: 'Staff User 3',
//     title: 'Registration Officer',
//     date: new Date('2024-01-21'),
//   },

//   // Administrative Fields for BaseRegistryForm
//   receivedBy: {
//     signature: 'Staff4',
//     name: 'Staff User 4',
//     title: 'Document Processing Officer',
//     date: new Date('2024-01-21'),
//   },
//   registeredAtCivilRegistrar: {
//     signature: 'Admin1',
//     name: 'Admin User 1',
//     title: 'Civil Registrar',
//     date: new Date('2024-01-21'),
//   },
//   remarks: 'Document processed and verified.',
// };

// export interface DeathCertificateFormProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onCancel: () => void;
// }
