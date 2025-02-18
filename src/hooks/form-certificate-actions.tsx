// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { DocumentStatus, FormType, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// ----------------------------END OF HELPER FUNCTION----------------------------------------//
// export async function createMarriageCertificate(
//   data: MarriageCertificateFormValues
// ) {
//   try {
//     // 1. Validate registry number
//     const exists = await checkRegistryNumberExists(
//       data.registryNumber,
//       FormType.MARRIAGE
//     );
//     if (exists) {
//       return {
//         success: false,
//         error: 'Registry number already exists. Please use a different number.',
//       };
//     }

//     // 2. Validate dates
//     const marriageDate = new Date(data.dateOfMarriage);
//     const husbandBirthDate = new Date(data.husbandDateOfBirth);
//     const wifeBirthDate = new Date(data.wifeDateOfBirth);

//     if (
//       !isValidDate(marriageDate, FormType.MARRIAGE) ||
//       !isValidDate(husbandBirthDate, FormType.MARRIAGE) ||
//       !isValidDate(wifeBirthDate, FormType.MARRIAGE)
//     ) {
//       return {
//         success: false,
//         error:
//           'Invalid date format in marriage, husband birth, or wife birth date',
//       };
//     }

//     // 3. Validate marriage date is after both birth dates
//     if (marriageDate < husbandBirthDate || marriageDate < wifeBirthDate) {
//       return {
//         success: false,
//         error: 'Marriage date cannot be before birth dates',
//       };
//     }
//     const baseForm = await prisma.baseRegistryForm.create({
//       data: {
//         formNumber: '97',
//         formType: 'MARRIAGE',
//         registryNumber: data.registryNumber,
//         province: data.province,
//         cityMunicipality: data.cityMunicipality,
//         pageNumber: '1',
//         bookNumber: '1',
//         dateOfRegistration: new Date(),
//         status: 'PENDING',

//         marriageCertificateForm: {
//           create: {
//             // Husband's Information
//             husbandFirstName: data.husbandFirstName,
//             husbandMiddleName: data.husbandMiddleName,
//             husbandLastName: data.husbandLastName,
//             husbandAge: data.husbandAge,
//             husbandDateOfBirth: data.husbandDateOfBirth,
//             husbandPlaceOfBirth: data.husbandPlaceOfBirth,
//             husbandSex: data.husbandSex,
//             husbandCitizenship: data.husbandCitizenship,
//             husbandResidence: data.husbandResidence,
//             husbandReligion: data.husbandReligion,
//             husbandCivilStatus: data.husbandCivilStatus,

//             // Husband's Parents
//             husbandFatherName: data.husbandFatherName,
//             husbandFatherCitizenship: data.husbandFatherCitizenship,
//             husbandMotherMaidenName: data.husbandMotherMaidenName,
//             husbandMotherCitizenship: data.husbandMotherCitizenship,

//             // Wife's Information
//             wifeFirstName: data.wifeFirstName,
//             wifeMiddleName: data.wifeMiddleName,
//             wifeLastName: data.wifeLastName,
//             wifeAge: data.wifeAge,
//             wifeDateOfBirth: data.wifeDateOfBirth,
//             wifePlaceOfBirth: data.wifePlaceOfBirth,
//             wifeSex: data.wifeSex,
//             wifeCitizenship: data.wifeCitizenship,
//             wifeResidence: data.wifeResidence,
//             wifeReligion: data.wifeReligion,
//             wifeCivilStatus: data.wifeCivilStatus,

//             // Wife's Parents
//             wifeFatherName: data.wifeFatherName,
//             wifeFatherCitizenship: data.wifeFatherCitizenship,
//             wifeMotherMaidenName: data.wifeMotherMaidenName,
//             wifeMotherCitizenship: data.wifeMotherCitizenship,

//             // Consent Information
//             husbandConsentPerson: {
//               name: data.husbandConsentGivenBy,
//               relationship: data.husbandConsentRelationship,
//               residence: data.husbandConsentResidence,
//             },
//             wifeConsentPerson: {
//               name: data.wifeConsentGivenBy,
//               relationship: data.wifeConsentRelationship,
//               residence: data.wifeConsentResidence,
//             },

