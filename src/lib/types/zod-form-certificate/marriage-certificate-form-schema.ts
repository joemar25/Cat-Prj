import { string, z } from 'zod';
import {
  citizenshipSchema,
  cityMunicipalitySchema,
  nameSchema,
  provinceSchema, // Factory function: provinceSchema(isOptional: boolean)
  registryNumberSchema,
} from './form-certificates-shared-schema';


export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

/**
 * Helper schemas for common fields
 */

// Consent Person Schema
const consentPersonSchema = nameSchema.extend({
  relationship: z.string().min(1, 'Relationship is required'),
  residence: z.string().min(1, 'Residence is required'),
});

const placeOfBirthSchema = z.object({
  // region: z.string().min(1, 'Region is required'), // Add this line
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

// Parents Schema
const parentsSchema = z.object({
  father: nameSchema,
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  mother: nameSchema,
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
});

// Marriage Details Schema
const marriageDetailsSchema = z.object({
  placeOfMarriage: z.object({
    office: z.string().min(1, 'Place of marriage is required'),
    region: z.string().min(1, 'Region is required'),
    cityMunicipality: cityMunicipalitySchema,
    province: provinceSchema,
  }),
  dateOfMarriage: z.date(),
  timeOfMarriage: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
});

// Witness Schema
const witnessSchema = z.object({
  name: z.string().optional(),
  signature: z.string().optional(),
  name2: z.string().optional(),
  signature2: z.string().optional(),
});

//if true or false agree or disagree
const agreementSchema = z.object({
  agreement: z.boolean().refine((val) => val === false, {
    message: 'Disagree by default.',
  })
});

//signature
const signatureSchema = z.object({
  signature: z.string(),
  name: nameSchema
});

// Personal Information Schema
const personalInformation = z.object({
  name: nameSchema,
  age: z.number().min(18, 'Must be at least 18 years old'),
  birth: z.date(),
  placeOfBirth: placeOfBirthSchema,
  sex: z.enum(['male', 'female']).default('male'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  residence: z.string().min(1, 'Residence is required'),
  religion: z.string().optional(),
  civilStatus: z.enum(['single', 'widowed', 'divorced']),
});

const contractingParties = z.object({
  signature: signatureSchema,
  agreement: agreementSchema
})

const marriageLicenseSchema = z.object({
  number: z.string().min(1, 'License number is required'),
  dateIssued: z.date(),
  placeIssued: z.string().min(1, 'Place issued is required'),
  marriageAgree: agreementSchema
})

const marriageArticleSchema = z.object({
  articleAgree: agreementSchema,
  articleExecutiveOrder: z.string().min(1, 'This Article is required')
})

const recievedBySchema = z.object({
  signature: z.string().optional(),
  nameInPrint: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  date: z.date(),
})

const registeredAtCivilRegistrarSchema = z.object({
  signature: z.string().optional(),
  nameInPrint: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  date: z.date(),
})

const solemnizingOfficerSchema = z.object({
  name: z.string().min(1, 'Solemnizing officer name is required'),
  position: z.string().min(1, 'Position is required'),
  religion: z.string().min(1, 'Religion is required'),
  registryNoExpiryDate: z.string().min(1, 'Registry expiry date is required'),
})

export const residenceSchema = z.object({
  st: z.string().nonempty('Street is required'),
  barangay: z.string().nonempty('Barangay is required'),
  cityMunicipality: cityMunicipalitySchema, // Reuse shared city/municipality schema
  province: provinceSchema, // Reuse shared province schema
  country: z.string().nonempty('Country is required'),
});

//*****BACK PAGE ***************************************** //
//*****BACK PAGE ***************************************** //
const affidavitOfSolemnizingOfficerSchema = z.object({
  administeringInformation: z.object({
    nameOfOfficer: z.string().min(1, 'Name of officer is required'),
    signatureOfOfficer: z.string().optional(),
    position: z.string().min(1, 'Position/Title/Designation is required'),
    addressOfOfficer: residenceSchema
  }),
  nameOfPlace: z.string().min(1, 'Name of place is required'),
  addressAt: z.string().min(1, 'Address at is required'),
  1: z.object({
    nameOfHusband: nameSchema,
    nameOfWife: nameSchema
  }),
  2: z.object({
    a: agreementSchema,
    b: agreementSchema,
    c: agreementSchema.extend({
      nameOfHusband: nameSchema,
      nameOfWife: nameSchema
    }),
    d: agreementSchema,
    e: agreementSchema
  }),
  3: z.string().optional(),
  4: agreementSchema.extend({
    dayOf: z.date(),
    atPlaceOfMarriage: residenceSchema,
  }),
  dateSworn: agreementSchema.extend({
    dayOf: z.date(),
    atPlaceOfSworn: residenceSchema,
    ctcInfo: z.object({
      number: z.string().min(1, 'CTC number is required'),
      dateIssued: z.string().min(1, 'Date issued is required'),
      placeIssued: z.string().min(1, 'Place issued is required'),
    }),
  }),


})

const affidavitForDelayedSchema = z.object({
  administeringInformation: z.object({
    nameOfOfficer: z.string().min(1, 'Name of officer is required'),
    signatureOfOfficer: z.string().optional(),
    position: z.string().min(1, 'Position/Title/Designation is required'),
    addressOfOfficer: residenceSchema
  }),
  applicantInformation: z.object({
    nameOfApplicant: z.string().min(1, 'Name of Applicant is required'),
    addressOfOfficer: residenceSchema
  }),
  1: z.object({
    a: agreementSchema.extend({
      nameOfPartner: z.string().min(1, "Applicant's partner name is required"),
      placeOfMarriage: residenceSchema,
      dateOfMarriage: z.date(),
    }),
    b: agreementSchema.extend({
      nameOfHusband: z.string().min(1, "Applicant's partner name is required"),
      nameOfWife: z.string().min(1, "Applicant's partner name is required"),
      placeOfMarriage: residenceSchema,
      dateOfMarriage: z.date(),
    })
  }),
  2: z.object({
    solemnizedBy: z.string().min(1, 'Name of officer is required'),
    sector: z.enum([
      'religious ceremony',
      'civil ceremony',
      'Muslim rites',
      'tribal rites',
    ]),
  }),
  3: z.object({
    a: agreementSchema.extend({
      licenseNo: z.number().min(1, 'License No. is required'),
      dateIssued: z.date(),
      placeOfSolemnizedMarriage: residenceSchema,
    }),
    b: agreementSchema.extend({
      underArticle: z.string().optional()
    })
  }),
  4: z.object({
    husbandCitizenship: citizenshipSchema,
    wifeCitizenship: citizenshipSchema
  }),
  5: z.string().min(1, ''),
  6: agreementSchema.extend({
    date: z.date().optional(),
    place: residenceSchema
  }),
  dateSworn: agreementSchema.extend({
    dayOf: z.date(),
    atPlaceOfSworn: residenceSchema,
    ctcInfo: z.object({
      number: z.string().min(1, 'CTC number is required'),
      dateIssued: z.string().min(1, 'Date issued is required'),
      placeIssued: z.string().min(1, 'Place issued is required'),
    }),
  }),
})

/**
 * Main Marriage Certificate Schema
 */
export const marriageCertificateSchema = z.object({
  // Registry Information
  // Registry Information
  registryNumber: registryNumberSchema,
  province: provinceSchema,
  cityMunicipality: cityMunicipalitySchema,

  // Consent Information
  wifeConsentPerson: consentPersonSchema,

  // Husband's Information
  husbandInfo: personalInformation.extend({
    husbandConsentPerson: consentPersonSchema,
    husbandParents: parentsSchema,
  }),

  // Wife's Information
  wifeInfo: personalInformation.extend({
    wifeConsentPerson: consentPersonSchema,
    wifeParents: parentsSchema,
  }),

  // Marriage Details
  marriageDetails: marriageDetailsSchema,

  // Witnesses
  husbandWitnesses: witnessSchema,
  wifeWitnesses: witnessSchema,


  //Contracting parties
  husbandContractParty: contractingParties,
  wifeContractParty: contractingParties,

  // Marriage License Details a.
  marriageLicenseDetails: marriageLicenseSchema,

  //marriage article schema b.
  marriageArticle: marriageArticleSchema,

  //marriage solemnized c.
  marriageSolemnized: agreementSchema,

  solemnizingOfficer: solemnizingOfficerSchema,

  // Received & Registered By
  receivedBy: recievedBySchema,

  registeredAtCivilRegistrar: registeredAtCivilRegistrarSchema,

  remarks: z.string().optional(),

  //*****BACK PAGE ***************************************** //
  affidavitOfSolemnizingOfficer: affidavitOfSolemnizingOfficerSchema,

  affidavitForDelayed: affidavitForDelayedSchema
});

// Export the TypeScript type for the form values
export type MarriageCertificateFormValues = z.infer<
  typeof marriageCertificateSchema
>;


export interface MarriageCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
