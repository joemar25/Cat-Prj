import { z } from 'zod';
import {
  citizenshipSchema,
  cityMunicipalitySchema,
  nameSchema,
  processingDetailsSchema,
  provinceSchema,
  registryNumberSchema,
  religionSchema,
  remarksAnnotationsSchema,
  residenceSchema,
} from './form-certificates-shared-schema';

// Child Information Schema
const childInformationSchema = z
  .object({
    firstName: nameSchema.shape.first,
    middleName: nameSchema.shape.middle,
    lastName: nameSchema.shape.last,
    sex: z.enum(['Male', 'Female']),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .superRefine((date, ctx) => {
        const birthDate = new Date(date);
        const today = new Date();
        if (birthDate > today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Birth date cannot be in the future',
          });
        }
      }),
    placeOfBirth: z.object({
      hospital: z
        .string()
        .min(1, 'Hospital/Clinic/Institution name is required'),
      cityMunicipality: cityMunicipalitySchema,
      province: provinceSchema,
    }),
    typeOfBirth: z.enum(['Single', 'Twin', 'Triplet', 'Others']),
    multipleBirthOrder: z.enum(['First', 'Second', 'Third']).optional(),
    birthOrder: z.string().min(1, 'Birth order is required'),
    weightAtBirth: z
      .string()
      .min(1, 'Weight at birth is required')
      .superRefine((weight, ctx) => {
        const num = parseFloat(weight);
        if (isNaN(num) || num <= 0 || num >= 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Weight must be a valid number between 0-10 kg',
          });
        }
      }),
  })
  .superRefine((data, ctx) => {
    if (data.typeOfBirth !== 'Single' && !data.multipleBirthOrder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Birth order is required for multiple births',
        path: ['multipleBirthOrder'],
      });
    }
  });

// Mother Information Schema
const motherInformationSchema = z
  .object({
    firstName: nameSchema.shape.first,
    middleName: nameSchema.shape.middle,
    lastName: nameSchema.shape.last,
    citizenship: citizenshipSchema,
    religion: religionSchema,
    occupation: z.string().min(1, 'Occupation is required'),
    age: z
      .string()
      .min(1, 'Age is required')
      .superRefine((age, ctx) => {
        const num = parseInt(age);
        if (isNaN(num) || num < 12 || num > 65) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mother's age must be between 12 and 65 years",
          });
        }
      }),
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
    residence: residenceSchema,
  })
  .superRefine((data, ctx) => {
    const total = Number(data.totalChildrenBornAlive);
    const living = Number(data.childrenStillLiving);
    const dead = Number(data.childrenNowDead);
    if (total !== living + dead) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Total children born alive must equal sum of living and deceased children',
        path: ['totalChildrenBornAlive'],
      });
    }
  });

// Father Information Schema
const fatherInformationSchema = z
  .object({
    firstName: nameSchema.shape.first,
    middleName: nameSchema.shape.middle,
    lastName: nameSchema.shape.last,
    citizenship: citizenshipSchema,
    religion: religionSchema,
    occupation: z.string().min(1, 'Occupation is required'),
    age: z
      .string()
      .min(1, 'Age is required')
      .superRefine((age, ctx) => {
        const num = parseInt(age);
        if (isNaN(num) || num < 12 || num > 95) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Father's age must be between 12 and 95 years",
          });
        }
      }),
    residence: residenceSchema,
  })
  .optional();

// Marriage Information Schema
const marriageInformationSchema = z
  .object({
    date: z
      .string()
      .min(1, 'Date is required')
      .superRefine((date, ctx) => {
        const marriageDate = new Date(date);
        if (marriageDate > new Date()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Marriage date cannot be in the future',
          });
        }
      }),
    place: residenceSchema,
  })
  .optional();

