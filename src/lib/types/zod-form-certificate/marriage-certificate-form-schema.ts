import { string, z } from 'zod';
import {
  citizenshipSchema,
  cityMunicipalitySchema,
  nameSchema,
  provinceSchema, // Factory function: provinceSchema(isOptional: boolean)
  registryNumberSchema,
  residenceSchema,
} from './form-certificates-shared-schema';

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
  placeOfMarriage: residenceSchema,
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
  agreement: z.boolean().default(false),
});

//signature
const signatureSchema = z.object({
  signature: z.string(),
  name: nameSchema.optional(),
  name2: z.string().optional(),
  position: z.string().optional()
});

// Personal Information Schema
const personalInformation = z.object({
  name: nameSchema,
  age: z.string(),
  birth: z.date(),
  placeOfBirth: residenceSchema,
  sex: z.enum(['male', 'female']).default('male'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  residence: z.string().min(1, 'Residence is required'),
  religion: z.string().optional(),
  civilStatus: z.enum(['single', 'widowed', 'divorced']),
});


const contractingPartiesSchema = z.object({
  signature: z.string().optional(),
  agreement: agreementSchema,

})

const marriageLicenseSchema = z.object({
  number: z.string().min(1, 'License number is required'),
  dateIssued: z.date(),
  placeIssued: z.string().min(1, 'Place issued is required'),
  marriageAgree: agreementSchema
})

const marriageArticleSchema = z.object({
  articleAgree: agreementSchema,
  articleExecutiveOrder: z
    .string()
    .min(1, 'Article must be between I and 99999')
    .max(6, 'Article must be at most 6 characters')
    .regex(
      /^(M{0,6}(CM|CD|D?C{0,4})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4}))$/,
      'Must be a valid Roman numeral (I - 99999)'
    ),
});

const recievedBySchema = z.object({
  signature: z.string().optional(),
  nameInPrint: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  date: z.date(),
})

const registeredAtCivilRegistrarSchema = z.object({
  signature: z.string().optional(),
  nameInPrint: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  date: z.date(),
})


const solemnizingOfficerSchema = z.object({
  name: z.string().min(1, 'Solemnizing officer name is required'),
  position: z.string().min(1, 'Position is required'),
  religion: z.string().optional(), // ✅ This makes it optional
  registryNoExpiryDate: z.string().min(1, 'Registry expiry date is required'),
})


const residenceSchemas = z.object({
  st: z.string().optional(),
  barangay: z.string().optional(),
  cityMunicipality: cityMunicipalitySchema, // Reuse shared city/municipality schema
  province: provinceSchema, // Reuse shared province schema
  country: z.string().nonempty('Country is required').optional(),
});


//*****BACK PAGE ***************************************** //
//*****BACK PAGE ***************************************** //
const affidavitOfSolemnizingOfficerSchema = z.object({
  administeringInformation: z.object({
    nameOfOfficer: z.string().min(1, 'Name of officer is required'),
    signatureOfOfficer: z.string().optional(),
    position: z.string().min(1, 'Position/Title/Designation is required'),
    addressOfOffice: residenceSchemas
  }),
  nameOfPlace: z.string().min(1, 'Name of place is required'),
  addressAt: z.string().min(1, 'Address at is required'),
  a: z.object({
    nameOfHusband: nameSchema,
    nameOfWife: nameSchema
  }),
  b: z.object({
    a: agreementSchema,
    b: agreementSchema,
    c: agreementSchema,
    d: agreementSchema,
    e: agreementSchema
  }),
  c: z.string().optional(),
  d: z.object({
    dayOf: z.date(),
    atPlaceOfMarriage: residenceSchemas,
  }),
  dateSworn: z.object({
    dayOf: z.date(),
    atPlaceOfSworn: residenceSchemas,
    ctcInfo: z.object({
      number: z.string().min(1, 'CTC number is required'),
      dateIssued: z.date(),
      placeIssued: z.string().min(1, 'Place issued is required'),
    }),
  }),
  nameOfAdmin: z.object({
    signature: signatureSchema,
    address: z.string().min(1, 'Address is required')
  })
})

const affidavitForDelayedSchema = z.object({
  administeringInformation: z.object({
    nameOfOfficer: z.string().min(1, 'Name of officer is required'),
    signatureOfAdmin: z.string().optional(),
    position: z.string().min(1, 'Position/Title/Designation is required'),
    addressOfOfficer: residenceSchemas
  }),
  applicantInformation: z.object({
    signatureOfApplicant: z.string().optional(),
    nameOfApplicant: z.string().min(1, 'Name of Applicant is required'),
    applicantAddress: residenceSchemas,
    postalCode: z
      .string()
      .min(4, 'Postal code must be at least 4 digits')
      .max(6, 'Postal code must be at most 6 digits')
      .regex(/^\d+$/, 'Postal code must contain only numbers')
  }),

  a: z.object({
    a: z.object({
      agreement: z.boolean().default(false),
      nameOfPartner: nameSchema.optional(),
      placeOfMarriage: z.string().min(1, 'Place of marriage is required').optional(),
      dateOfMarriage: z.date().optional(),
    }),
    b: z.object({
      agreement: z.boolean().default(false),
      nameOfHusband: nameSchema.optional(),
      nameOfWife: nameSchema.optional(),
      placeOfMarriage: z.string().min(1, 'Place of marriage is required').optional(),
      dateOfMarriage: z.date().optional(),
    }),
  }).refine((data) => {
    // Ensure only one agreement is true at a time
    return data.a.agreement !== data.b.agreement;
  }, 'You can only select one option (either a or b)'),

  b: z.object({
    solemnizedBy: z.string().min(1, 'Name of officer is required'),
    sector: z.enum([
      'religious-ceremony',
      'civil-ceremony',
      'Muslim-rites',
      'tribal-rites',
    ]),
  }),
  c: z.object({
    a: z.object({
      licenseNo: z.string().min(1, 'License number is required'),
      dateIssued: z.date(),
      placeOfSolemnizedMarriage: z.string().min(1, 'Place of Solemnized marriage'),
    }),
    b: z.object({
      underArticle: z.string().optional()
    })
  }),
  d: z.object({
    husbandCitizenship: citizenshipSchema,
    wifeCitizenship: citizenshipSchema
  }),
  e: z.string().nonempty('Add valid reason'),
  f: z.object({
    date: z.date().optional(),
    place: residenceSchemas
  }),
  dateSworn: z.object({
    dayOf: z.date(),
    atPlaceOfSworn: residenceSchemas,
    ctcInfo: z.object({
      number: z.string().min(1, 'CTC number is required'),
      dateIssued: z.date(),
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
  contractDay: z.date(),
  // Consent Information
  // wifeConsentPerson: consentPersonSchema,

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
  husbandContractParty: z.object({
    contractingParties: contractingPartiesSchema
  }),
  wifeContractParty: z.object({
    contractingParties: contractingPartiesSchema
  }),

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
