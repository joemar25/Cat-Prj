// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { FormType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// -----------------------------HELPER FUNCTION--------------//
function isValidDate(date: unknown, formType: FormType): boolean {
  switch (formType) {
    case FormType.BIRTH:
    // Birth certificate expects {year, month, day} format
    case FormType.BIRTH:
      if (
        typeof date === 'object' &&
        date !== null &&
        'year' in date &&
        'month' in date &&
        'day' in date
      ) {
        const { year, month, day } = date as {
          year: string | number;
          month: string | number;
          day: string | number;
        };

        const yearNum = parseInt(year.toString());
        const monthNum = parseInt(month.toString());
        const dayNum = parseInt(day.toString());

        // Validate ranges for year, month, and day
        if (
          yearNum >= 1945 &&
          yearNum <= new Date().getFullYear() && // Year should be valid
          monthNum >= 1 &&
          monthNum <= 12 && // Month should be 1-12
          dayNum >= 1 &&
          dayNum <= 31 // Day should be valid
        ) {
          const constructedDate = new Date(`${yearNum}-${monthNum}-${dayNum}`);
          return !isNaN(constructedDate.getTime());
        }
      }
      return false;

    case FormType.DEATH:
      // Death certificate expects Date object
      if (date instanceof Date) {
        return !isNaN(date.getTime());
      }
      return false;

    case FormType.MARRIAGE:
      // Marriage certificate also expects Date object like death certificate
      if (date instanceof Date) {
        const currentDate = new Date();
        // Additional marriage-specific validations:
        // 1. Date should not be in the future
        if (date > currentDate) {
          return false;
        }
        // 2. Date should not be before 1945 (matching our registry number validation)
        const minDate = new Date('1945-01-01');
        if (date < minDate) {
          return false;
        }
        return !isNaN(date.getTime());
      }
      return false;

    default:
      return false;
  }
}

