// useDeathCertificateForm.ts
import { submitDeathCertificateForm } from '@/hooks/form-certificate-actions';
import {
  DeathCertificateFormValues,
  deathCertificateFormSchema,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UseDeathCertificateFormProps {
  onOpenChange?: (open: boolean) => void;
}

export function useDeathCertificateForm({
  onOpenChange,
}: UseDeathCertificateFormProps = {}) {
  const formMethods = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      registryNumber: '',
      province: '',
      cityMunicipality: '',
      // Deceased Information
      name: {
        first: '',
        middle: '',
        last: '',
      },
      sex: undefined,
      dateOfDeath: undefined,
      timeOfDeath: undefined,
      dateOfBirth: undefined,
      ageAtDeath: {
        years: '',
        months: '',
        days: '',
        hours: '',
      },
      placeOfDeath: {
        houseNo: '',
        st: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
      civilStatus: '',
      religion: '',
      citizenship: '',
      residence: {
        houseNo: '',
        st: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
      occupation: '',
      // Birth Information
      birthInformation: {
        ageOfMother: '',
        methodOfDelivery: 'Normal spontaneous vertex',
        lengthOfPregnancy: undefined,
        typeOfBirth: 'Single',
        birthOrder: undefined,
      },
      // Parent Information
      parents: {
        fatherName: {
          first: '',
          middle: '',
          last: '',
        },
        motherName: {
          first: '',
          middle: '',
          last: '',
        },
      },
      // Causes of Death 19b (8 days and over)
      causesOfDeath19b: {
        immediate: {
          cause: '',
          interval: '',
        },
        antecedent: {
          cause: '',
          interval: '',
        },
        underlying: {
          cause: '',
          interval: '',
        },
        otherSignificantConditions: '',
      },
      // Medical Certificate
      medicalCertificate: {
        causesOfDeath: {
          mainDiseaseOfInfant: '',
          otherDiseasesOfInfant: '',
          mainMaternalDisease: '',
          otherMaternalDisease: '',
          otherRelevantCircumstances: '',
          immediate: { cause: '', interval: '' },
          antecedent: { cause: '', interval: '' },
          underlying: { cause: '', interval: '' },
          otherSignificantConditions: '',
        },
        maternalCondition: {
          pregnantNotInLabor: false,
          pregnantInLabor: false,
          lessThan42Days: false,
          daysTo1Year: false,
          noneOfTheAbove: false,
        },
        externalCauses: {
          mannerOfDeath: '',
          placeOfOccurrence: '',
        },
        attendant: {
          type: undefined,
          othersSpecify: '',
          duration: { from: undefined, to: undefined },
        },
        autopsy: false,
      },
      // Certification of Death
      certificationOfDeath: {
        hasAttended: false,
        signature: '',
        nameInPrint: '',
        titleOfPosition: '',
        address: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
        date: undefined,
        healthOfficerSignature: '',
        healthOfficerNameInPrint: '',
      },
      // Review
      reviewedBy: {
        signature: '',
        date: undefined,
      },
      // Certificates (optional)
      postmortemCertificate: undefined,
      embalmerCertification: undefined,
      // Delayed Registration (optional)
      delayedRegistration: {
        affiant: {
          name: '',
          civilStatus: 'Single',
          residenceAddress: '',
          age: '',
          signature: '',
        },
        deceased: {
          name: '',
          dateOfDeath: '',
          placeOfDeath: '',
          burialInfo: {
            date: '',
            place: '',
            method: undefined,
          },
        },
        attendance: {
          wasAttended: false,
          attendedBy: '',
        },
        causeOfDeath: '',
        reasonForDelay: '',
        affidavitDate: undefined,
        affidavitDatePlace: '',
        adminOfficer: {
          signature: '',
          position: '',
        },
        ctcInfo: {
          number: '',
          issuedOn: '',
          issuedAt: '',
        },
      },
      // Disposal Information
      corpseDisposal: '',
      burialPermit: {
        number: '',
        dateIssued: undefined,
      },
      transferPermit: undefined,
      cemeteryOrCrematory: {
        name: '',
        address: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      // Informant
      informant: {
        signature: '',
        nameInPrint: '',
        relationshipToDeceased: '',
        address: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
        date: undefined,
      },
      // Processing Information
      preparedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      receivedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      registeredByOffice: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      remarks: '',
    },
  });

  const onSubmit = async (data: DeathCertificateFormValues) => {
    try {
      await submitDeathCertificateForm(data);
      toast.success('Form submitted successfully');
      onOpenChange?.(false);
    } catch {
      toast.error('Submission failed, please try again');
    }
  };

  const handleError = (errors: any) => {
    console.error('Validation Errors:', errors);
    toast.error('Please check form for errors');
  };

  return { formMethods, onSubmit, handleError };
}

// For testing

// import { submitDeathCertificateForm } from '@/hooks/form-certificate-actions';
// import {
//   DeathCertificateFormValues,
//   deathCertificateFormSchema,
// } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// interface UseDeathCertificateFormProps {
//   onOpenChange?: (open: boolean) => void;
// }

// export function useDeathCertificateForm({
//   onOpenChange,
// }: UseDeathCertificateFormProps = {}) {
//   const formMethods = useForm<DeathCertificateFormValues>({
//     resolver: zodResolver(deathCertificateFormSchema),
//     mode: 'onChange',
//     reValidateMode: 'onChange',
//     defaultValues: {
//       registryNumber: '2024-0002',
//       province: 'Province A',
//       cityMunicipality: 'City X',
//       // Deceased Information
//       name: {
//         first: 'John',
//         middle: 'A.',
//         last: 'Doe',
//       },
//       sex: 'Male', // must be either 'Male' or 'Female'
//       dateOfDeath: new Date('2023-02-15'),
//       timeOfDeath: new Date('2023-02-15T14:30:00'),
//       dateOfBirth: new Date('1980-01-01'),
//       ageAtDeath: {
//         years: '43',
//         months: '1',
//         days: '14',
//         hours: '0',
//       },
//       placeOfDeath: {
//         houseNo: '123',
//         st: 'Main St',
//         barangay: 'Barangay 1',
//         cityMunicipality: 'City X',
//         province: 'Province A',
//         country: 'Country Y',
//       },
//       civilStatus: 'Married',
//       religion: 'Christianity',
//       citizenship: 'Country Y',
//       residence: {
//         houseNo: '123',
//         st: 'Main St',
//         barangay: 'Barangay 1',
//         cityMunicipality: 'City X',
//         province: 'Province A',
//         country: 'Country Y',
//       },
//       occupation: 'Engineer',
//       // Birth Information
//       birthInformation: {
//         ageOfMother: '35',
//         methodOfDelivery: 'Normal spontaneous vertex',
//         lengthOfPregnancy: 39,
//         typeOfBirth: 'Single',
//         birthOrder: 'First', // allowed: 'First', 'Second', etc.
//       },
//       // Parent Information
//       parents: {
//         fatherName: {
//           first: 'Robert',
//           middle: 'B.',
//           last: 'Doe',
//         },
//         motherName: {
//           first: 'Jane',
//           middle: 'C.',
//           last: 'Doe',
//         },
//       },
//       // Causes of Death 19b (8 days and over)
//       causesOfDeath19b: {
//         immediate: {
//           cause: 'Cardiac arrest',
//           interval: '30 minutes',
//         },
//         antecedent: {
//           cause: 'Heart attack',
//           interval: '1 hour',
//         },
//         underlying: {
//           cause: 'Coronary artery disease',
//           interval: '2 hours',
//         },
//         otherSignificantConditions: 'None',
//       },
//       // Medical Certificate
//       medicalCertificate: {
//         causesOfDeath: {
//           mainDiseaseOfInfant: 'N/A', // not applicable for adult deaths
//           otherDiseasesOfInfant: '',
//           mainMaternalDisease: '',
//           otherMaternalDisease: '',
//           otherRelevantCircumstances: '',
//           immediate: { cause: 'Cardiac arrest', interval: '30 minutes' },
//           antecedent: { cause: 'Heart attack', interval: '1 hour' },
//           underlying: { cause: 'Coronary artery disease', interval: '2 hours' },
//           otherSignificantConditions: 'None',
//         },
//         maternalCondition: {
//           pregnantNotInLabor: false,
//           pregnantInLabor: false,
//           lessThan42Days: false,
//           daysTo1Year: false,
//           noneOfTheAbove: true,
//         },
//         externalCauses: {
//           mannerOfDeath: '',
//           placeOfOccurrence: '',
//         },
//         attendant: {
//           type: 'PRIVATE_PHYSICIAN', // valid options: 'PRIVATE_PHYSICIAN', 'PUBLIC_HEALTH_OFFICER', 'HOSPITAL_AUTHORITY', 'NONE', 'OTHERS'
//           othersSpecify: '',
//           duration: {
//             from: new Date('2023-02-15T14:00:00'),
//             to: new Date('2023-02-15T14:45:00'),
//           },
//         },
//         autopsy: false,
//       },
//       // Certification of Death
//       certificationOfDeath: {
//         hasAttended: true,
//         signature: 'Dr. Signature',
//         nameInPrint: 'Dr. John Doe',
//         titleOfPosition: 'Medical Examiner',
//         address: {
//           houseNo: '456',
//           st: 'Second St',
//           barangay: 'Barangay 2',
//           cityMunicipality: 'City Y',
//           province: 'Province B',
//           country: 'Country Y',
//         },
//         date: new Date('2023-02-16'),
//         healthOfficerSignature: 'Health Officer Sig',
//         healthOfficerNameInPrint: 'Health Officer Name',
//       },
//       // Review
//       reviewedBy: {
//         signature: 'Reviewer Sig',
//         date: new Date('2023-02-16'),
//       },
//       // Certificates
//       postmortemCertificate: {
//         causeOfDeath: 'Cardiac arrest confirmed',
//         signature: 'Postmortem Sig',
//         nameInPrint: 'Postmortem Name',
//         date: new Date('2023-02-16'),
//         titleDesignation: 'Postmortem Officer',
//         address: 'Hospital Address',
//       },
//       embalmerCertification: {
//         nameOfDeceased: 'John Doe',
//         signature: 'Embalmer Sig',
//         nameInPrint: 'Embalmer Name',
//         address: 'Funeral Home Address',
//         titleDesignation: 'Embalmer',
//         licenseNo: 'LIC12345',
//         issuedOn: '2022-01-01',
//         issuedAt: 'Local Authority',
//         expiryDate: '2025-01-01',
//       },
//       // Delayed Registration - pre-filled with sample data
//       delayedRegistration: {
//         affiant: {
//           name: 'Affiant Name',
//           civilStatus: 'Single',
//           residenceAddress: 'Affiant Address',
//           age: '40',
//           signature: 'Affiant Sig',
//         },
//         deceased: {
//           name: 'John Doe',
//           dateOfDeath: '2023-02-15',
//           placeOfDeath: 'City X',
//           burialInfo: {
//             date: '2023-02-17',
//             place: 'Cemetery Y',
//             method: 'Buried',
//           },
//         },
//         attendance: {
//           wasAttended: true,
//           attendedBy: 'Attendant Name',
//         },
//         causeOfDeath: 'Natural',
//         reasonForDelay: 'Administrative delays',
//         affidavitDate: new Date('2023-02-18'),
//         affidavitDatePlace: 'City X',
//         adminOfficer: {
//           signature: 'Admin Sig',
//           position: 'Registrar',
//         },
//         ctcInfo: {
//           number: 'CTC123',
//           issuedOn: '2023-02-18',
//           issuedAt: 'City X',
//         },
//       },
//       // Disposal Information
//       corpseDisposal: 'Burial', // if you need to test embalming, change this to "Embalming"
//       burialPermit: {
//         number: 'BP123456',
//         dateIssued: new Date('2023-02-15'),
//       },
//       transferPermit: {
//         number: 'TP123',
//         dateIssued: new Date('2023-02-15').toISOString(),
//       },
//       cemeteryOrCrematory: {
//         name: 'Cemetery Y',
//         address: {
//           houseNo: '789',
//           st: 'Cemetery St',
//           barangay: 'Barangay 3',
//           cityMunicipality: 'City X', // note: if this differs from placeOfDeath, ensure transferPermit is provided
//           province: 'Province A',
//           country: 'Country Y',
//         },
//       },
//       // Informant
//       informant: {
//         signature: 'Informant Sig',
//         nameInPrint: 'Informant Name',
//         relationshipToDeceased: 'Friend',
//         address: {
//           houseNo: '101',
//           st: 'Informant St',
//           barangay: 'Barangay 4',
//           cityMunicipality: 'City Z',
//           province: 'Province C',
//           country: 'Country Y',
//         },
//         date: new Date('2023-02-16'),
//       },
//       // Processing Information
//       preparedBy: {
//         signature: 'Preparer Sig',
//         nameInPrint: 'Preparer Name',
//         titleOrPosition: 'Officer',
//         date: new Date('2023-02-16'),
//       },
//       receivedBy: {
//         signature: 'Receiver Sig',
//         nameInPrint: 'Receiver Name',
//         titleOrPosition: 'Officer',
//         date: new Date('2023-02-16'),
//       },
//       registeredByOffice: {
//         signature: 'Registrar Sig',
//         nameInPrint: 'Registrar Name',
//         titleOrPosition: 'Registrar',
//         date: new Date('2023-02-16'),
//       },
//       remarks: 'Test remarks',
//     },

//     // defaultValues: {
//     //   registryNumber: '',
//     //   province: '',
//     //   cityMunicipality: '',
//     //   // Deceased Information
//     //   name: {
//     //     first: '',
//     //     middle: '',
//     //     last: '',
//     //   },
//     //   sex: undefined,
//     //   dateOfDeath: undefined,
//     //   timeOfDeath: undefined,
//     //   dateOfBirth: undefined,
//     //   ageAtDeath: {
//     //     years: '',
//     //     months: '',
//     //     days: '',
//     //     hours: '',
//     //   },
//     //   placeOfDeath: {
//     //     houseNo: '',
//     //     st: '',
//     //     barangay: '',
//     //     cityMunicipality: '',
//     //     province: '',
//     //     country: '',
//     //   },
//     //   civilStatus: '',
//     //   religion: '',
//     //   citizenship: '',
//     //   residence: {
//     //     houseNo: '',
//     //     st: '',
//     //     barangay: '',
//     //     cityMunicipality: '',
//     //     province: '',
//     //     country: '',
//     //   },
//     //   occupation: '',
//     //   // Birth Information
//     //   birthInformation: {
//     //     ageOfMother: '',
//     //     methodOfDelivery: 'Normal spontaneous vertex',
//     //     lengthOfPregnancy: undefined,
//     //     typeOfBirth: 'Single',
//     //     birthOrder: undefined,
//     //   },
//     //   // Parent Information
//     //   parents: {
//     //     fatherName: {
//     //       first: '',
//     //       middle: '',
//     //       last: '',
//     //     },
//     //     motherName: {
//     //       first: '',
//     //       middle: '',
//     //       last: '',
//     //     },
//     //   },
//     //   // Causes of Death 19b (8 days and over)
//     //   causesOfDeath19b: {
//     //     immediate: {
//     //       cause: '',
//     //       interval: '',
//     //     },
//     //     antecedent: {
//     //       cause: '',
//     //       interval: '',
//     //     },
//     //     underlying: {
//     //       cause: '',
//     //       interval: '',
//     //     },
//     //     otherSignificantConditions: '',
//     //   },
//     //   // Medical Certificate
//     //   medicalCertificate: {
//     //     causesOfDeath: {
//     //       mainDiseaseOfInfant: '',
//     //       otherDiseasesOfInfant: '',
//     //       mainMaternalDisease: '',
//     //       otherMaternalDisease: '',
//     //       otherRelevantCircumstances: '',
//     //       immediate: { cause: '', interval: '' },
//     //       antecedent: { cause: '', interval: '' },
//     //       underlying: { cause: '', interval: '' },
//     //       otherSignificantConditions: '',
//     //     },
//     //     maternalCondition: {
//     //       pregnantNotInLabor: false,
//     //       pregnantInLabor: false,
//     //       lessThan42Days: false,
//     //       daysTo1Year: false,
//     //       noneOfTheAbove: false,
//     //     },
//     //     externalCauses: {
//     //       mannerOfDeath: '',
//     //       placeOfOccurrence: '',
//     //     },
//     //     attendant: {
//     //       type: undefined,
//     //       othersSpecify: '',
//     //       duration: { from: undefined, to: undefined },
//     //     },
//     //     autopsy: false,
//     //   },
//     //   // Certification of Death
//     //   certificationOfDeath: {
//     //     hasAttended: false,
//     //     signature: '',
//     //     nameInPrint: '',
//     //     titleOfPosition: '',
//     //     address: {
//     //       houseNo: '',
//     //       st: '',
//     //       barangay: '',
//     //       cityMunicipality: '',
//     //       province: '',
//     //       country: '',
//     //     },
//     //     date: undefined,
//     //     healthOfficerSignature: '',
//     //     healthOfficerNameInPrint: '',
//     //   },
//     //   // Review
//     //   reviewedBy: {
//     //     signature: '',
//     //     date: undefined,
//     //   },
//     //   // Certificates
//     //   postmortemCertificate: undefined,
//     //   embalmerCertification: undefined,
//     //   // Delayed Registration - pre-filled with blank defaults
//     //   delayedRegistration: {
//     //     affiant: {
//     //       name: '',
//     //       civilStatus: 'Single',
//     //       residenceAddress: '',
//     //       age: '',
//     //       signature: '',
//     //     },
//     //     deceased: {
//     //       name: '',
//     //       dateOfDeath: '',
//     //       placeOfDeath: '',
//     //       burialInfo: {
//     //         date: '',
//     //         place: '',
//     //         method: undefined,
//     //       },
//     //     },
//     //     attendance: {
//     //       wasAttended: false,
//     //       attendedBy: '',
//     //     },
//     //     causeOfDeath: '',
//     //     reasonForDelay: '',
//     //     affidavitDate: undefined,
//     //     affidavitDatePlace: '',
//     //     adminOfficer: {
//     //       signature: '',
//     //       position: '',
//     //     },
//     //     ctcInfo: {
//     //       number: '',
//     //       issuedOn: '',
//     //       issuedAt: '',
//     //     },
//     //   },
//     //   // Disposal Information
//     //   corpseDisposal: '',
//     //   burialPermit: {
//     //     number: '',
//     //     dateIssued: undefined,
//     //   },
//     //   transferPermit: undefined,
//     //   cemeteryOrCrematory: {
//     //     name: '',
//     //     address: {
//     //       houseNo: '',
//     //       st: '',
//     //       barangay: '',
//     //       cityMunicipality: '',
//     //       province: '',
//     //       country: '',
//     //     },
//     //   },
//     //   // Informant
//     //   informant: {
//     //     signature: '',
//     //     nameInPrint: '',
//     //     relationshipToDeceased: '',
//     //     address: {
//     //       houseNo: '',
//     //       st: '',
//     //       barangay: '',
//     //       cityMunicipality: '',
//     //       province: '',
//     //       country: '',
//     //     },
//     //     date: undefined,
//     //   },
//     //   // Processing Information
//     //   preparedBy: {
//     //     signature: '',
//     //     nameInPrint: '',
//     //     titleOrPosition: '',
//     //     date: undefined,
//     //   },
//     //   receivedBy: {
//     //     signature: '',
//     //     nameInPrint: '',
//     //     titleOrPosition: '',
//     //     date: undefined,
//     //   },
//     //   registeredByOffice: {
//     //     signature: '',
//     //     nameInPrint: '',
//     //     titleOrPosition: '',
//     //     date: undefined,
//     //   },
//     //   remarks: '',
//     // },
//   });

//   const onSubmit = async (data: DeathCertificateFormValues) => {
//     try {
//       await submitDeathCertificateForm(data);
//       toast.success('Form submitted successfully');
//       onOpenChange?.(false);
//     } catch {
//       toast.error('Submission failed, please try again');
//     }
//   };

//   const handleError = (errors: any) => {
//     console.error('Validation Errors:', errors);
//     toast.error('Please check form for errors');
//   };

//   return { formMethods, onSubmit, handleError };
// }
