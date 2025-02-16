import { z } from 'zod';
import {
  citizenshipSchema,
  cityMunicipalitySchema,
  nameSchema,
  parentInfoSchema,
  processingDetailsSchema,
  provinceSchema,
  registryNumberSchema,
  religionSchema,
  remarksAnnotationsSchema,
  residenceSchema,
} from './form-certificates-shared-schema';

// For children aged 0 to 7 days section
const infantDetailsSchema = z.object({
  ageOfMother: z.string().nonempty('Age of mother is required'),
  methodOfDelivery: z.string().nonempty('Method of delivery is required'),
  lengthOfPregnancy: z.string().nonempty('Length of pregnancy is required'),
  typeOfBirth: z.string().nonempty('Type of birth is required'),
  multipleBirthOrder: z.string().optional(),
});

// Medical Certificate section for infants (0-7 days)
const infantCausesOfDeathSchema = z.object({
  mainDiseaseOfInfant: z
    .string()
    .nonempty('Main disease/condition is required'),
  otherDiseasesOfInfant: z.string().optional(),
  mainMaternalDisease: z.string().optional(),
  otherMaternalDisease: z.string().optional(),
  otherRelevantCircumstances: z.string().optional(),
});

// Medical Certificate section for regular deaths (8 days and over)
const regularCausesOfDeathSchema = z.object({
  immediate: z.object({
    cause: z.string().nonempty('Immediate cause is required'),
    interval: z.string().nonempty('Interval is required'),
  }),
  antecedent: z.object({
    cause: z.string().optional(),
    interval: z.string().optional(),
  }),
  underlying: z.object({
    cause: z.string().optional(),
    interval: z.string().optional(),
  }),
  otherSignificantConditions: z.string().optional(),
});

// Postmortem Certificate
const postmortemCertificateSchema = z
  .object({
    causeOfDeath: z.string().nonempty('Cause of death is required'),
    signature: z.string().nonempty('Signature is required'),
    nameInPrint: z.string().nonempty('Name is required'),
    date: z.string().nonempty('Date is required'),
    titleDesignation: z.string().nonempty('Title/Designation is required'),
    address: z.string().nonempty('Address is required'),
  })
  .optional();

// Certification of Embalmer
const embalmerCertificationSchema = z
  .object({
    nameOfDeceased: z.string().nonempty('Name of deceased is required'),
    signature: z.string().nonempty('Signature is required'),
    nameInPrint: z.string().nonempty('Name is required'),
    address: z.string().nonempty('Address is required'),
    titleDesignation: z.string().nonempty('Title/Designation is required'),
    licenseNo: z.string().nonempty('License number is required'),
    issuedOn: z.string().nonempty('Issue date is required'),
    issuedAt: z.string().nonempty('Issue location is required'),
    expiryDate: z.string().nonempty('Expiry date is required'),
  })
  .optional();

// Affidavit for Delayed Registration
const delayedRegistrationSchema = z
  .object({
    affiant: z.object({
      name: z.string().nonempty('Name is required'),
      civilStatus: z.enum([
        'Single',
        'Married',
        'Divorced',
        'Widow',
        'Widower',
      ]),
      residenceAddress: z.string().nonempty('Address is required'),
    }),
    deceased: z.object({
      name: z.string().nonempty('Name is required'),
      dateOfDeath: z.string().nonempty('Date of death is required'),
      placeOfDeath: z.string().nonempty('Place of death is required'),
      burialInfo: z.object({
        date: z.string().nonempty('Burial date is required'),
        place: z.string().nonempty('Burial place is required'),
      }),
    }),
    attendance: z.object({
      wasAttended: z.boolean(),
      attendedBy: z.string().optional(),
    }),
    causeOfDeath: z.string().nonempty('Cause of death is required'),
    reasonForDelay: z.string().nonempty('Reason for delay is required'),
    affidavitDate: z.object({
      day: z.string().nonempty('Day is required'),
      month: z.string().nonempty('Month is required'),
      year: z.string().nonempty('Year is required'),
      place: z.string().nonempty('Place is required'),
    }),
    adminOfficer: z.object({
      signature: z.string().nonempty('Signature is required'),
      position: z.string().nonempty('Position is required'),
    }),
    ctcInfo: z.object({
      number: z.string().nonempty('CTC number is required'),
      issuedOn: z.string().nonempty('Date issued is required'),
      issuedAt: z.string().nonempty('Place issued is required'),
    }),
  })
  .optional();

