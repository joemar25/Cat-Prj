// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  BirthCertificateResponse,
  DeathCertificateResponse,
} from '@/lib/types/form-certificates-types/types';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
import { formatAddress } from '@/lib/utils/location-helpers';
import { isValidDate } from '@/utils/certificate-helper-functions';
import { FormType, Sex } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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
): Promise<DeathCertificateResponse> {
  try {
    // Assume the data has already been validated by Zod.
    // Sanitize the incoming data following the birth certificate pattern.
    const sanitizedData: DeathCertificateFormValues = {
      ...data,
      registryNumber: data.registryNumber.trim(),
      province: data.province.trim(),
      cityMunicipality: data.cityMunicipality.trim(),
      deceasedInfo: {
        ...data.deceasedInfo,
        deceasedName: {
          firstName: data.deceasedInfo.deceasedName.firstName.trim(),
          middleName: data.deceasedInfo.deceasedName.middleName?.trim() || '',
          lastName: data.deceasedInfo.deceasedName.lastName.trim(),
        },
        civilStatus: data.deceasedInfo.civilStatus.trim(),
        religion: data.deceasedInfo.religion?.trim(),
        citizenship: data.deceasedInfo.citizenship.trim(),
        residence: {
          houseNumber:
            data.deceasedInfo.residence.houseNumber?.trim?.() ||
            data.deceasedInfo.residence.houseNumber,
          street:
            data.deceasedInfo.residence.street?.trim?.() ||
            data.deceasedInfo.residence.street,
          barangay:
            data.deceasedInfo.residence.barangay?.trim?.() ||
            data.deceasedInfo.residence.barangay,
          cityMunicipality: data.deceasedInfo.residence.cityMunicipality.trim(),
          province: data.deceasedInfo.residence.province.trim(),
          country:
            data.deceasedInfo.residence.country?.trim?.() ||
            data.deceasedInfo.residence.country,
        },
        placeOfDeath: {
          houseNumber:
            data.deceasedInfo.placeOfDeath.houseNumber?.trim?.() ||
            data.deceasedInfo.placeOfDeath.houseNumber,
          street:
            data.deceasedInfo.placeOfDeath.street?.trim?.() ||
            data.deceasedInfo.placeOfDeath.street,
          barangay:
            data.deceasedInfo.placeOfDeath.barangay?.trim?.() ||
            data.deceasedInfo.placeOfDeath.barangay,
          cityMunicipality:
            data.deceasedInfo.placeOfDeath.cityMunicipality.trim(),
          province: data.deceasedInfo.placeOfDeath.province.trim(),
          country:
            data.deceasedInfo.placeOfDeath.country?.trim?.() ||
            data.deceasedInfo.placeOfDeath.country,
        },
        placeOfBirth: {
          houseNumber:
            data.deceasedInfo.placeOfBirth.houseNumber?.trim?.() ||
            data.deceasedInfo.placeOfBirth.houseNumber,
          street:
            data.deceasedInfo.placeOfBirth.street?.trim?.() ||
            data.deceasedInfo.placeOfBirth.street,
          barangay:
            data.deceasedInfo.placeOfBirth.barangay?.trim?.() ||
            data.deceasedInfo.placeOfBirth.barangay,
          cityMunicipality:
            data.deceasedInfo.placeOfBirth.cityMunicipality.trim(),
          province: data.deceasedInfo.placeOfBirth.province.trim(),
          country:
            data.deceasedInfo.placeOfBirth.country?.trim?.() ||
            data.deceasedInfo.placeOfBirth.country,
        },
      },
      familyInfo: {
        nameOfFather: {
          firstName: data.familyInfo.nameOfFather.firstName.trim(),
          middleName: data.familyInfo.nameOfFather.middleName?.trim() || '',
          lastName: data.familyInfo.nameOfFather.lastName.trim(),
        },
        nameOfMother: {
          firstName: data.familyInfo.nameOfMother.firstName.trim(),
          middleName: data.familyInfo.nameOfMother.middleName?.trim() || '',
          lastName: data.familyInfo.nameOfMother.lastName.trim(),
        },
      },
      informant: {
        ...data.informant,
        name: data.informant.name.trim(),
        relationship: data.informant.relationship.trim(),
        address: {
          houseNumber:
            data.informant.address.houseNumber?.trim?.() ||
            data.informant.address.houseNumber,
          street:
            data.informant.address.street?.trim?.() ||
            data.informant.address.street,
          barangay:
            data.informant.address.barangay?.trim?.() ||
            data.informant.address.barangay,
          cityMunicipality: data.informant.address.cityMunicipality.trim(),
          province: data.informant.address.province.trim(),
          country:
            data.informant.address.country?.trim?.() ||
            data.informant.address.country,
        },
      },
      preparer: {
        ...data.preparer,
        name: data.preparer.name.trim(),
        title: data.preparer.title.trim(),
      },
      receivedBy: {
        ...data.receivedBy,
        name: data.receivedBy.name.trim(),
        title: data.receivedBy.title.trim(),
      },
      registeredAtCivilRegistrar: {
        ...data.registeredAtCivilRegistrar,
        name: data.registeredAtCivilRegistrar.name.trim(),
        title: data.registeredAtCivilRegistrar.title.trim(),
      },
      remarks: data.remarks?.trim() || '',
    };

    // Validate registry number format.
    if (!/\d{4}-\d+/.test(sanitizedData.registryNumber)) {
      return {
        success: false as const,
        error: 'Registry number must be in format: YYYY-numbers',
        message: '',
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Check for an existing BaseRegistryForm with the same registry number for DEATH.
      const existingRegistry = await tx.baseRegistryForm.findFirst({
        where: {
          registryNumber: sanitizedData.registryNumber,
          formType: FormType.DEATH,
        },
      });
      if (existingRegistry) {
        throw new Error(
          'Registry number already exists. Please use a different number.'
        );
      }

      // Optionally check for a duplicate death certificate based on key fields.
      if (
        !ignoreDuplicate &&
        sanitizedData.deceasedInfo.dateOfDeath &&
        sanitizedData.deceasedInfo.deceasedName.firstName &&
        sanitizedData.deceasedInfo.deceasedName.lastName
      ) {
        const existingDeceased = await tx.deathCertificateForm.findFirst({
          where: {
            AND: [
              {
                deceasedName: {
                  path: ['firstName'],
                  string_contains:
                    sanitizedData.deceasedInfo.deceasedName.firstName,
                },
              },
              {
                deceasedName: {
                  path: ['lastName'],
                  string_contains:
                    sanitizedData.deceasedInfo.deceasedName.lastName,
                },
              },
              { dateOfDeath: sanitizedData.deceasedInfo.dateOfDeath! },
              {
                placeOfDeath: {
                  path: ['cityMunicipality'],
                  string_contains:
                    sanitizedData.deceasedInfo.placeOfDeath.cityMunicipality,
                },
              },
            ],
          },
        });
        if (existingDeceased) {
          return {
            success: false as const,
            error: '',
            warning: true,
            message:
              'A similar death record already exists. Do you want to proceed with saving this record?',
          };
        }
      }

      // Validate that the preparer exists.
      const preparer = await tx.user.findFirst({
        where: { name: sanitizedData.preparer.name },
      });
      if (!preparer) {
        throw new Error('Preparer not found');
      }

      // Create the BaseRegistryForm with nested DeathCertificateForm.
      const baseForm = await tx.baseRegistryForm.create({
        data: {
          formNumber: '103',
          formType: FormType.DEATH,
          registryNumber: sanitizedData.registryNumber,
          province: sanitizedData.province,
          cityMunicipality: sanitizedData.cityMunicipality,
          pageNumber: '1',
          bookNumber: '1',
          dateOfRegistration: new Date(),
          status: 'PENDING',
          preparedBy: { connect: { id: preparer.id } },
          deathCertificateForm: {
            create: {
              deceasedName: sanitizedData.deceasedInfo.deceasedName,
              sex: sanitizedData.deceasedInfo.sex,
              dateOfDeath: sanitizedData.deceasedInfo.dateOfDeath!, // non-null
              dateOfBirth: sanitizedData.deceasedInfo.dateOfBirth ?? undefined,
              placeOfDeath: sanitizedData.deceasedInfo.placeOfDeath,
              placeOfBirth: sanitizedData.deceasedInfo.placeOfBirth,
              civilStatus: sanitizedData.deceasedInfo.civilStatus,
              religion: sanitizedData.deceasedInfo.religion,
              citizenship: sanitizedData.deceasedInfo.citizenship,
              residence: sanitizedData.deceasedInfo.residence,
              occupation: sanitizedData.deceasedInfo.occupation,
              pregnancy: sanitizedData.deceasedInfo.pregnancy,
              nameOfFather: sanitizedData.familyInfo.nameOfFather,
              nameOfMother: sanitizedData.familyInfo.nameOfMother,
              causesOfDeath: sanitizedData.medicalInfo.causesOfDeath,
              deathInterval: sanitizedData.medicalInfo.deathInterval,
              maternalCondition:
                sanitizedData.medicalInfo.maternalCondition ?? undefined,
              autopsyPerformed: sanitizedData.medicalInfo.autopsyPerformed,
              attendedByPhysician: sanitizedData.attendance.attendedByPhysician,
              attendanceDuration:
                sanitizedData.attendance.attendanceDuration ?? undefined,
              mannerOfDeath: sanitizedData.externalCauses.mannerOfDeath,
              externalCause: sanitizedData.externalCauses.externalCause,
              placeOfOccurrence: sanitizedData.externalCauses.placeOfOccurrence,
              certificationType: sanitizedData.certification.certificationType,
              certifier: sanitizedData.certification.certifier,
              disposalDetails:
                sanitizedData.disposal.disposalDetails ?? undefined,
              burialPermit: sanitizedData.disposal.burialPermit
                ? {
                    ...sanitizedData.disposal.burialPermit,
                    dateIssued: sanitizedData.disposal.burialPermit.dateIssued!,
                  }
                : undefined,
              transferPermit:
                sanitizedData.disposal.transferPermit ?? undefined,
              cemeteryDetails:
                sanitizedData.disposal.cemeteryDetails ?? undefined,
              postmortemDetails:
                sanitizedData.additionalDetails.postmortemDetails ?? undefined,
              embalmerDetails:
                sanitizedData.additionalDetails.embalmerDetails ?? undefined,
              infantDeathDetails:
                sanitizedData.additionalDetails.infantDeathDetails ?? undefined,
              delayedRegistration:
                sanitizedData.delayedRegistration ?? undefined,
              // Uncomment these lines if your Prisma model includes them:
              // ageAtDeath: sanitizedData.ageAtDeath ?? undefined,
              // reviewedBy: sanitizedData.reviewedBy ?? undefined,
              informant: sanitizedData.informant,
              preparer: sanitizedData.preparer,
            },
          },
          receivedBy: sanitizedData.receivedBy.name.trim(),
          receivedByPosition: sanitizedData.receivedBy.title.trim(),
          receivedDate: sanitizedData.receivedBy.date,
          registeredBy: sanitizedData.registeredAtCivilRegistrar.name.trim(),
          registeredByPosition:
            sanitizedData.registeredAtCivilRegistrar.title.trim(),
          registrationDate: sanitizedData.registeredAtCivilRegistrar.date,
          remarks: sanitizedData.remarks || null,
        },
      });

      return {
        success: true as const,
        data: baseForm,
        message: 'Death certificate created successfully',
      };
    });

    revalidatePath('/civil-registry');
    return result;
  } catch (error) {
    console.error('Error creating death certificate:', error);
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create death certificate',
      message: '',
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
        error: 'Invalid registry number format',
        message: 'Registry number must be in format: YYYY-numbers',
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
            error: '',
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
        error: '', // when returning a failure with warning, ensure an error field exists
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
      message: '',
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

// // export async function createBirthCertificate(
//   data: BirthCertificateFormValues,
//   ignoreDuplicateChild: boolean = false
// ): Promise<BirthCertificateResponse> {
//   try {
//     // Data sanitization
//     const sanitizedData = {
//       ...data,
//       registryNumber: data.registryNumber.trim(),
//       province: data.province.trim(),
//       cityMunicipality: data.cityMunicipality.trim(),
//       childInfo: {
//         ...data.childInfo,
//         firstName: data.childInfo.firstName.trim(),
//         middleName: data.childInfo.middleName?.trim() || '',
//         lastName: data.childInfo.lastName.trim(),
//         placeOfBirth: {
//           hospital: data.childInfo.placeOfBirth.hospital.trim(),
//           cityMunicipality: data.childInfo.placeOfBirth.cityMunicipality.trim(),
//           province: data.childInfo.placeOfBirth.province.trim(),
//         },
//       },
//       motherInfo: {
//         ...data.motherInfo,
//         firstName: data.motherInfo.firstName.trim(),
//         middleName: data.motherInfo.middleName?.trim() || '',
//         lastName: data.motherInfo.lastName.trim(),
//         citizenship: data.motherInfo.citizenship.trim(),
//         religion: data.motherInfo.religion?.trim(),
//         occupation: data.motherInfo.occupation?.trim(),
//       },
//       fatherInfo: {
//         ...data.fatherInfo,
//         firstName: data.fatherInfo.firstName.trim(),
//         middleName: data.fatherInfo.middleName?.trim() || '',
//         lastName: data.fatherInfo.lastName.trim(),
//         citizenship: data.fatherInfo.citizenship.trim(),
//         religion: data.fatherInfo.religion?.trim(),
//         occupation: data.fatherInfo.occupation?.trim(),
//       },
//     };

//     // Validate registry number format (expects YYYY-#####)
//     if (!/\d{4}-\d+/.test(sanitizedData.registryNumber)) {
//       return {
//         success: false,
//         error: 'Registry number must be in format: YYYY-numbers',
//       };
//     }

//     // Use transaction for atomicity
//     const result = await prisma.$transaction(async (tx) => {
//       // Check for existing registry number
//       const existingRegistry = await tx.baseRegistryForm.findFirst({
//         where: {
//           registryNumber: sanitizedData.registryNumber,
//           formType: FormType.BIRTH,
//         },
//       });

//       if (existingRegistry) {
//         throw new Error(
//           'Registry number already exists. Please use a different number.'
//         );
//       }

//       // Check for duplicate child if not ignoring
//       if (!ignoreDuplicateChild && sanitizedData.childInfo.dateOfBirth) {
//         const existingChild = await tx.birthCertificateForm.findFirst({
//           where: {
//             AND: [
//               {
//                 childName: {
//                   path: ['firstName'],
//                   string_contains: sanitizedData.childInfo.firstName,
//                 },
//               },
//               {
//                 childName: {
//                   path: ['lastName'],
//                   string_contains: sanitizedData.childInfo.lastName,
//                 },
//               },
//               { dateOfBirth: sanitizedData.childInfo.dateOfBirth },
//               {
//                 placeOfBirth: {
//                   path: ['hospital'],
//                   string_contains:
//                     sanitizedData.childInfo.placeOfBirth.hospital,
//                 },
//               },
//               {
//                 placeOfBirth: {
//                   path: ['cityMunicipality'],
//                   string_contains:
//                     sanitizedData.childInfo.placeOfBirth.cityMunicipality,
//                 },
//               },
//               {
//                 placeOfBirth: {
//                   path: ['province'],
//                   string_contains:
//                     sanitizedData.childInfo.placeOfBirth.province,
//                 },
//               },
//             ],
//           },
//         });

//         if (existingChild) {
//           return {
//             success: false,
//             warning: true,
//             message:
//               'Child information already exists in the database. Do you want to proceed with saving this record?',
//           };
//         }
//       }

//       // Validate that the preparer exists
//       const user = await tx.user.findFirst({
//         where: {
//           name: sanitizedData.preparedBy.name,
//         },
//       });

//       if (!user) {
//         throw new Error('Preparer not found');
//       }

//       // Build optional payloads.
//       // Only include the nested object if it is not null.
//       const affidavitOfPaternityPayload =
//         sanitizedData.hasAffidavitOfPaternity &&
//         sanitizedData.affidavitOfPaternityDetails !== null
//           ? {
//               affidavitOfPaternityDetails:
//                 sanitizedData.affidavitOfPaternityDetails,
//             }
//           : {};

//       const delayedRegistrationPayload =
//         sanitizedData.isDelayedRegistration &&
//         sanitizedData.affidavitOfDelayedRegistration !== null
//           ? {
//               reasonForDelay:
//                 sanitizedData.affidavitOfDelayedRegistration.reasonForDelay,
//               affidavitOfDelayedRegistration:
//                 sanitizedData.affidavitOfDelayedRegistration,
//             }
//           : {};

//       // Create the base registry form with nested birth certificate
//       const baseForm = await tx.baseRegistryForm.create({
//         data: {
//           formNumber: '102',
//           formType: FormType.BIRTH,
//           registryNumber: sanitizedData.registryNumber,
//           province: sanitizedData.province,
//           cityMunicipality: sanitizedData.cityMunicipality,
//           pageNumber: '1',
//           bookNumber: '1',
//           dateOfRegistration: new Date(),
//           status: 'PENDING',
//           preparedBy: {
//             connect: { id: user.id },
//           },
//           birthCertificateForm: {
//             create: {
//               childName: {
//                 firstName: sanitizedData.childInfo.firstName,
//                 middleName: sanitizedData.childInfo.middleName,
//                 lastName: sanitizedData.childInfo.lastName,
//               },
//               sex: sanitizedData.childInfo.sex as Sex,
//               dateOfBirth: sanitizedData.childInfo.dateOfBirth || new Date(),
//               placeOfBirth: sanitizedData.childInfo.placeOfBirth,
//               typeOfBirth: sanitizedData.childInfo.typeOfBirth,
//               multipleBirthOrder: sanitizedData.childInfo.multipleBirthOrder,
//               birthOrder: sanitizedData.childInfo.birthOrder,
//               weightAtBirth: parseFloat(sanitizedData.childInfo.weightAtBirth),
//               motherMaidenName: {
//                 firstName: sanitizedData.motherInfo.firstName,
//                 middleName: sanitizedData.motherInfo.middleName,
//                 lastName: sanitizedData.motherInfo.lastName,
//               },
//               motherCitizenship: sanitizedData.motherInfo.citizenship,
//               motherReligion: sanitizedData.motherInfo.religion,
//               motherOccupation: sanitizedData.motherInfo.occupation,
//               motherAge: parseInt(sanitizedData.motherInfo.age),
//               motherResidence: formatAddress(
//                 sanitizedData.motherInfo.residence
//               ),
//               totalChildrenBornAlive: parseInt(
//                 sanitizedData.motherInfo.totalChildrenBornAlive
//               ),
//               childrenStillLiving: parseInt(
//                 sanitizedData.motherInfo.childrenStillLiving
//               ),
//               childrenNowDead: parseInt(
//                 sanitizedData.motherInfo.childrenNowDead
//               ),
//               fatherName: {
//                 firstName: sanitizedData.fatherInfo.firstName,
//                 middleName: sanitizedData.fatherInfo.middleName,
//                 lastName: sanitizedData.fatherInfo.lastName,
//               },
//               fatherCitizenship: sanitizedData.fatherInfo.citizenship,
//               fatherReligion: sanitizedData.fatherInfo.religion,
//               fatherOccupation: sanitizedData.fatherInfo.occupation,
//               fatherAge: parseInt(sanitizedData.fatherInfo.age),
//               fatherResidence: formatAddress(
//                 sanitizedData.fatherInfo.residence
//               ),
//               parentMarriage: {
//                 date: sanitizedData.parentMarriage.date || new Date(),
//                 place: sanitizedData.parentMarriage.place,
//               },
//               attendant: {
//                 type: sanitizedData.attendant.type,
//                 certification: {
//                   time:
//                     sanitizedData.attendant.certification.time || new Date(),
//                   signature:
//                     sanitizedData.attendant.certification.signature || '',
//                   name: sanitizedData.attendant.certification.name.trim(),
//                   title: sanitizedData.attendant.certification.title.trim(),
//                   address: formatAddress(
//                     sanitizedData.attendant.certification.address
//                   ),
//                   date:
//                     sanitizedData.attendant.certification.date || new Date(),
//                 },
//               },
//               informant: {
//                 signature: sanitizedData.informant.signature || '',
//                 name: sanitizedData.informant.name,
//                 relationship: sanitizedData.informant.relationship,
//                 address: formatAddress(sanitizedData.informant.address),
//                 date: sanitizedData.informant.date || new Date(),
//               },
//               preparer: {
//                 signature: sanitizedData.preparedBy.signature || '',
//                 name: sanitizedData.preparedBy.name.trim(),
//                 title: sanitizedData.preparedBy.title.trim(),
//                 date: sanitizedData.preparedBy.date || new Date(),
//               },
//               hasAffidavitOfPaternity: sanitizedData.hasAffidavitOfPaternity,
//               ...affidavitOfPaternityPayload,
//               isDelayedRegistration: sanitizedData.isDelayedRegistration,
//               ...delayedRegistrationPayload,
//             },
//           },
//           receivedBy: sanitizedData.receivedBy.name,
//           receivedByPosition: sanitizedData.receivedBy.title,
//           receivedDate: sanitizedData.receivedBy.date || new Date(),
//           registeredBy: sanitizedData.registeredByOffice.name,
//           registeredByPosition: sanitizedData.registeredByOffice.title,
//           registrationDate: sanitizedData.registeredByOffice.date || new Date(),
//           remarks: sanitizedData.remarks?.trim() || null,
//         },
//       });

//       return {
//         success: true,
//         data: baseForm,
//         message: 'Birth certificate created successfully',
//       };
//     });

//     // Revalidate after successful transaction
//     await revalidatePath('/civil-registry');
//     if (result.success) {
//       return {
//         success: true,
//         data: result.data,
//         message: result.message,
//       };
//     } else {
//       return {
//         success: false,
//         warning: result.warning,
//         message: result.message,
//       };
//     }
//   } catch (error) {
//     console.error('Error creating birth certificate:', error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : 'Failed to create birth certificate',
//     };
//   }
// }