//             // Marriage Details
//             placeOfMarriage: data.placeOfMarriage,
//             dateOfMarriage: data.dateOfMarriage,
//             timeOfMarriage: data.timeOfMarriage,

//             // Required fields with default values
//             marriageSettlement: false,
//             witnesses: [],
//             solemnizingOfficer: {
//               name: 'Default Officer',
//               position: 'Marriage Officer',
//               religion: 'Roman Catholic',
//               registryNoExpiryDate: '2025-12-31',
//             },

//             // Optional fields with default values
//             marriageLicenseDetails: {
//               number: 'LICENSE-2024-001',
//               dateIssued: new Date().toISOString(),
//               placeIssued: 'Malolos, Bulacan',
//             },
//             noMarriageLicense: false,
//             executiveOrderApplied: false,
//             presidentialDecreeApplied: false,
//             contractingPartiesSignature: {
//               husband: '',
//               wife: '',
//             },
//             solemnizingOfficerSignature: '',
//           },
//         },
//       },
//     });

//     revalidatePath('/civil-registry');
//     return { success: true, data: baseForm };
//   } catch (error) {
//     if (error instanceof Error) {
//       return {
//         success: false,
//         error: `Failed to create marriage certificate: ${error.message}`,
//       };
//     }
//     return { success: false, error: 'Failed to create marriage certificate' };
//   }
// }