// ----------------------------END OF HELPER FUNCTION----------------------------------------//
export async function createMarriageCertificate(
  data: MarriageCertificateFormValues
) {
  try {
    // 1. Validate registry number
    const exists = await checkRegistryNumberExists(
      data.registryNumber,
      FormType.MARRIAGE
    );
    if (exists) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // 2. Validate dates
    const marriageDate = new Date(data.dateOfMarriage);
    const husbandBirthDate = new Date(data.husbandDateOfBirth);
    const wifeBirthDate = new Date(data.wifeDateOfBirth);

    if (
      !isValidDate(marriageDate, FormType.MARRIAGE) ||
      !isValidDate(husbandBirthDate, FormType.MARRIAGE) ||
      !isValidDate(wifeBirthDate, FormType.MARRIAGE)
    ) {
      return {
        success: false,
        error:
          'Invalid date format in marriage, husband birth, or wife birth date',
      };
    }

    // 3. Validate marriage date is after both birth dates
    if (marriageDate < husbandBirthDate || marriageDate < wifeBirthDate) {
      return {
        success: false,
        error: 'Marriage date cannot be before birth dates',
      };
    }
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '97',
        formType: 'MARRIAGE',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',

        marriageCertificateForm: {
          create: {
            // Husband's Information
            husbandFirstName: data.husbandFirstName,
            husbandMiddleName: data.husbandMiddleName,
            husbandLastName: data.husbandLastName,
            husbandAge: data.husbandAge,
            husbandDateOfBirth: data.husbandDateOfBirth,
            husbandPlaceOfBirth: data.husbandPlaceOfBirth,
            husbandSex: data.husbandSex,
            husbandCitizenship: data.husbandCitizenship,
            husbandResidence: data.husbandResidence,
            husbandReligion: data.husbandReligion,
            husbandCivilStatus: data.husbandCivilStatus,

            // Husband's Parents
            husbandFatherName: data.husbandFatherName,
            husbandFatherCitizenship: data.husbandFatherCitizenship,
            husbandMotherMaidenName: data.husbandMotherMaidenName,
            husbandMotherCitizenship: data.husbandMotherCitizenship,

            // Wife's Information
            wifeFirstName: data.wifeFirstName,
            wifeMiddleName: data.wifeMiddleName,
            wifeLastName: data.wifeLastName,
            wifeAge: data.wifeAge,
            wifeDateOfBirth: data.wifeDateOfBirth,
            wifePlaceOfBirth: data.wifePlaceOfBirth,
            wifeSex: data.wifeSex,
            wifeCitizenship: data.wifeCitizenship,
            wifeResidence: data.wifeResidence,
            wifeReligion: data.wifeReligion,
            wifeCivilStatus: data.wifeCivilStatus,

            // Wife's Parents
            wifeFatherName: data.wifeFatherName,
            wifeFatherCitizenship: data.wifeFatherCitizenship,
            wifeMotherMaidenName: data.wifeMotherMaidenName,
            wifeMotherCitizenship: data.wifeMotherCitizenship,

            // Consent Information
            husbandConsentPerson: {
              name: data.husbandConsentGivenBy,
              relationship: data.husbandConsentRelationship,
              residence: data.husbandConsentResidence,
            },
            wifeConsentPerson: {
              name: data.wifeConsentGivenBy,
              relationship: data.wifeConsentRelationship,
              residence: data.wifeConsentResidence,
            },

            // Marriage Details
            placeOfMarriage: data.placeOfMarriage,
            dateOfMarriage: data.dateOfMarriage,
            timeOfMarriage: data.timeOfMarriage,

            // Required fields with default values
            marriageSettlement: false,
            witnesses: [],
            solemnizingOfficer: {
              name: 'Default Officer',
              position: 'Marriage Officer',
              religion: 'Roman Catholic',
              registryNoExpiryDate: '2025-12-31',
            },

            // Optional fields with default values
            marriageLicenseDetails: {
              number: 'LICENSE-2024-001',
              dateIssued: new Date().toISOString(),
              placeIssued: 'Malolos, Bulacan',
            },
            noMarriageLicense: false,
            executiveOrderApplied: false,
            presidentialDecreeApplied: false,
            contractingPartiesSignature: {
              husband: '',
              wife: '',
            },
            solemnizingOfficerSignature: '',
          },
        },
      },
    });

    revalidatePath('/civil-registry');
    return { success: true, data: baseForm };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to create marriage certificate: ${error.message}`,
      };
    }
    return { success: false, error: 'Failed to create marriage certificate' };
  }
}

// Death Certificate Server Action

export async function createDeathCertificate(
  data: DeathCertificateFormValues,
  ignoreDuplicate: boolean = false
) {
  try {
    // Parse and validate death and birth dates
    const dateOfDeath = new Date(data.personalInfo.dateOfDeath);
    if (isNaN(dateOfDeath.getTime())) {
      return { success: false, error: 'Invalid date of death' };
    }

    const dateOfBirth = new Date(data.personalInfo.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return { success: false, error: 'Invalid date of birth' };
    }

    // Validate registry number format before checking in DB
    if (!/\d{4}-\d{5}/.test(data.registryNumber)) {
      return {
        success: false,
        error: 'Registry number must be in the format YYYY-#####',
      };
    }

    // Validate registry number does not already exist
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber: data.registryNumber,
        formType: 'DEATH',
      },
    });

    if (existingRegistry) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // Check for duplicate deceased information
    if (!ignoreDuplicate) {
      const existingDeceased = await prisma.deathCertificateForm.findFirst({
        where: {
          AND: [
            {
              deceasedName: {
                path: ['firstName'],
                string_contains: data.personalInfo.firstName.trim(),
              },
            },
            {
              deceasedName: {
                path: ['lastName'],
                string_contains: data.personalInfo.lastName.trim(),
              },
            },
            {
              dateOfDeath: dateOfDeath,
            },
            {
              placeOfDeath: {
                path: ['cityMunicipality'],
                string_contains:
                  data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              },
            },
          ],
        },
      });

      if (existingDeceased) {
        return {
          success: false,
          warning: true,
          message:
            'Similar death record already exists. Do you want to proceed with saving this record?',
        };
      }
    }

    // Validate preparer exists
    const user = await prisma.user.findFirst({
      where: {
        name: data.preparedBy.name,
      },
    });

    if (!user) {
      return { success: false, error: 'Preparer not found' };
    }

    // Create the death certificate
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '103',
        formType: 'DEATH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',
        preparedBy: {
          connect: {
            id: user.id,
          },
        },
        deathCertificateForm: {
          create: {
            // Personal Information
            deceasedName: {
              firstName: data.personalInfo.firstName.trim(),
              middleName: data.personalInfo.middleName?.trim() || '',
              lastName: data.personalInfo.lastName.trim(),
            },
            sex: data.personalInfo.sex,
            dateOfDeath,
            dateOfBirth,
            placeOfDeath: {
              province: data.personalInfo.placeOfDeath.province.trim(),
              cityMunicipality:
                data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              specificAddress:
                data.personalInfo.placeOfDeath.specificAddress?.trim() || '',
            },
            placeOfBirth: {
              province: data.personalInfo.placeOfDeath.province.trim(),
              cityMunicipality:
                data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              specificAddress:
                data.personalInfo.placeOfDeath.specificAddress?.trim() || '',
            },
            civilStatus: data.personalInfo.civilStatus,
            religion: data.personalInfo.religion,
            citizenship: data.personalInfo.citizenship,
            residence: data.personalInfo.residence,
            occupation: data.personalInfo.occupation,

            // Family Information
            nameOfFather: {
              firstName: data.familyInfo.father.firstName.trim(),
              middleName: data.familyInfo.father.middleName?.trim() || '',
              lastName: data.familyInfo.father.lastName.trim(),
            },
            nameOfMother: {
              firstName: data.familyInfo.mother.firstName.trim(),
              middleName: data.familyInfo.mother.middleName?.trim() || '',
              lastName: data.familyInfo.mother.lastName.trim(),
            },

            // Medical Information
            causesOfDeath: {
              immediate: data.medicalCertificate.causesOfDeath.immediate,
              antecedent: data.medicalCertificate.causesOfDeath.antecedent,
              underlying: data.medicalCertificate.causesOfDeath.underlying,
              contributingConditions:
                data.medicalCertificate.causesOfDeath.contributingConditions ||
                '',
            },
            deathInterval: {
              interval: data.personalInfo.ageAtDeath.years,
            },
            pregnancy: false,
            attendedByPhysician: data.certification.hasAttended === 'Yes',
            mannerOfDeath: data.medicalCertificate.externalCauses.mannerOfDeath,
            placeOfOccurrence:
              data.medicalCertificate.externalCauses.placeOfOccurrence,

            // Certification
            certificationType: 'STANDARD',
            certifier: {
              name: data.certification.name,
              title: data.certification.title,
              address: data.certification.address,
              date: new Date(data.certification.date),
            },

            // Disposal Information
            disposalDetails: {
              method: data.disposal.method,
              burialPermit: {
                number: data.disposal.burialPermit.number,
                dateIssued: new Date(data.disposal.burialPermit.dateIssued),
              },
              transferPermit: data.disposal.transferPermit.number
                ? {
                    number: data.disposal.transferPermit.number,
                    dateIssued: data.disposal.transferPermit.dateIssued
                      ? new Date(data.disposal.transferPermit.dateIssued)
                      : null,
                  }
                : null,
              cemeteryAddress: data.disposal.cemeteryAddress,
            },

            // Informant Details
            informant: {
              name: data.informant.name,
              relationship: data.informant.relationship,
              address: data.informant.address,
              date: new Date(data.informant.date),
            },

            // Preparer Details
            preparer: {
              name: data.preparedBy.name,
              title: data.preparedBy.title,
              date: new Date(data.preparedBy.date),
            },
          },
        },
        // Additional base form fields
        receivedBy: data.receivedBy.name.trim(),
        receivedByPosition: data.receivedBy.title.trim(),
        receivedDate: new Date(data.receivedBy.date),
        registeredBy: data.registeredAtCivilRegistrar.name.trim(),
        registeredByPosition: data.registeredAtCivilRegistrar.title.trim(),
        registrationDate: new Date(data.registeredAtCivilRegistrar.date),
        remarks: data.remarks?.trim(),
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      data: baseForm,
      message: 'Death certificate created successfully',
    };
  } catch (error) {
    console.error('Error creating death certificate:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create death certificate',
    };
  }
}
// ------------------------------- Birth Certificate Server Action -------------------------------//

export async function createBirthCertificate(
  data: BirthCertificateFormValues,
  ignoreDuplicateChild: boolean = false // Add this flag
) {
  try {
    // Parse and validate child date of birth
    const dateOfBirth = new Date(data.childInfo.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return { success: false, error: 'Invalid date of birth' };
    }

    // Parse and validate parent marriage date
    const parentMarriageDate = new Date(data.parentMarriage.date);
    if (isNaN(parentMarriageDate.getTime())) {
      return { success: false, error: 'Invalid parent marriage date' };
    }

    // Validate registry number format before checking in DB
    if (!/\d{4}-\d{5}/.test(data.registryNumber)) {
      return {
        success: false,
        error: 'Registry number must be in the format YYYY-#####',
      };
    }

    // Validate registry number does not already exist
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber: data.registryNumber,
        formType: 'BIRTH',
      },
    });

    if (existingRegistry) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // Check for existing child information in the database (only if ignoreDuplicateChild is false)
    if (!ignoreDuplicateChild) {
      const existingChild = await prisma.birthCertificateForm.findFirst({
        where: {
          AND: [
            {
              childName: {
                path: ['firstName'],
                string_contains: data.childInfo.firstName.trim(),
              },
            },
            {
              childName: {
                path: ['lastName'],
                string_contains: data.childInfo.lastName.trim(),
              },
            },
            {
              dateOfBirth: dateOfBirth,
            },
            {
              placeOfBirth: {
                path: ['hospital'],
                string_contains: data.childInfo.placeOfBirth.hospital.trim(),
              },
            },
            {
              placeOfBirth: {
                path: ['cityMunicipality'],
                string_contains:
                  data.childInfo.placeOfBirth.cityMunicipality.trim(),
              },
            },
            {
              placeOfBirth: {
                path: ['province'],
                string_contains: data.childInfo.placeOfBirth.province.trim(),
              },
            },
          ],
        },
      });

      if (existingChild) {
        return {
          success: false,
          warning: true,
          message:
            'Child information already exists in the database. Do you want to proceed with saving this record?',
        };
      }
    }

    // Validate preparer exists
    const user = await prisma.user.findFirst({
      where: {
        name: data.preparedBy.name,
      },
    });

    if (!user) {
      return { success: false, error: 'Preparer not found' };
    }

    // Create the birth certificate
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '102',
        formType: 'BIRTH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',
        preparedBy: {
          connect: {
            id: user.id,
          },
        },
        birthCertificateForm: {
          create: {
            childName: {
              firstName: data.childInfo.firstName.trim(),
              middleName: data.childInfo.middleName?.trim() || '',
              lastName: data.childInfo.lastName.trim(),
            },
            sex: data.childInfo.sex,
            dateOfBirth: dateOfBirth,
            placeOfBirth: {
              hospital: data.childInfo.placeOfBirth.hospital.trim(),
              province: data.childInfo.placeOfBirth.province.trim(),
              cityMunicipality:
                data.childInfo.placeOfBirth.cityMunicipality.trim(),
            },
            typeOfBirth: data.childInfo.typeOfBirth,
            multipleBirthOrder: data.childInfo.multipleBirthOrder || null,
            birthOrder: data.childInfo.birthOrder || null,
            weightAtBirth: parseFloat(data.childInfo.weightAtBirth),
            motherMaidenName: {
              firstName: data.motherInfo.firstName.trim(),
              middleName: data.motherInfo.middleName?.trim() || '',
              lastName: data.motherInfo.lastName.trim(),
            },
            motherCitizenship: data.motherInfo.citizenship.trim(),
            motherReligion: data.motherInfo.religion?.trim(),
            motherOccupation: data.motherInfo.occupation?.trim(),
            motherAge: parseInt(data.motherInfo.age),
            motherResidence: {
              address: data.motherInfo.residence.address.trim(),
              province: data.motherInfo.residence.province.trim(),
              cityMunicipality:
                data.motherInfo.residence.cityMunicipality.trim(),
              country: data.motherInfo.residence.country.trim(),
            },
            totalChildrenBornAlive: parseInt(
              data.motherInfo.totalChildrenBornAlive
            ),
            childrenStillLiving: parseInt(data.motherInfo.childrenStillLiving),
            childrenNowDead: parseInt(data.motherInfo.childrenNowDead),
            fatherName: {
              firstName: data.fatherInfo.firstName.trim(),
              middleName: data.fatherInfo.middleName?.trim() || '',
              lastName: data.fatherInfo.lastName.trim(),
            },
            fatherCitizenship: data.fatherInfo.citizenship.trim(),
            fatherReligion: data.fatherInfo.religion?.trim(),
            fatherOccupation: data.fatherInfo.occupation?.trim(),
            fatherAge: parseInt(data.fatherInfo.age),
            fatherResidence: {
              address: data.fatherInfo.residence.address.trim(),
              province: data.fatherInfo.residence.province.trim(),
              cityMunicipality:
                data.fatherInfo.residence.cityMunicipality.trim(),
              country: data.fatherInfo.residence.country.trim(),
            },
            parentMarriage: {
              date: parentMarriageDate,
              place: {
                cityMunicipality:
                  data.parentMarriage.place.cityMunicipality.trim(),
                province: data.parentMarriage.place.province.trim(),
                country: data.parentMarriage.place.country.trim(),
              },
            },
            attendant: {
              type: data.attendant.type,
              certification: {
                time: data.attendant.certification.time,
                signature: data.attendant.certification.signature || '',
                name: data.attendant.certification.name.trim(),
                title: data.attendant.certification.title.trim(),
                address: data.attendant.certification.address.trim(),
                date: new Date(data.attendant.certification.date),
              },
            },
            informant: {
              signature: data.informant.signature || '',
              name: data.informant.name.trim(),
              relationship: data.informant.relationship.trim(),
              address: data.informant.address.trim(),
              date: new Date(data.informant.date),
            },
            preparer: {
              signature: data.preparedBy.signature || '',
              name: data.preparedBy.name.trim(),
              title: data.preparedBy.title.trim(),
              date: new Date(data.preparedBy.date),
            },
            hasAffidavitOfPaternity: false,
          },
        },
        receivedBy: data.receivedBy.name.trim(),
        receivedByPosition: data.receivedBy.title.trim(),
        receivedDate: new Date(data.receivedBy.date),
        registeredBy: data.registeredByOffice.name.trim(),
        registeredByPosition: data.registeredByOffice.title.trim(),
        registrationDate: new Date(data.registeredByOffice.date),
        remarks: data.remarks?.trim(),
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      data: baseForm,
      message: 'Birth certificate created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create birth certificate',
    };
  }
}

export async function checkRegistryNumberExists(
  registryNumber: string,
  formType: FormType
) {
  try {
    if (!registryNumber || !formType) {
      throw new Error(
        'Invalid input. Registry number and form type are required.'
      );
    }

    // Check if the registry number exists
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber,
        formType,
      },
    });

    return { exists: !!existingRegistry };
  } catch (error) {
    console.error('Error checking registry number:', error);
    return {
      error: 'Failed to check registry number. Please try again later.',
    };
  }
}