// Attendant Information Schema
const attendantInformationSchema = z.object({
  type: z.enum(['Physician', 'Nurse', 'Midwife', 'Hilot', 'Others']),
  certification: z.object({
    time: z.string().min(1, 'Time is required'),
    signature: z.string().min(1, 'Signature is required'),
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    address: residenceSchema,
    date: z
      .string()
      .min(1, 'Date is required')
      .superRefine((date, ctx) => {
        const certDate = new Date(date);
        if (certDate > new Date()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Certification date cannot be in the future',
          });
        }
      }),
  }),
});

// Informant Schema
const informantSchema = z.object({
  signature: z.string().min(1, 'Signature is required'),
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  address: residenceSchema,
  date: z.string().min(1, 'Date is required'),
});

// Affidavit of Paternity Schema
const affidavitOfPaternitySchema = z.object({
  father: z.object({
    signature: z.string().min(1, 'Signature is required'),
    name: z.string().min(1, 'Name is required'),
  }),
  mother: z.object({
    signature: z.string().min(1, 'Signature is required'),
    name: z.string().min(1, 'Name is required'),
  }),
  dateSworn: z.string().min(1, 'Date sworn is required'),
  adminOfficer: z.object({
    signature: z.string().min(1, 'Officer signature is required'),
    name: z.string().min(1, 'Officer name is required'),
    position: z.string().min(1, 'Position is required'),
    address: residenceSchema,
  }),
  ctcInfo: z.object({
    number: z.string().min(1, 'CTC number is required'),
    dateIssued: z.string().min(1, 'Date issued is required'),
    placeIssued: z.string().min(1, 'Place issued is required'),
  }),
});

// Delayed Registration Affidavit Schema
const delayedRegistrationAffidavitSchema = z.object({
  affiant: z.object({
    name: z.string().min(1, 'Affiant name is required'),
    address: residenceSchema,
    civilStatus: z.string().min(1, 'Civil status is required'),
    citizenship: citizenshipSchema,
  }),
  registrationType: z.enum(['SELF', 'OTHER']),
  reasonForDelay: z.string().min(1, 'Reason for delay is required'),
  dateSworn: z.string().min(1, 'Date sworn is required'),
  adminOfficer: z.object({
    signature: z.string().min(1, 'Officer signature is required'),
    name: z.string().min(1, 'Officer name is required'),
    position: z.string().min(1, 'Position is required'),
  }),
  ctcInfo: z.object({
    number: z.string().min(1, 'CTC number is required'),
    dateIssued: z.string().min(1, 'Date issued is required'),
    placeIssued: z.string().min(1, 'Place issued is required'),
  }),
});

// Main Birth Certificate Schema
export const birthCertificateFormSchema = z
  .object({
    registryNumber: registryNumberSchema,
    province: provinceSchema,
    cityMunicipality: cityMunicipalitySchema,
    childInfo: childInformationSchema,
    motherInfo: motherInformationSchema,
    fatherInfo: fatherInformationSchema,
    parentMarriage: marriageInformationSchema,
    attendant: attendantInformationSchema,
    informant: informantSchema,
    preparedBy: processingDetailsSchema.shape.preparedBy,
    receivedBy: processingDetailsSchema.shape.receivedBy,
    registeredByOffice: processingDetailsSchema.shape.registeredBy,
    hasAffidavitOfPaternity: z.boolean().default(false),
    affidavitOfPaternityDetails: affidavitOfPaternitySchema
      .nullable()
      .optional(),
    isDelayedRegistration: z.boolean().default(false),
    affidavitOfDelayedRegistration: delayedRegistrationAffidavitSchema
      .nullable()
      .optional(),
    remarks: remarksAnnotationsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.hasAffidavitOfPaternity && !data.affidavitOfPaternityDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Affidavit details are required when including paternity affidavit',
        path: ['affidavitOfPaternityDetails'],
      });
    }
    if (data.isDelayedRegistration && !data.affidavitOfDelayedRegistration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Delayed registration affidavit is required for delayed registration',
        path: ['affidavitOfDelayedRegistration'],
      });
    }
  });

export type BirthCertificateFormValues = z.infer<
  typeof birthCertificateFormSchema
>;

export interface BirthCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
