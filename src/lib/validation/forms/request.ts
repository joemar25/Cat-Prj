// src\lib\validation\forms\request.ts
import { z } from 'zod'

// Common fields for all request types
const baseRequestFields = {
  // Requesters Information
  requesterName: z.string().min(1, 'Requester name is required'),
  relationshipToOwner: z.string().min(1, 'Relationship to owner is required'),
  address: z.string().min(1, 'Address is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  date: z.string().min(1, 'Date is required'),

  // Form Details
  lcrNo: z.string().optional(),
  bookNo: z.string().optional(),
  pageNo: z.string().optional(),
  searchedBy: z.string().optional(),

  // Payment Details
  feesPaid: z.number().optional(),
  orNumber: z.string().optional(),
  datePaid: z.string().optional(),

  // Late Registration
  isRegisteredLate: z.boolean().optional().default(false),
  lateRegistrationDate: z.string().optional(),

  // Officials
  civilRegistrar: z.string().min(1, 'Civil registrar is required'),
  civilRegistrarPosition: z.string().min(1, 'Civil registrar position is required'),
  preparedByName: z.string().optional(),
  preparedByPosition: z.string().optional(),
  verifiedByName: z.string().optional(),
  verifiedByPosition: z.string().optional(),

  // Remarks
  remarks: z.string().optional(),

  // Copies
  copies: z.number().int().min(0, 'Copies must be a positive number').optional().default(0),
}

// Enums for validation
const sexEnum = z.enum(['MALE', 'FEMALE'])
const civilStatusEnum = z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED'])

// Birth Request Schema
export const birthRequestSchema = z.object({
  type: z.literal('BIRTH'),
  data: z.object({
    ...baseRequestFields,
    // Child Information
    nameOfChild: z.string().min(1, 'Child name is required'),
    sex: sexEnum,
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    placeOfBirth: z.string().min(1, 'Place of birth is required'),

    // Mother Information
    nameOfMother: z.string().min(1, 'Mother name is required'),
    citizenshipMother: z.string().min(1, 'Mother citizenship is required'),

    // Father Information
    nameOfFather: z.string().min(1, 'Father name is required'),
    citizenshipFather: z.string().min(1, 'Father citizenship is required'),

    // Parents Marriage Details
    dateMarriageParents: z.string().optional(),
    placeMarriageParents: z.string().optional(),
  }),
})

// Death Request Schema
export const deathRequestSchema = z.object({
  type: z.literal('DEATH'),
  data: z.object({
    ...baseRequestFields,
    // Deceased Information
    nameOfDeceased: z.string().min(1, 'Deceased name is required'),
    sex: sexEnum,
    age: z.number().int().min(0, 'Age must be a positive number'),
    civilStatus: civilStatusEnum,
    citizenship: z.string().min(1, 'Citizenship is required'),
    dateOfDeath: z.string().min(1, 'Date of death is required'),
    placeOfDeath: z.string().min(1, 'Place of death is required'),
    causeOfDeath: z.string().optional(),
  }),
})

// Marriage Request Schema
export const marriageRequestSchema = z.object({
  type: z.literal('MARRIAGE'),
  data: z.object({
    ...baseRequestFields,
    // Husband Information
    husbandName: z.string().min(1, "Please enter the husband's full name"),
    husbandDateOfBirthAge: z.string().optional(),
    husbandCitizenship: z.string().optional(),
    husbandCivilStatus: civilStatusEnum.optional(),
    husbandMother: z.string().optional(),
    husbandFather: z.string().optional(),

    // Wife Information
    wifeName: z.string().min(1, "Please enter the wife's full name"),
    wifeDateOfBirthAge: z.string().optional(),
    wifeCitizenship: z.string().optional(),
    wifeCivilStatus: civilStatusEnum.optional(),
    wifeMother: z.string().optional(),
    wifeFather: z.string().optional(),

    // Marriage Details
    dateOfMarriage: z.string().min(1, "Please select the date of marriage"),
    placeOfMarriage: z.string().min(1, "Please enter the place of marriage"),
  }),
})

// Discriminated Union for All Request Types
export const requestSchema = z.discriminatedUnion('type', [
  birthRequestSchema,
  deathRequestSchema,
  marriageRequestSchema,
])

// Type Definitions
export type BirthRequestData = z.infer<typeof birthRequestSchema>['data']
export type DeathRequestData = z.infer<typeof deathRequestSchema>['data']
export type MarriageRequestData = z.infer<typeof marriageRequestSchema>['data']
export type RequestForm = z.infer<typeof requestSchema>