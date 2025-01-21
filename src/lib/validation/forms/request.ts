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
  feesPaid: z.number().optional().default(0.0),
  orNumber: z.string().optional(),
  datePaid: z.string().optional(),

  // Late Registration
  isRegisteredLate: z.boolean().optional().default(false),
  lateRegistrationDate: z.string().optional(),

  // Copies
  copies: z.number().int().min(0, 'Copies must be a positive number').optional().default(1),
}

// Marriage Request Schema
export const marriageRequestSchema = z.object({
  type: z.literal('MARRIAGE'),
  data: z.object({
    ...baseRequestFields,
    // Husband Information
    husbandName: z.string().min(1, "Please enter the husband's full name"),

    // Wife Information
    wifeMaidenName: z.string().min(1, "Please enter the wife's maiden name"),

    // Marriage Details
    dateOfMarriage: z.string().min(1, "Please select the date of marriage"),
    placeOfMarriage: z.string().min(1, "Please enter the place of marriage"),
  }),
})

// Death Request Schema
export const deathRequestSchema = z.object({
  type: z.literal('DEATH'),
  data: z.object({
    ...baseRequestFields,
    // Deceased Information
    nameOfDeceased: z.string().min(1, 'Full name of the deceased is required'),
    dateOfDeath: z.string().min(1, 'Date of death is required'),
    placeOfDeath: z.string().min(1, 'Place of death is required'),
  }),
})

// Birth Request Schema
export const birthRequestSchema = z.object({
  type: z.literal('BIRTH'),
  data: z.object({
    ...baseRequestFields,
    // Child Information
    nameOfChild: z.string().min(1, "Child's full name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    placeOfBirth: z.string().min(1, "Place of birth is required"),

    // Parents Information
    nameOfMother: z.string().min(1, "Mother's maiden name is required"),
    nameOfFather: z.string().min(1, "Father's full name is required"),
  }),
})

// Discriminated Union for All Request Types
export const requestSchema = z.discriminatedUnion('type', [
  marriageRequestSchema,
  deathRequestSchema,
  birthRequestSchema,
])

// Type Definitions
export type MarriageRequestData = z.infer<typeof marriageRequestSchema>['data']
export type DeathRequestData = z.infer<typeof deathRequestSchema>['data']
export type BirthRequestData = z.infer<typeof birthRequestSchema>['data']
export type RequestForm = z.infer<typeof requestSchema>