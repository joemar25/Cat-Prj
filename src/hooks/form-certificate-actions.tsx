// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  BirthCertificateFormValues,
  DeathCertificateFormValues,
  MarriageCertificateFormValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { revalidatePath } from 'next/cache';

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
    console.error('Error creating death certificate:', error);
    return { success: false, error: 'Failed to create death certificate' };
  }
}

// ------------------------------- Birth Certificate Server Action -------------------------------//
export async function createBirthCertificate(data: BirthCertificateFormValues) {
  try {
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '102', // Form 102 for Birth Certificate
        formType: 'BIRTH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',

        birthCertificateForm: {
          create: {
            // Child Information
            childName: {
              firstName: data.childInfo.firstName,
              middleName: data.childInfo.middleName,
              lastName: data.childInfo.lastName,
            },
            sex: data.childInfo.sex,
            dateOfBirth: new Date(
              `${data.childInfo.dateOfBirth.year}-${data.childInfo.dateOfBirth.month}-${data.childInfo.dateOfBirth.day}`
            ),
            placeOfBirth: {
              hospital: data.childInfo.placeOfBirth.hospital,
              province: data.childInfo.placeOfBirth.province,
              cityMunicipality: data.childInfo.placeOfBirth.cityMunicipality,
            },
            typeOfBirth: data.childInfo.typeOfBirth,
            multipleBirthOrder: data.childInfo.multipleBirthOrder,
            birthOrder: data.childInfo.birthOrder,
            weightAtBirth: parseFloat(data.childInfo.weightAtBirth),

            // Mother Information
            motherMaidenName: {
              firstName: data.motherInfo.firstName,
              middleName: data.motherInfo.middleName,
              lastName: data.motherInfo.lastName,
            },
            motherCitizenship: data.motherInfo.motherCitizenship, // Updated field name
            motherReligion: data.motherInfo.motherReligion, // Updated field name
            motherOccupation: data.motherInfo.motherOccupation, // Updated field name
            motherAge: parseInt(data.motherInfo.motherAge), // Updated field name
            motherResidence: {
              address: data.motherInfo.residence.address,
              province: data.motherInfo.residence.province,
              cityMunicipality: data.motherInfo.residence.cityMunicipality,
              country: data.motherInfo.residence.country,
            },
            totalChildrenBornAlive: parseInt(
              data.motherInfo.totalChildrenBornAlive
            ), // Updated field name
            childrenStillLiving: parseInt(data.motherInfo.childrenStillLiving), // Updated field name
            childrenNowDead: parseInt(data.motherInfo.childrenNowDead), // Updated field name

            // Father Information
            fatherName: {
              firstName: data.fatherInfo.firstName,
              middleName: data.fatherInfo.middleName,
              lastName: data.fatherInfo.lastName,
            },
            fatherCitizenship: data.fatherInfo.fatherCitizenship, // Should match the pattern
            fatherReligion: data.fatherInfo.fatherReligion, // Should match the pattern
            fatherOccupation: data.fatherInfo.fatherOccupation, // Should match the pattern
            fatherAge: parseInt(data.fatherInfo.fatherAge), // Should match the pattern
            fatherResidence: {
              address: data.fatherInfo.residence.address,
              province: data.fatherInfo.residence.province,
              cityMunicipality: data.fatherInfo.residence.cityMunicipality,
              country: data.fatherInfo.residence.country,
            },

            // Marriage Information
            parentMarriage: {
              date: new Date(
                `${data.parentMarriage.date.year}-${data.parentMarriage.date.month}-${data.parentMarriage.date.day}`
              ),
              place: {
                cityMunicipality: data.parentMarriage.place.cityMunicipality,
                province: data.parentMarriage.place.province,
                country: data.parentMarriage.place.country,
              },
            },

            // Certification Details
            attendant: {
              type: data.attendant.type,
              certification: {
                time: data.attendant.certification.time,
                signature: data.attendant.certification.signature,
                name: data.attendant.certification.name,
                title: data.attendant.certification.title,
                address: data.attendant.certification.address,
                date: data.attendant.certification.date,
              },
            },
            informant: {
              signature: data.informant.signature,
              name: data.informant.name,
              relationship: data.informant.relationship,
              address: data.informant.address,
              date: data.informant.date,
            },
            preparer: {
              signature: data.preparedBy.signature,
              name: data.preparedBy.name,
              title: data.preparedBy.title,
              date: data.preparedBy.date,
            },

            hasAffidavitOfPaternity: false,
          },
        },

        // Registry Form Fields
        receivedBy: data.receivedBy.name,
        receivedByPosition: data.receivedBy.title,
        receivedDate: new Date(data.receivedBy.date),

        registeredBy: data.registeredByOffice.name,
        registeredByPosition: data.registeredByOffice.title,
        registrationDate: new Date(data.registeredByOffice.date),

        dateOfRegistration: new Date(),
        remarks: data.remarks,
      },
    });

    revalidatePath('/civil-registry');
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating birth certificate:', error);
    return { success: false, error: 'Failed to create birth certificate' };
  }
}