// Death Certificate Server Action
// export async function createDeathCertificate(
//   data: DeathCertificateFormValues,
//   ignoreDuplicate: boolean = false
// ): Promise<DeathCertificateResponse> {
//   try {
//     // Assume the data has already been validated by Zod.
//     // Sanitize the incoming data following the birth certificate pattern.
//     const sanitizedData: DeathCertificateFormValues = {
//       ...data,
//       registryNumber: data.registryNumber.trim(),
//       province: data.province.trim(),
//       cityMunicipality: data.cityMunicipality.trim(),
//       deceasedInfo: {
//         ...data.deceasedInfo,
//         deceasedName: {
//           firstName: data.deceasedInfo.deceasedName.firstName.trim(),
//           middleName: data.deceasedInfo.deceasedName.middleName?.trim() || '',
//           lastName: data.deceasedInfo.deceasedName.lastName.trim(),
//         },
//         civilStatus: data.deceasedInfo.civilStatus.trim(),
//         religion: data.deceasedInfo.religion?.trim(),
//         citizenship: data.deceasedInfo.citizenship.trim(),
//         residence: {
//           houseNumber:
//             data.deceasedInfo.residence.houseNumber?.trim?.() ||
//             data.deceasedInfo.residence.houseNumber,
//           street:
//             data.deceasedInfo.residence.street?.trim?.() ||
//             data.deceasedInfo.residence.street,
//           barangay:
//             data.deceasedInfo.residence.barangay?.trim?.() ||
//             data.deceasedInfo.residence.barangay,
//           cityMunicipality: data.deceasedInfo.residence.cityMunicipality.trim(),
//           province: data.deceasedInfo.residence.province.trim(),
//           country:
//             data.deceasedInfo.residence.country?.trim?.() ||
//             data.deceasedInfo.residence.country,
//         },
//         placeOfDeath: {
//           houseNumber:
//             data.deceasedInfo.placeOfDeath.houseNumber?.trim?.() ||
//             data.deceasedInfo.placeOfDeath.houseNumber,
//           street:
//             data.deceasedInfo.placeOfDeath.street?.trim?.() ||
//             data.deceasedInfo.placeOfDeath.street,
//           barangay:
//             data.deceasedInfo.placeOfDeath.barangay?.trim?.() ||
//             data.deceasedInfo.placeOfDeath.barangay,
//           cityMunicipality:
//             data.deceasedInfo.placeOfDeath.cityMunicipality.trim(),
//           province: data.deceasedInfo.placeOfDeath.province.trim(),
//           country:
//             data.deceasedInfo.placeOfDeath.country?.trim?.() ||
//             data.deceasedInfo.placeOfDeath.country,
//         },
//         placeOfBirth: {
//           houseNumber:
//             data.deceasedInfo.placeOfBirth.houseNumber?.trim?.() ||
//             data.deceasedInfo.placeOfBirth.houseNumber,
//           street:
//             data.deceasedInfo.placeOfBirth.street?.trim?.() ||
//             data.deceasedInfo.placeOfBirth.street,
//           barangay:
//             data.deceasedInfo.placeOfBirth.barangay?.trim?.() ||
//             data.deceasedInfo.placeOfBirth.barangay,
//           cityMunicipality:
//             data.deceasedInfo.placeOfBirth.cityMunicipality.trim(),
//           province: data.deceasedInfo.placeOfBirth.province.trim(),
//           country:
//             data.deceasedInfo.placeOfBirth.country?.trim?.() ||
//             data.deceasedInfo.placeOfBirth.country,
//         },
//       },
//       familyInfo: {
//         nameOfFather: {
//           firstName: data.familyInfo.nameOfFather.firstName.trim(),
//           middleName: data.familyInfo.nameOfFather.middleName?.trim() || '',
//           lastName: data.familyInfo.nameOfFather.lastName.trim(),
//         },
//         nameOfMother: {
//           firstName: data.familyInfo.nameOfMother.firstName.trim(),
//           middleName: data.familyInfo.nameOfMother.middleName?.trim() || '',
//           lastName: data.familyInfo.nameOfMother.lastName.trim(),
//         },
//       },
//       informant: {
//         ...data.informant,
//         name: data.informant.name.trim(),
//         relationship: data.informant.relationship.trim(),
//         address: {
//           houseNumber:
//             data.informant.address.houseNumber?.trim?.() ||
//             data.informant.address.houseNumber,
//           street:
//             data.informant.address.street?.trim?.() ||
//             data.informant.address.street,
//           barangay:
//             data.informant.address.barangay?.trim?.() ||
//             data.informant.address.barangay,
//           cityMunicipality: data.informant.address.cityMunicipality.trim(),
//           province: data.informant.address.province.trim(),
//           country:
//             data.informant.address.country?.trim?.() ||
//             data.informant.address.country,
//         },
//       },
//       preparer: {
//         ...data.preparer,
//         name: data.preparer.name.trim(),
//         title: data.preparer.title.trim(),
//       },
//       receivedBy: {
//         ...data.receivedBy,
//         name: data.receivedBy.name.trim(),
//         title: data.receivedBy.title.trim(),
//       },
//       registeredAtCivilRegistrar: {
//         ...data.registeredAtCivilRegistrar,
//         name: data.registeredAtCivilRegistrar.name.trim(),
//         title: data.registeredAtCivilRegistrar.title.trim(),
//       },
//       remarks: data.remarks?.trim() || '',
//     };

//     // Validate registry number format.
//     if (!/\d{4}-\d+/.test(sanitizedData.registryNumber)) {
//       return {
//         success: false as const,
//         error: 'Registry number must be in format: YYYY-numbers',
//         message: '',
//       };
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       // Check for an existing BaseRegistryForm with the same registry number for DEATH.
//       const existingRegistry = await tx.baseRegistryForm.findFirst({
//         where: {
//           registryNumber: sanitizedData.registryNumber,
//           formType: FormType.DEATH,
//         },
//       });
//       if (existingRegistry) {
//         throw new Error(
//           'Registry number already exists. Please use a different number.'
//         );
//       }

