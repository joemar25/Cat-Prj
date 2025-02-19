// useBirthCertificateForm.ts
import { submitBirthCertificateForm } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormValues,
  birthCertificateFormSchema,
} from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UseBirthCertificateFormProps {
  onOpenChange?: (open: boolean) => void;
}

export function useBirthCertificateForm({
  onOpenChange,
}: UseBirthCertificateFormProps = {}) {
  const formMethods = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      registryNumber: '',
      province: '',
      cityMunicipality: '',
      childInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        sex: undefined,
        dateOfBirth: undefined,
        placeOfBirth: {
          hospital: '',
          cityMunicipality: '',
          province: '',
        },
        typeOfBirth: 'Single',
        birthOrder: '',
        weightAtBirth: '',
      },
      motherInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        citizenship: '',
        religion: '',
        occupation: '',
        age: '',
        totalChildrenBornAlive: '',
        childrenStillLiving: '',
        childrenNowDead: '',
        residence: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      fatherInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        citizenship: '',
        religion: '',
        occupation: '',
        age: '',
        residence: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      parentMarriage: {
        date: undefined,
        place: {
          houseNo: '',
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      attendant: {
        type: undefined,
        certification: {
          time: undefined,
          signature: '',
          name: '',
          title: '',
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
      },
      informant: {
        signature: '',
        name: '',
        relationship: '',
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
      hasAffidavitOfPaternity: false,
      isDelayedRegistration: false,
      remarks: '',
    },
  });

  const onSubmit = async (data: BirthCertificateFormValues) => {
    try {
      const result = await submitBirthCertificateForm(data);

      if ('data' in result) {
        console.log('Submission successful:', result);
        toast.success(
          `Birth certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`
        );
        onOpenChange?.(false);
      } else if ('error' in result) {
        console.log('Submission error:', result.error);
        const errorMessage = result.error.includes('No user found with name')
          ? 'Invalid prepared by user. Please check the name.'
          : result.error;
        toast.error(errorMessage);
      }
      formMethods.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred while submitting the form');
    }
  };

  const handleError = (errors: any) => {
    console.log('Form Validation Errors:', JSON.stringify(errors, null, 2));

    if (errors.registryNumber || errors.province || errors.cityMunicipality) {
      console.log('Registry Information Errors:', {
        registryNumber: errors.registryNumber?.message,
        province: errors.province?.message,
        cityMunicipality: errors.cityMunicipality?.message,
      });
      toast.error('Please check registry information');
    }

    if (errors.childInfo) {
      console.log('Child Information Errors:', errors.childInfo);
    }

    if (errors.motherInfo) {
      console.log('Mother Information Errors:', errors.motherInfo);
    }

    if (errors.fatherInfo) {
      console.log('Father Information Errors:', errors.fatherInfo);
    }

    if (errors.attendant) {
      console.log('Attendant Information Errors:', errors.attendant);
    }

    if (errors.informant) {
      console.log('Informant Information Errors:', errors.informant);
    }

    if (errors.preparedBy || errors.receivedBy || errors.registeredByOffice) {
      console.log('Processing Details Errors:', {
        preparedBy: errors.preparedBy,
        receivedBy: errors.receivedBy,
        registeredByOffice: errors.registeredByOffice,
      });
    }

    toast.error('Please check form for errors');
  };

  return { formMethods, onSubmit, handleError };
}

// FOR TESTING SUBMISSION
// import { submitBirthCertificateForm } from '@/hooks/form-certificate-actions';
// import {
//   BirthCertificateFormValues,
//   birthCertificateFormSchema,
// } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// interface UseBirthCertificateFormProps {
//   onOpenChange?: (open: boolean) => void;
// }

