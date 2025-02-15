'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  BirthCertificateFormProps,
  birthCertificateFormSchema,
  BirthCertificateFormValues,
} from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormType } from '@prisma/client';
import { Save } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { submitBirthCertificateForm } from '@/hooks/form-certificate-actions';
import DelayedRegistrationForm from './form-cards/birth-cards/affidavit-for-delayed-registration';
import AffidavitOfPaternityForm from './form-cards/birth-cards/affidavit-of-paternity';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageInformationCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';

import {
  PreparedByCard,
  ReceivedByCard,
  RegisteredAtOfficeCard,
} from './form-cards/shared-components/processing-details-cards';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';
import RemarksCard from './form-cards/shared-components/remarks-card';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const formMethods = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      registryNumber: '1234567890',
      province: 'Quezon',
      cityMunicipality: 'Legazpi City',
      childInfo: {
        firstName: 'Juan',
        middleName: 'De La',
        lastName: 'Cruz',
        sex: 'Male', // 'Male' or 'Female'
        dateOfBirth: new Date('2020-05-15'), // Ensuring Date type
        placeOfBirth: {
          hospital: 'Legazpi City Hospital',
          cityMunicipality: 'Legazpi City',
          province: 'Albay',
        },
        typeOfBirth: 'Single',
        birthOrder: '1',
        weightAtBirth: '3.2', // in kg
      },
      motherInfo: {
        firstName: 'Maria',
        middleName: 'Santos',
        lastName: 'Garcia',
        citizenship: 'Filipino',
        religion: 'Catholic',
        occupation: 'Teacher',
        age: '32',
        totalChildrenBornAlive: '3',
        childrenStillLiving: '2',
        childrenNowDead: '0',
        residence: {
          houseNo: '123',
          st: 'Rizal St.',
          barangay: 'Poblacion',
          cityMunicipality: 'Legazpi City',
          province: 'Albay',
          country: 'Philippines',
        },
      },
      fatherInfo: {
        firstName: 'Pedro',
        middleName: 'Lopez',
        lastName: 'Santos',
        citizenship: 'Filipino',
        religion: 'Catholic',
        occupation: 'Engineer',
        age: '35',
        residence: {
          houseNo: '123',
          st: 'Rizal St.',
          barangay: 'Poblacion',
          cityMunicipality: 'Legazpi City',
          province: 'Albay',
          country: 'Philippines',
        },
      },
      parentMarriage: {
        date: new Date('2015-06-15'), // Fixing Date type
        place: {
          houseNo: '123',
          st: 'Rizal St.',
          barangay: 'Poblacion',
          cityMunicipality: 'Legazpi City',
          province: 'Albay',
          country: 'Philippines',
        },
      },
      attendant: {
        type: 'Physician', // Can be 'Physician', 'Nurse', etc.
        certification: {
          time: new Date('2020-05-15T08:30:00'), // Ensuring Date type for time
          signature: 'Dr. Juan Dela Cruz',
          name: 'Juan Dela Cruz',
          title: 'MD',
          address: {
            houseNo: '123',
            st: 'Rizal St.',
            barangay: 'Poblacion',
            cityMunicipality: 'Legazpi City',
            province: 'Albay',
            country: 'Philippines',
          },
          date: new Date('2020-05-15'), // Ensuring Date type
        },
      },
      informant: {
        signature: 'Josefina Garcia',
        name: 'Josefina Garcia',
        relationship: 'Aunt',
        address: {
          houseNo: '45',
          st: 'Magallanes St.',
          barangay: 'San Isidro',
          cityMunicipality: 'Legazpi City',
          province: 'Albay',
          country: 'Philippines',
        },
        date: new Date('2020-05-16'), // Ensuring Date type
      },
      preparedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: new Date('2020-05-15'), // Ensuring Date type
      },
      receivedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: new Date('2020-05-16'), // Ensuring Date type
      },
      registeredByOffice: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: new Date('2020-05-16'), // Ensuring Date type
      },
      hasAffidavitOfPaternity: false,
      isDelayedRegistration: false,
      remarks: 'No additional remarks',
    },

    // defaultValues: {
    //   registryNumber: '',
    //   province: '',
    //   cityMunicipality: '',
    //   childInfo: {
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     sex: undefined,
    //     dateOfBirth: undefined,
    //     placeOfBirth: {
    //       hospital: '',
    //       cityMunicipality: '',
    //       province: '',
    //     },
    //     typeOfBirth: 'Single',
    //     birthOrder: '',
    //     weightAtBirth: '',
    //   },
    //   motherInfo: {
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     citizenship: '',
    //     religion: '',
    //     occupation: '',
    //     age: '',
    //     totalChildrenBornAlive: '',
    //     childrenStillLiving: '',
    //     childrenNowDead: '',
    //     residence: {
    //       houseNo: '',
    //       st: '',
    //       barangay: '',
    //       cityMunicipality: '',
    //       province: '',
    //       country: '',
    //     },
    //   },
    //   fatherInfo: {
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     citizenship: '',
    //     religion: '',
    //     occupation: '',
    //     age: '',
    //     residence: {
    //       houseNo: '',
    //       st: '',
    //       barangay: '',
    //       cityMunicipality: '',
    //       province: '',
    //       country: '',
    //     },
    //   },
    //   parentMarriage: {
    //     date: undefined,
    //     place: {
    //       houseNo: '',
    //       st: '',
    //       barangay: '',
    //       cityMunicipality: '',
    //       province: '',
    //       country: '',
    //     },
    //   },
    //   attendant: {
    //     type: undefined,
    //     certification: {
    //       time: undefined,
    //       signature: '',
    //       name: '',
    //       title: '',
    //       address: {
    //         houseNo: '',
    //         st: '',
    //         barangay: '',
    //         cityMunicipality: '',
    //         province: '',
    //         country: '',
    //       },
    //       date: undefined,
    //     },
    //   },
    //   informant: {
    //     signature: '',
    //     name: '',
    //     relationship: '',
    //     address: {
    //       houseNo: '',
    //       st: '',
    //       barangay: '',
    //       cityMunicipality: '',
    //       province: '',
    //       country: '',
    //     },
    //     date: undefined,
    //   },
    //   preparedBy: {
    //     signature: '',
    //     nameInPrint: '',
    //     titleOrPosition: '',
    //     date: undefined,
    //   },
    //   receivedBy: {
    //     signature: '',
    //     nameInPrint: '',
    //     titleOrPosition: '',
    //     date: undefined,
    //   },
    //   registeredByOffice: {
    //     signature: '',
    //     nameInPrint: '',
    //     titleOrPosition: '',
    //     date: undefined,
    //   },
    //   hasAffidavitOfPaternity: false,
    //   isDelayedRegistration: false,
    //   remarks: '',
    // },
  });

  const onSubmit = async (data: BirthCertificateFormValues) => {
    try {
      console.log('Submitting form data:', JSON.stringify(data, null, 2));
      const result = await submitBirthCertificateForm(data);

      if ('data' in result) {
        console.log('Submission successful:', result);
        toast.success(
          `Birth certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`
        );
        onOpenChange?.(false);
        formMethods.reset();
      } else if ('error' in result) {
        console.log('Submission error:', result.error);
        const errorMessage = result.error.includes('No user found with name')
          ? 'Invalid prepared by user. Please check the name.'
          : result.error;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred while submitting the form');
    }
  };
  const handleError = (errors: any) => {
    console.log('Form Validation Errors:', JSON.stringify(errors, null, 2));

    // Log specific section errors
    if (errors.registryNumber || errors.province || errors.cityMunicipality) {
      console.log('Registry Information Errors:', {
        registryNumber: errors.registryNumber?.message,
        province: errors.province?.message,
        cityMunicipality: errors.cityMunicipality?.message,
      });
      toast.error('Please check registry information');
      return;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0'>
        <div className='h-full flex flex-col'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-center py-4'>
              Certificate of Live Birth
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            <div className='w-1/2 border-r'>
              <ScrollArea className='h-[calc(95vh-120px)]'>
                <div className='p-6'>
                  <FormProvider {...formMethods}>
                    <form
                      onSubmit={formMethods.handleSubmit(onSubmit, handleError)}
                      className='space-y-6'
                    >
                      <RegistryInformationCard formType={FormType.BIRTH} />
                      <ChildInformationCard />
                      <MotherInformationCard />
                      <FatherInformationCard />
                      <MarriageInformationCard />
                      <AttendantInformationCard />
                      <CertificationOfInformantCard />
                      <PreparedByCard<BirthCertificateFormValues> />
                      <ReceivedByCard<BirthCertificateFormValues> />
                      <RegisteredAtOfficeCard<BirthCertificateFormValues>
                        fieldPrefix='registeredByOffice'
                        cardTitle='Registered at the Office of Civil Registrar'
                      />
                      <RemarksCard<BirthCertificateFormValues>
                        fieldName='remarks'
                        cardTitle='Birth Certificate Remarks'
                        label='Additional Remarks'
                        placeholder='Enter any additional remarks or annotations'
                      />
                      <AffidavitOfPaternityForm />
                      <DelayedRegistrationForm />

                      <DialogFooter>
                        <Button
                          type='button'
                          variant='outline'
                          className='h-10'
                          onClick={onCancel}
                        >
                          Cancel
                        </Button>
                        <Button type='submit' className='h-10 ml-2'>
                          <Save className='mr-2 h-4 w-4' />
                          Save Registration
                        </Button>
                      </DialogFooter>
                    </form>
                  </FormProvider>
                </div>
              </ScrollArea>
            </div>

            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                {/* <PDFViewer width='100%' height='100%'>
                  <BirthCertificatePDF data={formMethods.watch()} />
                </PDFViewer> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