// Main Death Certificate Schema
export const deathCertificateFormSchema = z
  .object({
    // Header Information
    registryNumber: registryNumberSchema,
    province: provinceSchema,
    cityMunicipality: cityMunicipalitySchema,

    // Deceased Information
    name: nameSchema,
    sex: z.enum(['Male', 'Female']),
    dateOfDeath: z.string().nonempty('Date of death is required'),
    dateOfBirth: z.string().nonempty('Date of birth is required'),
    ageAtDeath: z.object({
      years: z.string().optional(),
      months: z.string().optional(),
      days: z.string().optional(),
      hours: z.string().optional(),
    }),
    placeOfDeath: residenceSchema,
    civilStatus: z.string().nonempty('Civil status is required'),
    religion: religionSchema,
    citizenship: citizenshipSchema,
    residence: residenceSchema,
    occupation: z.string().nonempty('Occupation is required'),

    // Parent Information
    parents: parentInfoSchema,

    // Medical Certificate
    medicalCertificate: z.object({
      // For ages 0-7 days
      infantDeathDetails: infantDetailsSchema.optional(),
      // Causes of death - either infant or regular
      causesOfDeath: z.union([
        infantCausesOfDeathSchema,
        regularCausesOfDeathSchema,
      ]),
      // Maternal condition
      maternalCondition: z
        .object({
          pregnantNotInLabor: z.boolean().optional(),
          pregnantInLabor: z.boolean().optional(),
          lessThan42Days: z.boolean().optional(),
          daysTo1Year: z.boolean().optional(),
          noneOfTheAbove: z.boolean().optional(),
        })
        .optional(),
      // External causes
      externalCauses: z.object({
        mannerOfDeath: z.string().optional(),
        placeOfOccurrence: z.string().optional(),
      }),
      // Attendant
      attendant: z.object({
        privatePhysician: z.boolean(),
        publicHealthOfficer: z.boolean(),
        hospitalAuthority: z.boolean(),
        none: z.boolean(),
        others: z.boolean(),
        othersSpecify: z.string().optional(),
        duration: z
          .object({
            from: z.string().optional(),
            to: z.string().optional(),
          })
          .optional(),
      }),
      autopsy: z.boolean().default(false),
    }),

    // Certification of Death
    certificationOfDeath: z.object({
      hasAttended: z.boolean(),
      signature: z.string().nonempty('Signature is required'),
      nameInPrint: z.string().nonempty('Name is required'),
      titleOfPosition: z.string().nonempty('Title/Position is required'),
      address: z.string().nonempty('Address is required'),
      date: z.string().nonempty('Date is required'),
    }),

    // Review
    reviewedBy: z.object({
      signature: z.string().nonempty('Signature is required'),
      date: z.string().nonempty('Date is required'),
    }),

    // Certificates
    postmortemCertificate: postmortemCertificateSchema,
    embalmerCertification: embalmerCertificationSchema,
    delayedRegistration: delayedRegistrationSchema,

    // Disposal Information
    corpseDisposal: z.string().nonempty('Corpse disposal method is required'),
    burialPermit: z.object({
      number: z.string().nonempty('Permit number is required'),
      dateIssued: z.string().nonempty('Date issued is required'),
    }),
    transferPermit: z
      .object({
        number: z.string().optional(),
        dateIssued: z.string().optional(),
      })
      .optional(),

    cemeteryOrCrematory: z.object({
      name: z.string().nonempty('Name is required'),
      address: z.string().nonempty('Address is required'),
    }),

    // Informant
    informant: z.object({
      signature: z.string().nonempty('Signature is required'),
      nameInPrint: z.string().nonempty('Name is required'),
      relationshipToDeceased: z.string().nonempty('Relationship is required'),
      address: z.string().nonempty('Address is required'),
      date: z.string().nonempty('Date is required'),
    }),

    // Processing Information
    preparedBy: processingDetailsSchema.shape.preparedBy,
    receivedBy: processingDetailsSchema.shape.receivedBy,
    registeredByOffice: processingDetailsSchema.shape.registeredBy,

    remarks: remarksAnnotationsSchema,
  })
  .superRefine((data, ctx) => {
    // Essential business logic validations

    // 1. Validate infant details requirement for deaths within 7 days
    if (data.ageAtDeath.days && parseInt(data.ageAtDeath.days) <= 7) {
      if (!data.medicalCertificate.infantDeathDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Infant details are required for deaths within 7 days of birth',
          path: ['medicalCertificate.infantDeathDetails'],
        });
      }
    }

    // 2. Validate maternal condition for females of reproductive age
    if (data.sex === 'Female' && data.ageAtDeath.years) {
      const age = parseInt(data.ageAtDeath.years);
      if (
        age >= 15 &&
        age <= 49 &&
        !data.medicalCertificate.maternalCondition
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Maternal condition is required for females aged 15-49',
          path: ['medicalCertificate.maternalCondition'],
        });
      }
    }

    // 3. Validate postmortem certificate requirement
    if (data.medicalCertificate.autopsy && !data.postmortemCertificate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Postmortem certificate is required when autopsy is performed',
        path: ['postmortemCertificate'],
      });
    }

    // 4. Validate transfer permit requirement
    if (
      data.placeOfDeath.cityMunicipality !== data.cemeteryOrCrematory.address
    ) {
      if (!data.transferPermit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Transfer permit is required when burial location differs from place of death',
          path: ['transferPermit'],
        });
      }
    }

    // 5. Validate attendant duration if specified
    if (data.medicalCertificate.attendant.duration) {
      const { from, to } = data.medicalCertificate.attendant.duration;
      if ((from && !to) || (!from && to)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both from and to dates are required for attendant duration',
          path: ['medicalCertificate.attendant.duration'],
        });
      }
    }
  });

export type DeathCertificateFormValues = z.infer<
  typeof deathCertificateFormSchema
>;