// export function useBirthCertificateForm({
//   onOpenChange,
// }: UseBirthCertificateFormProps = {}) {
//   const formMethods = useForm<BirthCertificateFormValues>({
//     resolver: zodResolver(birthCertificateFormSchema),
//     mode: 'onChange',
//     reValidateMode: 'onChange',
//     defaultValues: {
//       registryNumber: '2024-0001',
//       province: 'Province X',
//       cityMunicipality: 'City Y',
//       childInfo: {
//         firstName: 'Alice',
//         middleName: 'B',
//         lastName: 'Smith',
//         sex: 'Female', // assuming the enum is defined with these string values
//         dateOfBirth: new Date('2024-01-01'),
//         placeOfBirth: {
//           hospital: 'City Hospital',
//           cityMunicipality: 'City Y',
//           province: 'Province X',
//         },
//         typeOfBirth: 'Single',
//         birthOrder: 'First',
//         weightAtBirth: '3.2', // in kilograms
//       },
//       motherInfo: {
//         firstName: 'Jane',
//         middleName: 'C',
//         lastName: 'Smith',
//         citizenship: 'Country Z',
//         religion: 'Christianity',
//         occupation: 'Teacher',
//         age: '30',
//         totalChildrenBornAlive: '2',
//         childrenStillLiving: '2',
//         childrenNowDead: '0',
//         residence: {
//           houseNo: '123',
//           st: 'Main St',
//           barangay: 'Barangay 1',
//           cityMunicipality: 'City Y',
//           province: 'Province X',
//           country: 'Country Z',
//         },
//       },
//       fatherInfo: {
//         firstName: 'John',
//         middleName: 'D',
//         lastName: 'Smith',
//         citizenship: 'Country Z',
//         religion: 'Christianity',
//         occupation: 'Engineer',
//         age: '32',
//         residence: {
//           houseNo: '456',
//           st: 'Second St',
//           barangay: 'Barangay 2',
//           cityMunicipality: 'City Y',
//           province: 'Province X',
//           country: 'Country Z',
//         },
//       },
//       parentMarriage: {
//         date: new Date('2020-06-15'),
//         place: {
//           houseNo: '789',
//           st: 'Third St',
//           barangay: 'Barangay 3',
//           cityMunicipality: 'City Y',
//           province: 'Province X',
//           country: 'Country Z',
//         },
//       },
//       attendant: {
//         type: 'Physician', // use one of your allowed enum values
//         certification: {
//           time: new Date('2024-01-01T10:00:00'),
//           signature: 'Dr. Signature',
//           name: 'Dr. Alice',
//           title: 'Pediatrician',
//           address: {
//             houseNo: '101',
//             st: 'Fourth St',
//             barangay: 'Barangay 4',
//             cityMunicipality: 'City Y',
//             province: 'Province X',
//             country: 'Country Z',
//           },
//           date: new Date('2024-01-01'),
//         },
//       },
//       informant: {
//         signature: 'Informant Signature',
//         name: 'Informant Name',
//         relationship: 'Mother',
//         address: {
//           houseNo: '123',
//           st: 'Main St',
//           barangay: 'Barangay 1',
//           cityMunicipality: 'City Y',
//           province: 'Province X',
//           country: 'Country Z',
//         },
//         date: new Date('2024-01-02'),
//       },
//       preparedBy: {
//         signature: 'Preparer Sig',
//         nameInPrint: 'Preparer Name',
//         titleOrPosition: 'Registrar',
//         date: new Date('2024-01-03'),
//       },
//       receivedBy: {
//         signature: 'Receiver Sig',
//         nameInPrint: 'Receiver Name',
//         titleOrPosition: 'Officer',
//         date: new Date('2024-01-03'),
//       },
//       registeredByOffice: {
//         signature: 'Registrar Sig',
//         nameInPrint: 'Registrar Name',
//         titleOrPosition: 'Registrar',
//         date: new Date('2024-01-03'),
//       },
//       hasAffidavitOfPaternity: false,
//       isDelayedRegistration: false,
//       remarks: 'Sample remarks for birth certificate',
//     },
//   });

//   const onSubmit = async (data: BirthCertificateFormValues) => {
//     try {
//       const result = await submitBirthCertificateForm(data);

//       if ('data' in result) {
//         console.log('Submission successful:', result);
//         toast.success(
//           `Birth certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`
//         );
//         onOpenChange?.(false);
//       } else if ('error' in result) {
//         console.log('Submission error:', result.error);
//         const errorMessage = result.error.includes('No user found with name')
//           ? 'Invalid prepared by user. Please check the name.'
//           : result.error;
//         toast.error(errorMessage);
//       }
//       formMethods.reset();
//     } catch (error) {
//       console.error('Form submission error:', error);
//       toast.error('An unexpected error occurred while submitting the form');
//     }
//   };

//   const handleError = (errors: any) => {
//     console.log('Form Validation Errors:', JSON.stringify(errors, null, 2));

//     if (errors.registryNumber || errors.province || errors.cityMunicipality) {
//       console.log('Registry Information Errors:', {
//         registryNumber: errors.registryNumber?.message,
//         province: errors.province?.message,
//         cityMunicipality: errors.cityMunicipality?.message,
//       });
//       toast.error('Please check registry information');
//     }

//     if (errors.childInfo) {
//       console.log('Child Information Errors:', errors.childInfo);
//     }

//     if (errors.motherInfo) {
//       console.log('Mother Information Errors:', errors.motherInfo);
//     }

//     if (errors.fatherInfo) {
//       console.log('Father Information Errors:', errors.fatherInfo);
//     }

//     if (errors.attendant) {
//       console.log('Attendant Information Errors:', errors.attendant);
//     }

//     if (errors.informant) {
//       console.log('Informant Information Errors:', errors.informant);
//     }

//     if (errors.preparedBy || errors.receivedBy || errors.registeredByOffice) {
//       console.log('Processing Details Errors:', {
//         preparedBy: errors.preparedBy,
//         receivedBy: errors.receivedBy,
//         registeredByOffice: errors.registeredByOffice,
//       });
//     }

//     toast.error('Please check form for errors');
//   };

//   return { formMethods, onSubmit, handleError };
// }