//       // Optionally check for a duplicate death certificate based on key fields.
//       if (
//         !ignoreDuplicate &&
//         sanitizedData.deceasedInfo.dateOfDeath &&
//         sanitizedData.deceasedInfo.deceasedName.firstName &&
//         sanitizedData.deceasedInfo.deceasedName.lastName
//       ) {
//         const existingDeceased = await tx.deathCertificateForm.findFirst({
//           where: {
//             AND: [
//               {
//                 deceasedName: {
//                   path: ['firstName'],
//                   string_contains:
//                     sanitizedData.deceasedInfo.deceasedName.firstName,
//                 },
//               },
//               {
//                 deceasedName: {
//                   path: ['lastName'],
//                   string_contains:
//                     sanitizedData.deceasedInfo.deceasedName.lastName,
//                 },
//               },
//               { dateOfDeath: sanitizedData.deceasedInfo.dateOfDeath! },
//               {
//                 placeOfDeath: {
//                   path: ['cityMunicipality'],
//                   string_contains:
//                     sanitizedData.deceasedInfo.placeOfDeath.cityMunicipality,
//                 },
//               },
//             ],
//           },
//         });
//         if (existingDeceased) {
//           return {
//             success: false as const,
//             error: '',
//             warning: true,
//             message:
//               'A similar death record already exists. Do you want to proceed with saving this record?',
//           };
//         }
//       }

//       // Validate that the preparer exists.
//       const preparer = await tx.user.findFirst({
//         where: { name: sanitizedData.preparer.name },
//       });
//       if (!preparer) {
//         throw new Error('Preparer not found');
//       }

//       // Create the BaseRegistryForm with nested DeathCertificateForm.
//       const baseForm = await tx.baseRegistryForm.create({
//         data: {
//           formNumber: '103',
//           formType: FormType.DEATH,
//           registryNumber: sanitizedData.registryNumber,
//           province: sanitizedData.province,
//           cityMunicipality: sanitizedData.cityMunicipality,
//           pageNumber: '1',
//           bookNumber: '1',
//           dateOfRegistration: new Date(),
//           status: 'PENDING',
//           preparedBy: { connect: { id: preparer.id } },
//           deathCertificateForm: {
//             create: {
//               deceasedName: sanitizedData.deceasedInfo.deceasedName,
//               sex: sanitizedData.deceasedInfo.sex,
//               dateOfDeath: sanitizedData.deceasedInfo.dateOfDeath!, // non-null
//               dateOfBirth: sanitizedData.deceasedInfo.dateOfBirth ?? undefined,
//               placeOfDeath: sanitizedData.deceasedInfo.placeOfDeath,
//               placeOfBirth: sanitizedData.deceasedInfo.placeOfBirth,
//               civilStatus: sanitizedData.deceasedInfo.civilStatus,
//               religion: sanitizedData.deceasedInfo.religion,
//               citizenship: sanitizedData.deceasedInfo.citizenship,
//               residence: sanitizedData.deceasedInfo.residence,
//               occupation: sanitizedData.deceasedInfo.occupation,
//               pregnancy: sanitizedData.deceasedInfo.pregnancy,
//               nameOfFather: sanitizedData.familyInfo.nameOfFather,
//               nameOfMother: sanitizedData.familyInfo.nameOfMother,
//               causesOfDeath: sanitizedData.medicalInfo.causesOfDeath,
//               deathInterval: sanitizedData.medicalInfo.deathInterval,
//               maternalCondition:
//                 sanitizedData.medicalInfo.maternalCondition ?? undefined,
//               autopsyPerformed: sanitizedData.medicalInfo.autopsyPerformed,
//               attendedByPhysician: sanitizedData.attendance.attendedByPhysician,
//               attendanceDuration:
//                 sanitizedData.attendance.attendanceDuration ?? undefined,
//               mannerOfDeath: sanitizedData.externalCauses.mannerOfDeath,
//               externalCause: sanitizedData.externalCauses.externalCause,
//               placeOfOccurrence: sanitizedData.externalCauses.placeOfOccurrence,
//               certificationType: sanitizedData.certification.certificationType,
//               certifier: sanitizedData.certification.certifier,
//               disposalDetails:
//                 sanitizedData.disposal.disposalDetails ?? undefined,
//               burialPermit: sanitizedData.disposal.burialPermit
//                 ? {
//                     ...sanitizedData.disposal.burialPermit,
//                     dateIssued: sanitizedData.disposal.burialPermit.dateIssued!,
//                   }
//                 : undefined,
//               transferPermit:
//                 sanitizedData.disposal.transferPermit ?? undefined,
//               cemeteryDetails:
//                 sanitizedData.disposal.cemeteryDetails ?? undefined,
//               postmortemDetails:
//                 sanitizedData.additionalDetails.postmortemDetails ?? undefined,
//               embalmerDetails:
//                 sanitizedData.additionalDetails.embalmerDetails ?? undefined,
//               infantDeathDetails:
//                 sanitizedData.additionalDetails.infantDeathDetails ?? undefined,
//               delayedRegistration:
//                 sanitizedData.delayedRegistration ?? undefined,
//               // Uncomment these lines if your Prisma model includes them:
//               // ageAtDeath: sanitizedData.ageAtDeath ?? undefined,
//               // reviewedBy: sanitizedData.reviewedBy ?? undefined,
//               informant: sanitizedData.informant,
//               preparer: sanitizedData.preparer,
//             },
//           },
//           receivedBy: sanitizedData.receivedBy.name.trim(),
//           receivedByPosition: sanitizedData.receivedBy.title.trim(),
//           receivedDate: sanitizedData.receivedBy.date,
//           registeredBy: sanitizedData.registeredAtCivilRegistrar.name.trim(),
//           registeredByPosition:
//             sanitizedData.registeredAtCivilRegistrar.title.trim(),
//           registrationDate: sanitizedData.registeredAtCivilRegistrar.date,
//           remarks: sanitizedData.remarks || null,
//         },
//       });

