// src/lib/validation/request_form.ts
import { z } from 'zod'

const baseRequestFields = {
  purpose: z.string().min(1, 'Purpose is required'),
  requesterName: z.string().min(1, 'Requester name is required'),
  relationshipToOwner: z.string().min(1, 'Relationship to owner is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  address: z.string().min(1, 'Address is required')
}

const sexEnum = z.enum(['MALE', 'FEMALE'])
const civilStatusEnum = z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED'])

export const birthRequestSchema = z.object({
  type: z.literal('BIRTH'),
  data: z.object({
    ...baseRequestFields,
    nameOfChild: z.string().min(1, 'Child name is required'),
    sex: sexEnum,
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    placeOfBirth: z.string().min(1, 'Place of birth is required'),
    nameOfMother: z.string().min(1, 'Mother name is required'),
    citizenshipMother: z.string().min(1, 'Mother citizenship is required'),
    nameOfFather: z.string().min(1, 'Father name is required'),
    citizenshipFather: z.string().min(1, 'Father citizenship is required'),
    dateMarriageParents: z.string().optional(),
    placeMarriageParents: z.string().optional()
  })
})

export const deathRequestSchema = z.object({
  type: z.literal('DEATH'),
  data: z.object({
    ...baseRequestFields,
    nameOfDeceased: z.string().min(1, 'Deceased name is required'),
    sex: sexEnum,
    age: z.number().int().min(0, 'Age must be a positive number'),
    civilStatus: civilStatusEnum,
    citizenship: z.string().min(1, 'Citizenship is required'),
    dateOfDeath: z.string().min(1, 'Date of death is required'),
    placeOfDeath: z.string().min(1, 'Place of death is required'),
    causeOfDeath: z.string().min(1, 'Cause of death is required')
  })
})

export const marriageRequestSchema = z.object({
  type: z.literal('MARRIAGE'),
  data: z.object({
    ...baseRequestFields,
    husbandName: z.string().min(1, 'Husband name is required'),
    husbandDateOfBirthAge: z.string().min(1, 'Husband date of birth/age is required'),
    husbandCitizenship: z.string().min(1, 'Husband citizenship is required'),
    husbandCivilStatus: civilStatusEnum,
    husbandMother: z.string().min(1, 'Husband mother name is required'),
    husbandFather: z.string().min(1, 'Husband father name is required'),
    wifeName: z.string().min(1, 'Wife name is required'),
    wifeDateOfBirthAge: z.string().min(1, 'Wife date of birth/age is required'),
    wifeCitizenship: z.string().min(1, 'Wife citizenship is required'),
    wifeCivilStatus: civilStatusEnum,
    wifeMother: z.string().min(1, 'Wife mother name is required'),
    wifeFather: z.string().min(1, 'Wife father name is required'),
    dateOfMarriage: z.string().min(1, 'Date of marriage is required'),
    placeOfMarriage: z.string().min(1, 'Place of marriage is required')
  })
})

export const requestSchema = z.discriminatedUnion('type', [
  birthRequestSchema,
  deathRequestSchema,
  marriageRequestSchema
])

export type BirthRequestData = z.infer<typeof birthRequestSchema>['data']
export type DeathRequestData = z.infer<typeof deathRequestSchema>['data']
export type MarriageRequestData = z.infer<typeof marriageRequestSchema>['data']
export type RequestForm = z.infer<typeof requestSchema>