// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
import { formatAddress } from '@/lib/utils/location-helpers';
import { isValidDate } from '@/utils/certificate-helper-functions';
import { FormType, Sex } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type BirthCertificateResponse =
  | { success: true; data: any; message: string }
  | { success: false; warning?: boolean; message: string }
  | { success: false; error: string };

// -----------------------------HELPER FUNCTION--------------//

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
    // Check for required dates using the new deceasedInfo key
    if (!data.deceasedInfo.dateOfDeath) {
      return { success: false, error: 'Date of death is required' };
    }
    if (!data.deceasedInfo.dateOfBirth) {
      return { success: false, error: 'Date of birth is required' };
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
                string_contains: data.deceasedInfo.firstName.trim(),
              },
            },
            {
              deceasedName: {
                path: ['lastName'],
                string_contains: data.deceasedInfo.lastName.trim(),
              },
            },
            { dateOfDeath: data.deceasedInfo.dateOfDeath },
            {
              placeOfDeath: {
                path: ['cityMunicipality'],
                string_contains:
                  data.deceasedInfo.placeOfDeath.cityMunicipality.trim(),
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
      where: { name: data.preparedBy.name },
    });
    if (!user) {
      return { success: false, error: 'Preparer not found' };
    }

    // Create the death certificate using BaseRegistryForm with a nested deathCertificateForm
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
          connect: { id: user.id },
        },
        deathCertificateForm: {
          create: {
            // Deceased Information (using deceasedInfo)
            deceasedName: {
              firstName: data.deceasedInfo.firstName.trim(),
              middleName: data.deceasedInfo.middleName?.trim() || '',
              lastName: data.deceasedInfo.lastName.trim(),
            },
            sex: data.deceasedInfo.sex,
            dateOfDeath: data.deceasedInfo.dateOfDeath,
            dateOfBirth: data.deceasedInfo.dateOfBirth,
            // Map the address for place of death
            placeOfDeath: {
              houseNumber: data.deceasedInfo.placeOfDeath.houseNumber,
              street: data.deceasedInfo.placeOfDeath.street,
              barangay: data.deceasedInfo.placeOfDeath.barangay,
              cityMunicipality: data.deceasedInfo.placeOfDeath.cityMunicipality,
              province: data.deceasedInfo.placeOfDeath.province,
              country: data.deceasedInfo.placeOfDeath.country,
            },
            // For backward compatibility, set placeOfBirth the same as placeOfDeath
            placeOfBirth: {
              houseNumber: data.deceasedInfo.placeOfDeath.houseNumber,
              street: data.deceasedInfo.placeOfDeath.street,
              barangay: data.deceasedInfo.placeOfDeath.barangay,
              cityMunicipality: data.deceasedInfo.placeOfDeath.cityMunicipality,
              province: data.deceasedInfo.placeOfDeath.province,
              country: data.deceasedInfo.placeOfDeath.country,
            },
            civilStatus: data.deceasedInfo.civilStatus,
            religion: data.deceasedInfo.religion,
            citizenship: data.deceasedInfo.citizenship,
            residence: {
              houseNumber: data.deceasedInfo.residence.houseNumber,
              street: data.deceasedInfo.residence.street,
              barangay: data.deceasedInfo.residence.barangay,
              cityMunicipality: data.deceasedInfo.residence.cityMunicipality,
              province: data.deceasedInfo.residence.province,
              country: data.deceasedInfo.residence.country,
            },
            occupation: data.deceasedInfo.occupation,

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

            // Medical Certificate
            causesOfDeath: {
              immediate: data.medicalCertificate.causesOfDeath.immediate,
              antecedent: data.medicalCertificate.causesOfDeath.antecedent,
              underlying: data.medicalCertificate.causesOfDeath.underlying,
              contributingConditions:
                data.medicalCertificate.causesOfDeath.contributingConditions ||
                '',
            },
            // Save the full ageAtDeath object (years, months, days, hours)
            deathInterval: data.deceasedInfo.ageAtDeath,
            pregnancy: false,
            attendedByPhysician: data.certification.hasAttended === 'Yes',
            mannerOfDeath: data.medicalCertificate.externalCauses.mannerOfDeath,
            placeOfOccurrence:
              data.medicalCertificate.externalCauses.placeOfOccurrence,

            // Certification Information
            certificationType: 'STANDARD',
            certifier: {
              signature: data.certification.signature,
              name: data.certification.name,
              title: data.certification.title,
              address: {
                houseNumber: data.certification.address.houseNumber,
                street: data.certification.address.street,
                barangay: data.certification.address.barangay,
                cityMunicipality: data.certification.address.cityMunicipality,
                province: data.certification.address.province,
                country: data.certification.address.country,
              },
              date: data.certification.date,
            },

            // Disposal Information
            disposalDetails: {
              method: data.disposal.method,
              burialPermit: {
                number: data.disposal.burialPermit.number,
                dateIssued: data.disposal.burialPermit.dateIssued,
              },
              transferPermit: data.disposal.transferPermit.number
                ? {
                    number: data.disposal.transferPermit.number,
                    dateIssued: data.disposal.transferPermit.dateIssued || null,
                  }
                : null,
              cemeteryAddress: data.disposal.cemeteryAddress,
            },

            // Informant Details
            informant: {
              signature: data.informant.signature,
              name: data.informant.name,
              relationship: data.informant.relationship,
              address: {
                houseNumber: data.informant.address.houseNumber,
                street: data.informant.address.street,
                barangay: data.informant.address.barangay,
                cityMunicipality: data.informant.address.cityMunicipality,
                province: data.informant.address.province,
                country: data.informant.address.country,
              },
              date: data.informant.date,
            },

            // Preparer Details
            preparer: {
              signature: data.preparedBy.signature,
              name: data.preparedBy.name,
              title: data.preparedBy.title,
              date: data.preparedBy.date,
            },
          },
        },
        // Additional Base Form fields
        receivedBy: data.receivedBy.name.trim(),
        receivedByPosition: data.receivedBy.title.trim(),
        receivedDate: data.receivedBy.date,
        registeredBy: data.registeredAtCivilRegistrar.name.trim(),
        registeredByPosition: data.registeredAtCivilRegistrar.title.trim(),
        registrationDate: data.registeredAtCivilRegistrar.date,
        remarks: data.remarks?.trim(),
      },
    });

    // Revalidate the civil registry path (or any other necessary path)
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
  ignoreDuplicateChild: boolean = false
): Promise<BirthCertificateResponse> {
  try {
    // Data sanitization
    const sanitizedData = {
      ...data,
      registryNumber: data.registryNumber.trim(),
      province: data.province.trim(),
      cityMunicipality: data.cityMunicipality.trim(),
      childInfo: {
        ...data.childInfo,
        firstName: data.childInfo.firstName.trim(),
        middleName: data.childInfo.middleName?.trim() || '',
        lastName: data.childInfo.lastName.trim(),
        placeOfBirth: {
          hospital: data.childInfo.placeOfBirth.hospital.trim(),
          cityMunicipality: data.childInfo.placeOfBirth.cityMunicipality.trim(),
          province: data.childInfo.placeOfBirth.province.trim(),
        },
      },
      motherInfo: {
        ...data.motherInfo,
        firstName: data.motherInfo.firstName.trim(),
        middleName: data.motherInfo.middleName?.trim() || '',
        lastName: data.motherInfo.lastName.trim(),
        citizenship: data.motherInfo.citizenship.trim(),
        religion: data.motherInfo.religion?.trim(),
        occupation: data.motherInfo.occupation?.trim(),
      },
      fatherInfo: {
        ...data.fatherInfo,
        firstName: data.fatherInfo.firstName.trim(),
        middleName: data.fatherInfo.middleName?.trim() || '',
        lastName: data.fatherInfo.lastName.trim(),
        citizenship: data.fatherInfo.citizenship.trim(),
        religion: data.fatherInfo.religion?.trim(),
        occupation: data.fatherInfo.occupation?.trim(),
      },
    };

    // Validate registry number format (expects YYYY-#####)
    if (!/\d{4}-\d+/.test(sanitizedData.registryNumber)) {
      return {
        success: false,
        error: 'Registry number must be in format: YYYY-numbers',
      };
    }

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Check for existing registry number
      const existingRegistry = await tx.baseRegistryForm.findFirst({
        where: {
          registryNumber: sanitizedData.registryNumber,
          formType: FormType.BIRTH,
        },
      });

      if (existingRegistry) {
        throw new Error(
          'Registry number already exists. Please use a different number.'
        );
      }

      // Check for duplicate child if not ignoring
      if (!ignoreDuplicateChild && sanitizedData.childInfo.dateOfBirth) {
        const existingChild = await tx.birthCertificateForm.findFirst({
          where: {
            AND: [
              {
                childName: {
                  path: ['firstName'],
                  string_contains: sanitizedData.childInfo.firstName,
                },
              },
              {
                childName: {
                  path: ['lastName'],
                  string_contains: sanitizedData.childInfo.lastName,
                },
              },
              { dateOfBirth: sanitizedData.childInfo.dateOfBirth },
              {
                placeOfBirth: {
                  path: ['hospital'],
                  string_contains:
                    sanitizedData.childInfo.placeOfBirth.hospital,
                },
              },
              {
                placeOfBirth: {
                  path: ['cityMunicipality'],
                  string_contains:
                    sanitizedData.childInfo.placeOfBirth.cityMunicipality,
                },
              },
              {
                placeOfBirth: {
                  path: ['province'],
                  string_contains:
                    sanitizedData.childInfo.placeOfBirth.province,
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

      // Validate that the preparer exists
      const user = await tx.user.findFirst({
        where: {
          name: sanitizedData.preparedBy.name,
        },
      });

      if (!user) {
        throw new Error('Preparer not found');
      }

      // Build optional payloads.
      // Only include the nested object if it is not null.
      const affidavitOfPaternityPayload =
        sanitizedData.hasAffidavitOfPaternity &&
        sanitizedData.affidavitOfPaternityDetails !== null
          ? {
              affidavitOfPaternityDetails:
                sanitizedData.affidavitOfPaternityDetails,
            }
          : {};

      const delayedRegistrationPayload =
        sanitizedData.isDelayedRegistration &&
        sanitizedData.affidavitOfDelayedRegistration !== null
          ? {
              reasonForDelay:
                sanitizedData.affidavitOfDelayedRegistration.reasonForDelay,
              affidavitOfDelayedRegistration:
                sanitizedData.affidavitOfDelayedRegistration,
            }
          : {};

      // Create the base registry form with nested birth certificate
      const baseForm = await tx.baseRegistryForm.create({
        data: {
          formNumber: '102',
          formType: FormType.BIRTH,
          registryNumber: sanitizedData.registryNumber,
          province: sanitizedData.province,
          cityMunicipality: sanitizedData.cityMunicipality,
          pageNumber: '1',
          bookNumber: '1',
          dateOfRegistration: new Date(),
          status: 'PENDING',
          preparedBy: {
            connect: { id: user.id },
          },
          birthCertificateForm: {
            create: {
              childName: {
                firstName: sanitizedData.childInfo.firstName,
                middleName: sanitizedData.childInfo.middleName,
                lastName: sanitizedData.childInfo.lastName,
              },
              sex: sanitizedData.childInfo.sex as Sex,
              dateOfBirth: sanitizedData.childInfo.dateOfBirth || new Date(),
              placeOfBirth: sanitizedData.childInfo.placeOfBirth,
              typeOfBirth: sanitizedData.childInfo.typeOfBirth,
              multipleBirthOrder: sanitizedData.childInfo.multipleBirthOrder,
              birthOrder: sanitizedData.childInfo.birthOrder,
              weightAtBirth: parseFloat(sanitizedData.childInfo.weightAtBirth),
              motherMaidenName: {
                firstName: sanitizedData.motherInfo.firstName,
                middleName: sanitizedData.motherInfo.middleName,
                lastName: sanitizedData.motherInfo.lastName,
              },
              motherCitizenship: sanitizedData.motherInfo.citizenship,
              motherReligion: sanitizedData.motherInfo.religion,
              motherOccupation: sanitizedData.motherInfo.occupation,
              motherAge: parseInt(sanitizedData.motherInfo.age),
              motherResidence: formatAddress(
                sanitizedData.motherInfo.residence
              ),
              totalChildrenBornAlive: parseInt(
                sanitizedData.motherInfo.totalChildrenBornAlive
              ),
              childrenStillLiving: parseInt(
                sanitizedData.motherInfo.childrenStillLiving
              ),
              childrenNowDead: parseInt(
                sanitizedData.motherInfo.childrenNowDead
              ),
              fatherName: {
                firstName: sanitizedData.fatherInfo.firstName,
                middleName: sanitizedData.fatherInfo.middleName,
                lastName: sanitizedData.fatherInfo.lastName,
              },
              fatherCitizenship: sanitizedData.fatherInfo.citizenship,
              fatherReligion: sanitizedData.fatherInfo.religion,
              fatherOccupation: sanitizedData.fatherInfo.occupation,
              fatherAge: parseInt(sanitizedData.fatherInfo.age),
              fatherResidence: formatAddress(
                sanitizedData.fatherInfo.residence
              ),
              parentMarriage: {
                date: sanitizedData.parentMarriage.date || new Date(),
                place: sanitizedData.parentMarriage.place,
              },
              attendant: {
                type: sanitizedData.attendant.type,
                certification: {
                  time:
                    sanitizedData.attendant.certification.time || new Date(),
                  signature:
                    sanitizedData.attendant.certification.signature || '',
                  name: sanitizedData.attendant.certification.name.trim(),
                  title: sanitizedData.attendant.certification.title.trim(),
                  address: formatAddress(
                    sanitizedData.attendant.certification.address
                  ),
                  date:
                    sanitizedData.attendant.certification.date || new Date(),
                },
              },
              informant: {
                signature: sanitizedData.informant.signature || '',
                name: sanitizedData.informant.name,
                relationship: sanitizedData.informant.relationship,
                address: formatAddress(sanitizedData.informant.address),
                date: sanitizedData.informant.date || new Date(),
              },
              preparer: {
                signature: sanitizedData.preparedBy.signature || '',
                name: sanitizedData.preparedBy.name.trim(),
                title: sanitizedData.preparedBy.title.trim(),
                date: sanitizedData.preparedBy.date || new Date(),
              },
              hasAffidavitOfPaternity: sanitizedData.hasAffidavitOfPaternity,
              ...affidavitOfPaternityPayload,
              isDelayedRegistration: sanitizedData.isDelayedRegistration,
              ...delayedRegistrationPayload,
            },
          },
          receivedBy: sanitizedData.receivedBy.name,
          receivedByPosition: sanitizedData.receivedBy.title,
          receivedDate: sanitizedData.receivedBy.date || new Date(),
          registeredBy: sanitizedData.registeredByOffice.name,
          registeredByPosition: sanitizedData.registeredByOffice.title,
          registrationDate: sanitizedData.registeredByOffice.date || new Date(),
          remarks: sanitizedData.remarks?.trim() || null,
        },
      });

      return {
        success: true,
        data: baseForm,
        message: 'Birth certificate created successfully',
      };
    });

    // Revalidate after successful transaction
    await revalidatePath('/civil-registry');
    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        success: false,
        warning: result.warning,
        message: result.message,
      };
    }
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