//       return {
//         success: true as const,
//         data: baseForm,
//         message: 'Death certificate created successfully',
//       };
//     });

//     revalidatePath('/civil-registry');
//     return result;
//   } catch (error) {
//     console.error('Error creating death certificate:', error);
//     return {
//       success: false as const,
//       error:
//         error instanceof Error
//           ? error.message
//           : 'Failed to create death certificate',
//       message: '',
//     };
//   }
// }
// ------------------------------- Birth Certificate Server Action -------------------------------//

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

const PAGES_PER_BOOK = 100;

export async function submitBirthCertificateForm(
  formData: BirthCertificateFormValues
) {
  try {
    if (!formData) {
      throw new Error('No form data provided');
    }

    return await prisma.$transaction(
      async (tx) => {
        // Find the user by name
        const preparedByUser = await tx.user.findFirst({
          where: {
            name: formData.preparedBy.nameInPrint,
          },
        });

        if (!preparedByUser) {
          throw new Error(
            `No user found with name: ${formData.preparedBy.nameInPrint}`
          );
        }

        // Get the latest book and page numbers with collision checking
        async function getNextBookAndPage(): Promise<{
          bookNumber: string;
          pageNumber: string;
        }> {
          const latestForm = await tx.baseRegistryForm.findFirst({
            where: {
              formType: FormType.BIRTH,
              province: formData.province,
              cityMunicipality: formData.cityMunicipality,
            },
            orderBy: [{ bookNumber: 'desc' }, { pageNumber: 'desc' }],
          });

          if (!latestForm) {
            return { bookNumber: '1', pageNumber: '1' };
          }

          let currentPage = parseInt(latestForm.pageNumber);
          let currentBook = parseInt(latestForm.bookNumber);

          if (currentPage >= PAGES_PER_BOOK) {
            currentBook++;
            currentPage = 1;
          } else {
            currentPage++;
          }

          // Check for collision
          const existingEntry = await tx.baseRegistryForm.findFirst({
            where: {
              formType: FormType.BIRTH,
              province: formData.province,
              cityMunicipality: formData.cityMunicipality,
              bookNumber: currentBook.toString(),
              pageNumber: currentPage.toString(),
            },
          });

          if (existingEntry) {
            currentPage++;
            if (currentPage > PAGES_PER_BOOK) {
              currentBook++;
              currentPage = 1;
            }
            return getNextBookAndPage();
          }

          return {
            bookNumber: currentBook.toString(),
            pageNumber: currentPage.toString(),
          };
        }

        const { bookNumber, pageNumber } = await getNextBookAndPage();

        // Create the BaseRegistryForm record
        const baseForm = await tx.baseRegistryForm.create({
          data: {
            formNumber: '102',
            formType: FormType.BIRTH,
            registryNumber: formData.registryNumber,
            province: formData.province,
            cityMunicipality: formData.cityMunicipality,
            pageNumber,
            bookNumber,
            dateOfRegistration: new Date(),
            isLateRegistered: formData.isDelayedRegistration,
            status: DocumentStatus.PENDING,
            preparedById: preparedByUser.id,
            verifiedById: null,
            preparedByName: formData.preparedBy.nameInPrint,
            verifiedByName: null,
            receivedBy: formData.receivedBy.nameInPrint,
            receivedByPosition: formData.receivedBy.titleOrPosition,
            receivedDate: formData.receivedBy.date,
            registeredBy: formData.registeredByOffice.nameInPrint,
            registeredByPosition: formData.registeredByOffice.titleOrPosition,
            registrationDate: formData.registeredByOffice.date,
            remarks: formData.remarks,
          },
        });

        // Helper function to convert Date to ISO string for JSON
        const dateToJSON = (date: Date) => date.toISOString();

        // Create the BirthCertificateForm record
        await tx.birthCertificateForm.create({
          data: {
            baseFormId: baseForm.id,
            childName: {
              first: formData.childInfo.firstName,
              middle: formData.childInfo.middleName || '',
              last: formData.childInfo.lastName,
            } as Prisma.JsonObject,
            sex: formData.childInfo.sex,
            dateOfBirth: formData.childInfo.dateOfBirth,
            placeOfBirth: formData.childInfo.placeOfBirth as Prisma.JsonObject,
            typeOfBirth: formData.childInfo.typeOfBirth,
            multipleBirthOrder: formData.childInfo.multipleBirthOrder || '',
            birthOrder: formData.childInfo.birthOrder,
            weightAtBirth: parseFloat(formData.childInfo.weightAtBirth),
            motherMaidenName: {
              first: formData.motherInfo.firstName,
              middle: formData.motherInfo.middleName || '',
              last: formData.motherInfo.lastName,
            } as Prisma.JsonObject,
            motherCitizenship: formData.motherInfo.citizenship,
            motherReligion: formData.motherInfo.religion || '',
            motherOccupation: formData.motherInfo.occupation,
            motherAge: parseInt(formData.motherInfo.age),
            motherResidence: formData.motherInfo.residence as Prisma.JsonObject,
            totalChildrenBornAlive: parseInt(
              formData.motherInfo.totalChildrenBornAlive
            ),
            childrenStillLiving: parseInt(
              formData.motherInfo.childrenStillLiving
            ),
            childrenNowDead: parseInt(formData.motherInfo.childrenNowDead),
            fatherName: !formData.fatherInfo
              ? Prisma.JsonNull
              : ({
                  first: formData.fatherInfo.firstName,
                  middle: formData.fatherInfo.middleName || '',
                  last: formData.fatherInfo.lastName,
                } as Prisma.JsonObject),
            fatherCitizenship: formData.fatherInfo?.citizenship || '',
            fatherReligion: formData.fatherInfo?.religion || '',
            fatherOccupation: formData.fatherInfo?.occupation || '',
            fatherAge: formData.fatherInfo
              ? parseInt(formData.fatherInfo.age)
              : 0,
            fatherResidence: !formData.fatherInfo
              ? Prisma.JsonNull
              : (formData.fatherInfo.residence as Prisma.JsonObject),
            parentMarriage: !formData.parentMarriage
              ? Prisma.JsonNull
              : ({
                  date: dateToJSON(formData.parentMarriage.date),
                  place: formData.parentMarriage.place,
                } as Prisma.JsonObject),
            attendant: {
              type: formData.attendant.type,
              certification: {
                ...formData.attendant.certification,
                time: dateToJSON(formData.attendant.certification.time),
                date: dateToJSON(formData.attendant.certification.date),
              },
            } as Prisma.JsonObject,
            informant: {
              ...formData.informant,
              date: dateToJSON(formData.informant.date),
            } as Prisma.JsonObject,
            preparer: {
              ...formData.preparedBy,
              date: dateToJSON(formData.preparedBy.date),
            } as Prisma.JsonObject,
            hasAffidavitOfPaternity: formData.hasAffidavitOfPaternity,
            affidavitOfPaternityDetails:
              !formData.hasAffidavitOfPaternity ||
              !formData.affidavitOfPaternityDetails
                ? Prisma.JsonNull
                : (formData.affidavitOfPaternityDetails as Prisma.JsonObject),
            isDelayedRegistration: formData.isDelayedRegistration,
            affidavitOfDelayedRegistration:
              !formData.isDelayedRegistration ||
              !formData.affidavitOfDelayedRegistration
                ? Prisma.JsonNull
                : (formData.affidavitOfDelayedRegistration as Prisma.JsonObject),
            reasonForDelay:
              (formData.isDelayedRegistration &&
                formData.affidavitOfDelayedRegistration?.reasonForDelay) ||
              '',
          },
        });

        // Revalidate the path
        revalidatePath('/civil-registry');

        return {
          success: true,
          message: 'Birth certificate submitted successfully',
          data: {
            baseFormId: baseForm.id,
            bookNumber,
            pageNumber,
          },
        };
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to submit birth certificate form',
    };
  }
}

export async function submitDeathCertificateForm(
  formData: DeathCertificateFormValues
) {
  try {
    if (!formData) {
      throw new Error('No form data provided');
    }

    return await prisma.$transaction(
      async (tx) => {
        // 1. Find the preparedBy user by name.
        const preparedByUser = await tx.user.findFirst({
          where: {
            name: formData.preparedBy.nameInPrint,
          },
        });

        if (!preparedByUser) {
          throw new Error(
            `No user found with name: ${formData.preparedBy.nameInPrint}`
          );
        }

        // 2. Generate the next book and page numbers with collision checking.
        async function getNextBookAndPage(): Promise<{
          bookNumber: string;
          pageNumber: string;
        }> {
          const latestForm = await tx.baseRegistryForm.findFirst({
            where: {
              formType: FormType.DEATH,
              province: formData.province,
              cityMunicipality: formData.cityMunicipality,
            },
            orderBy: [{ bookNumber: 'desc' }, { pageNumber: 'desc' }],
          });

          if (!latestForm) {
            return { bookNumber: '1', pageNumber: '1' };
          }

          let currentPage = parseInt(latestForm.pageNumber, 10);
          let currentBook = parseInt(latestForm.bookNumber, 10);

          if (currentPage >= PAGES_PER_BOOK) {
            currentBook++;
            currentPage = 1;
          } else {
            currentPage++;
          }

          // Collision check:
          const existingEntry = await tx.baseRegistryForm.findFirst({
            where: {
              formType: FormType.DEATH,
              province: formData.province,
              cityMunicipality: formData.cityMunicipality,
              bookNumber: currentBook.toString(),
              pageNumber: currentPage.toString(),
            },
          });

          if (existingEntry) {
            return getNextBookAndPage();
          }

          return {
            bookNumber: currentBook.toString(),
            pageNumber: currentPage.toString(),
          };
        }

        const { bookNumber, pageNumber } = await getNextBookAndPage();

        // 3. Create the BaseRegistryForm record.
        const baseForm = await tx.baseRegistryForm.create({
          data: {
            formNumber: '103', // For death certificates.
            formType: FormType.DEATH,
            registryNumber: formData.registryNumber,
            province: formData.province,
            cityMunicipality: formData.cityMunicipality,
            pageNumber,
            bookNumber,
            dateOfRegistration: new Date(),
            isLateRegistered: false, // Or use a form value if available.
            status: DocumentStatus.PENDING,
            preparedById: preparedByUser.id,
            verifiedById: null,
            preparedByName: formData.preparedBy.nameInPrint,
            verifiedByName: null,
            receivedBy: formData.receivedBy.nameInPrint,
            receivedByPosition: formData.receivedBy.titleOrPosition,
            receivedDate: formData.receivedBy.date,
            registeredBy: formData.registeredByOffice.nameInPrint,
            registeredByPosition: formData.registeredByOffice.titleOrPosition,
            registrationDate: formData.registeredByOffice.date,
            remarks: formData.remarks,
          },
        });

        // 4. Narrow the union type for causesOfDeath.
        const causes = formData.medicalCertificate.causesOfDeath;
        const standardCauses = 'immediate' in causes ? causes : undefined;
        const deathIntervalValue = standardCauses
          ? standardCauses.immediate
          : undefined;
        const infantDeathDetailsValue =
          'mainDiseaseOfInfant' in causes ? causes : undefined;

        // 5. Create the DeathCertificateForm record.
        await tx.deathCertificateForm.create({
          data: {
            baseFormId: baseForm.id,
            // Deceased Information
            deceasedName: formData.name,
            sex: formData.sex,
            dateOfDeath: formData.dateOfDeath,
            placeOfDeath: formData.placeOfDeath,
            dateOfBirth: formData.dateOfBirth || null,
            placeOfBirth: {}, // Adjust if needed.
            civilStatus: formData.civilStatus,
            religion: formData.religion || null,
            citizenship: formData.citizenship,
            residence: formData.residence,
            occupation: formData.occupation || null,

            // Parent Information
            nameOfFather: formData.parents.fatherName,
            nameOfMother: formData.parents.motherName,

            // Causes of Death (from section 19b)
            causesOfDeath: {
              immediate: formData.causesOfDeath19b.immediate,
              antecedent: formData.causesOfDeath19b.antecedent,
              underlying: formData.causesOfDeath19b.underlying,
              otherSignificantConditions:
                formData.causesOfDeath19b.otherSignificantConditions,
            },
            // Use the narrowed value for deathInterval.
            deathInterval:
              deathIntervalValue !== undefined
                ? deathIntervalValue
                : Prisma.JsonNull,
            pregnancy: null, // Adjust if your form includes this.
            attendedByPhysician:
              formData.medicalCertificate.attendant.type &&
              formData.medicalCertificate.attendant.type !== 'NONE',
            attendanceDuration: formData.medicalCertificate.attendant.duration,
            mannerOfDeath:
              formData.medicalCertificate.externalCauses.mannerOfDeath || null,
            autopsyPerformed: formData.medicalCertificate.autopsy,
            externalCause:
              formData.medicalCertificate.externalCauses.placeOfOccurrence ||
              null,
            placeOfOccurrence:
              formData.medicalCertificate.externalCauses.placeOfOccurrence ||
              null,
            certificationType: 'Standard', // Adjust if needed.
            certifier: formData.certificationOfDeath,

            // Disposal Information
            disposalDetails: {
              corpseDisposal: formData.corpseDisposal,
              cemeteryOrCrematory: formData.cemeteryOrCrematory,
            },

            // Other Sections (stored as JSON)
            informant: formData.informant,
            preparer: formData.preparedBy,
            burialPermit: formData.burialPermit,
            transferPermit: formData.transferPermit,
            cemeteryDetails: formData.cemeteryOrCrematory,
            postmortemDetails: formData.postmortemCertificate,
            embalmerDetails: formData.embalmerCertification,
            infantDeathDetails:
              infantDeathDetailsValue !== undefined
                ? infantDeathDetailsValue
                : Prisma.JsonNull,
            maternalCondition: formData.medicalCertificate.maternalCondition,
            delayedRegistration: formData.delayedRegistration,
            ageAtDeath: formData.ageAtDeath, // Now stored in your model.
            reviewedBy: formData.reviewedBy,
          },
        });

        // 6. Revalidate the path (if using ISR).
        revalidatePath('/civil-registry');

        return {
          success: true,
          message: 'Death certificate submitted successfully',
          data: {
            baseFormId: baseForm.id,
            bookNumber,
            pageNumber,
          },
        };
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to submit death certificate form',
    };
  }
}
