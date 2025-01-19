// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  BirthCertificateFormValues,
  DeathCertificateFormValues,
  MarriageCertificateFormValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { FormType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// -----------------------------HELPER FUNCTION--------------//
function isValidDate(date: unknown, formType: FormType): boolean {
  switch (formType) {
    case FormType.BIRTH:
      // Birth certificate expects {year, month, day} format
      if (
        typeof date === 'object' &&
        date !== null &&
        'year' in date &&
        'month' in date &&
        'day' in date
      ) {
        const { year, month, day } = date as {
          year: string;
          month: string;
          day: string;
        };
        const constructedDate = new Date(`${year}-${month}-${day}`);
        return (
          constructedDate instanceof Date && !isNaN(constructedDate.getTime())
        );
      }
      return false;

    case FormType.DEATH:
      // Death certificate expects Date object
      if (date instanceof Date) {
        return !isNaN(date.getTime());
      }
      return false;

    case FormType.MARRIAGE:
      // Marriage certificate validation can be added here
      return false;

    default:
      return false;
  }
}
export async function generateRegistryNumber(formType: FormType) {
  try {
    const currentYear = new Date().getFullYear();

    // Use transaction to prevent race conditions
    return await prisma.$transaction(async (tx) => {
      const birthCertCount = await tx.birthCertificateForm.count({
        where: {
          baseForm: {
            AND: [
              {
                dateOfRegistration: {
                  gte: new Date(currentYear, 0, 1),
                  lt: new Date(currentYear + 1, 0, 1),
                },
              },
              { formType: formType },
            ],
          },
        },
      });

      const nextSequence = birthCertCount + 1;

      if (nextSequence > 99999) {
        throw new Error(
          'Maximum registry number sequence reached for the year'
        );
      }

      const registryNumber = `${currentYear}-${nextSequence
        .toString()
        .padStart(5, '0')}`;

      // Verify within the same transaction
      const existingRegistry = await tx.baseRegistryForm.findFirst({
        where: {
          registryNumber,
          formType,
          dateOfRegistration: {
            gte: new Date(currentYear, 0, 1),
            lt: new Date(currentYear + 1, 0, 1),
          },
        },
      });

      if (existingRegistry) {
        throw new Error('Registry number already exists');
      }

      return registryNumber;
    });
  } catch (error) {
    console.error('Error generating registry number:', error);
    throw new Error('Failed to generate registry number');
  }
}

export async function checkRegistryNumberExists(registryNumber: string) {
  try {
    const [year, sequence] = registryNumber.split('-');
    const yearNum = parseInt(year);
    const sequenceNum = parseInt(sequence);

    if (yearNum < 1945 || yearNum > new Date().getFullYear()) {
      throw new Error('Invalid registration year');
    }

    if (sequenceNum <= 0 || sequenceNum > 99999) {
      throw new Error('Invalid sequence number');
    }

    // Use transaction to ensure consistency
    return await prisma.$transaction(async (tx) => {
      const existingForm = await tx.baseRegistryForm.findFirst({
        where: {
          registryNumber,
          formType: FormType.BIRTH,
          dateOfRegistration: {
            gte: new Date(yearNum, 0, 1),
            lt: new Date(yearNum + 1, 0, 1),
          },
        },
      });

      if (existingForm) {
        throw new Error(`Registry number ${registryNumber} already exists`);
      }

      if (sequenceNum > 1) {
        const previousCount = await tx.birthCertificateForm.count({
          where: {
            baseForm: {
              AND: [
                {
                  dateOfRegistration: {
                    gte: new Date(yearNum, 0, 1),
                    lt: new Date(yearNum + 1, 0, 1),
                  },
                },
                { formType: FormType.BIRTH },
              ],
            },
          },
        });

        if (sequenceNum > previousCount + 1) {
          throw new Error(
            `Cannot use registry number ${registryNumber}. Please use number ${yearNum}-${(
              previousCount + 1
            )
              .toString()
              .padStart(5, '0')}`
          );
        }
      }

      return false;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to check registry number');
  }
}

// ----------------------------END OF HELPER FUNCTION----------------------------------------//
export async function createMarriageCertificate(
  data: MarriageCertificateFormValues
) {
  try {
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
    console.error('Error creating marriage certificate:', error);
    return { success: false, error: 'Failed to create marriage certificate' };
  }
}

// Death Certificate Server Action
export async function createDeathCertificate(data: DeathCertificateFormValues) {
  try {
    // 1. Validate registry number
    const exists = await checkRegistryNumberExists(data.registryNumber);
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
          connectOrCreate: {
            where: {
              email: `${data.preparedBy.name
                .toLowerCase()
                .replace(/\s+/g, '.')}@example.com`,
            },
            create: {
              id: crypto.randomUUID(),
              name: data.preparedBy.name,
              email: `${data.preparedBy.name
                .toLowerCase()
                .replace(/\s+/g, '.')}@example.com`,
              username: data.preparedBy.name.toLowerCase().replace(/\s+/g, '.'),
              emailVerified: true,
            },
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

// Complete birth certificate creation with validation
export async function createBirthCertificate(data: BirthCertificateFormValues) {
  try {
    // 1. Validate registry number
    const exists = await checkRegistryNumberExists(data.registryNumber);
    if (exists) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // 2. Validate dates
    if (!isValidDate(data.childInfo.dateOfBirth, FormType.BIRTH)) {
      return {
        success: false,
        error: 'Invalid date of birth',
      };
    }

    // 3. Create the birth certificate
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
          connectOrCreate: {
            where: {
              email: `${data.preparedBy.name
                .toLowerCase()
                .replace(/\s+/g, '.')}@example.com`,
            },
            create: {
              id: crypto.randomUUID(),
              name: data.preparedBy.name,
              email: `${data.preparedBy.name
                .toLowerCase()
                .replace(/\s+/g, '.')}@example.com`,
              username: data.preparedBy.name.toLowerCase().replace(/\s+/g, '.'),
              emailVerified: true,
            },
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
            dateOfBirth: new Date(
              `${data.childInfo.dateOfBirth.year}-${data.childInfo.dateOfBirth.month}-${data.childInfo.dateOfBirth.day}`
            ),
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
              date: new Date(
                `${data.parentMarriage.date.year}-${data.parentMarriage.date.month}-${data.parentMarriage.date.day}`
              ),
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
    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to create birth certificate: ${error.message}`,
      };
    }
    return {
      success: false,
      error: 'Failed to create birth certificate',
    };
  }
}
