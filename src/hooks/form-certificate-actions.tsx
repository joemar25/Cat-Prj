// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  BirthCertificateFormValues,
  DeathCertificateFormValues,
  MarriageCertificateFormValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { parseToDate } from '@/utils/date';
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
export async function createDeathCertificate(data: DeathCertificateFormValues) {
  try {
    // 1. Validate registry number
    const exists = await checkRegistryNumberExists(
      data.registryNumber,
      FormType.DEATH
    );
    if (exists) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // 2. Validate dates
    if (
      !isValidDate(data.dateOfDeath, FormType.DEATH) ||
      !isValidDate(data.dateOfBirth, FormType.DEATH)
    ) {
      return {
        success: false,
        error: 'Invalid date of death or date of birth',
      };
    }

    // 3. Validate death date is after birth date
    if (data.dateOfDeath < data.dateOfBirth) {
      return {
        success: false,
        error: 'Date of death cannot be before date of birth',
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        name: data.preparedBy.name,
      },
    });

    if (!user) {
      throw new Error('Preparer not found');
    }
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '103', // Form 103 for Death Certificate
        formType: 'DEATH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1', // Default for testing
        bookNumber: '1', // Default for testing
        dateOfRegistration: new Date(),
        status: 'PENDING',
        preparedBy: {
          connect: {
            id: user.id,
          },
        },

        deathCertificateForm: {
          create: {
            // Deceased Information
            deceasedName: {
              first: data.name.first,
              middle: data.name.middle,
              last: data.name.last,
            },
            sex: data.sex,
            dateOfDeath: data.dateOfDeath,
            placeOfDeath: {
              cityMunicipality: data.placeOfDeath,
              province: data.province,
            },
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: {
              cityMunicipality: data.placeOfDeath,
              province: data.province,
            },
            civilStatus: data.civilStatus,
            religion: data.religion,
            citizenship: data.citizenship,
            residence: {
              houseNo: '', // You might want to parse this from data.residence
              barangay: '', // Parse from data.residence
              cityMunicipality: data.cityMunicipality,
              province: data.province,
            },
            occupation: data.occupation,

            // Parents Information
            nameOfFather: data.fatherName,
            nameOfMother: data.motherMaidenName,

            // Medical Information
            causesOfDeath: {
              immediate: data.causesOfDeath.immediate,
              antecedent: data.causesOfDeath.antecedent,
              underlying: data.causesOfDeath.underlying,
              otherSignificant: data.causesOfDeath.contributingConditions,
            },
            deathInterval: {}, // Add appropriate data structure
            pregnancy:
              data.sex === 'Female' ? data.maternalCondition !== 'none' : false,
            attendedByPhysician: data.certification.hasAttended,
            mannerOfDeath: data.deathByExternalCauses.mannerOfDeath,
            placeOfOccurrence: data.deathByExternalCauses.placeOfOccurrence,

            // Certification
            certificationType: 'Hospital Authority', // Adjust based on data
            certifier: {
              name: data.certification.nameInPrint,
              title: data.certification.titleOfPosition,
              address: data.certification.address,
              signature: data.certification.signature,
              date: data.certification.date,
            },

            // Disposal
            disposalDetails: {
              method: data.disposal.method,
              place: data.cemeteryAddress,
              date: data.disposal.burialPermit.dateIssued,
            },

            // Informant
            informant: {
              name: data.informant.nameInPrint,
              signature: data.informant.signature,
              relationship: data.informant.relationshipToDeceased,
              address: data.informant.address,
              date: data.informant.date,
            },

            // Preparer
            preparer: {
              name: data.preparedBy.name, // Update 'nameInPrint' to 'name'
              signature: data.preparedBy.signature,
              title: data.preparedBy.title, // Update 'titleOrPosition' to 'title'
              date: data.preparedBy.date,
            },

            // Burial Permit
            burialPermit: data.disposal.burialPermit.number
              ? {
                  number: data.disposal.burialPermit.number,
                  date: data.disposal.burialPermit.dateIssued.toISOString(), // Convert Date to string
                  cemetery: data.cemeteryAddress,
                }
              : undefined, // Use undefined instead of null
          },
        },
      },
    });

    revalidatePath('/civil-registry'); // Adjust based on your route
    return { success: true, data: baseForm };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to create death certificate: ${error.message}`,
      };
    }
    return { success: false, error: 'Failed to create death certificate' };
  }
}

// ------------------------------- Birth Certificate Server Action -------------------------------//

export async function createBirthCertificate(data: BirthCertificateFormValues) {
  try {
    // Parse and validate child date of birth
    const dateOfBirth = parseToDate(
      data.childInfo.dateOfBirth.year,
      data.childInfo.dateOfBirth.month,
      data.childInfo.dateOfBirth.day
    );

    if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
      return { success: false, error: 'Invalid date of birth' };
    }

    // Parse and validate parent marriage date
    const parentMarriageDate = parseToDate(
      data.parentMarriage.date.year,
      data.parentMarriage.date.month,
      data.parentMarriage.date.day
    );

    if (!parentMarriageDate || isNaN(parentMarriageDate.getTime())) {
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
        formType: FormType.BIRTH,
      },
    });

    if (existingRegistry) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
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

    // Validate place of birth fields
    if (
      !data.childInfo.placeOfBirth.hospital ||
      !data.childInfo.placeOfBirth.cityMunicipality ||
      !data.childInfo.placeOfBirth.province
    ) {
      return { success: false, error: 'Place of birth fields are incomplete' };
    }

    // Validate mother and father details
    if (!data.motherInfo.firstName || !data.motherInfo.lastName) {
      return { success: false, error: 'Mother information is incomplete' };
    }

    if (!data.fatherInfo.firstName || !data.fatherInfo.lastName) {
      return { success: false, error: 'Father information is incomplete' };
    }

    // Create the birth certificate
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        // Base Registry Form Fields
        formNumber: '102',
        formType: 'BIRTH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(), // Current date
        status: 'PENDING',

        // Preparer Information
        preparedBy: {
          connect: {
            id: user.id,
          },
        },
        // Birth Certificate Form
        birthCertificateForm: {
          create: {
            // Child Information
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
            weightAtBirth: data.childInfo.weightAtBirth,

            // Mother Information
            motherMaidenName: {
              firstName: data.motherInfo.firstName.trim(),
              middleName: data.motherInfo.middleName?.trim() || '',
              lastName: data.motherInfo.lastName.trim(),
            },
            motherCitizenship: data.motherInfo.motherCitizenship.trim(),
            motherReligion: data.motherInfo.motherReligion?.trim(),
            motherOccupation: data.motherInfo.motherOccupation?.trim(),
            motherAge: parseInt(data.motherInfo.motherAge),
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

            // Father Information
            fatherName: {
              firstName: data.fatherInfo.firstName.trim(),
              middleName: data.fatherInfo.middleName?.trim() || '',
              lastName: data.fatherInfo.lastName.trim(),
            },
            fatherCitizenship: data.fatherInfo.fatherCitizenship.trim(),
            fatherReligion: data.fatherInfo.fatherReligion?.trim(),
            fatherOccupation: data.fatherInfo.fatherOccupation?.trim(),
            fatherAge: parseInt(data.fatherInfo.fatherAge),
            fatherResidence: {
              address: data.fatherInfo.residence.address.trim(),
              province: data.fatherInfo.residence.province.trim(),
              cityMunicipality:
                data.fatherInfo.residence.cityMunicipality.trim(),
              country: data.fatherInfo.residence.country.trim(),
            },

            // Marriage Information
            parentMarriage: {
              date: parentMarriageDate,
              place: {
                cityMunicipality:
                  data.parentMarriage.place.cityMunicipality.trim(),
                province: data.parentMarriage.place.province.trim(),
                country: data.parentMarriage.place.country.trim(),
              },
            },

            // Certification Details
            attendant: {
              type: data.attendant.type,
              certification: {
                time: data.attendant.certification.time,
                signature: data.attendant.certification.signature || '',
                name: data.attendant.certification.name.trim(),
                title: data.attendant.certification.title.trim(),
                address: data.attendant.certification.address.trim(),
                date: data.attendant.certification.date,
              },
            },

            // Informant Details
            informant: {
              signature: data.informant.signature || '',
              name: data.informant.name.trim(),
              relationship: data.informant.relationship.trim(),
              address: data.informant.address.trim(),
              date: data.informant.date,
            },

            // Preparer Details
            preparer: {
              signature: data.preparedBy.signature || '',
              name: data.preparedBy.name.trim(),
              title: data.preparedBy.title.trim(),
              date: data.preparedBy.date,
            },

            hasAffidavitOfPaternity: false,
          },
        },

        // Registry Form Additional Fields
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
    console.error('Error creating birth certificate:', error);
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
