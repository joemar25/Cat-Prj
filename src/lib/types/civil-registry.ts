export interface CivilRegistryForm {
    formType: 'FORM_1A' | 'FORM_2A' | 'FORM_3A'
    birthForm?: BirthForm
    deathForm?: DeathForm
    marriageForm?: MarriageForm
    preparedByName: string
    preparedByPosition: string
    verifiedByName: string
    verifiedByPosition: string
    civilRegistrar: string
    civilRegistrarPosition: string
}

export interface BirthForm {
    nameOfChild: string
    sex: string
    dateOfBirth: Date
    placeOfBirth: string
    nameOfMother: string
    citizenshipMother: string
    nameOfFather: string
    citizenshipFather: string
    dateMarriageParents?: Date | null
    placeMarriageParents?: string | null
}

export interface DeathForm {
    nameOfDeceased: string
    sex: string
    age: number
    civilStatus: string
    citizenship: string
    dateOfDeath: Date
    placeOfDeath: string
    causeOfDeath: string
}

export interface MarriageForm {
    husbandName: string
    husbandDateOfBirthAge: string
    husbandCitizenship: string
    husbandCivilStatus: string
    husbandMother: string
    husbandFather: string
    wifeName: string
    wifeDateOfBirthAge: string
    wifeCitizenship: string
    wifeCivilStatus: string
    wifeMother: string
    wifeFather: string
    dateOfMarriage: Date
    placeOfMarriage: string
}