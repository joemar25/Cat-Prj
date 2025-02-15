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
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageInformationCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  // Use separate NCR mode state for registry and child sections.

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
        type: undefined, // Will be preprocessed to undefined if empty, then refined as required.
        certification: {
          time: undefined,
          signature: '',
          name: '',
          title: '',
          address: {
            houseNo: '',
            st: '', // Using "st" (not "street")
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

      hasAffidavitOfPaternity: false,
      isDelayedRegistration: false,
      remarks: '',
    },
  });

  const onSubmit = async (data: BirthCertificateFormValues) => {
    try {
      console.log('Form submitted:', data);
      // Your submission logic here
      toast.success('Form validated successfully');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Form submission failed');
    }
  };

  const handleError = (errors: any) => {
    console.error('Form validation errors:', errors);
    if (errors.registryNumber || errors.province || errors.cityMunicipality) {
      toast.error('Please check registry information');
      return;
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
            {/* Left Side - Form */}
            <div className='w-1/2 border-r'>
              <ScrollArea className='h-[calc(95vh-120px)]'>
                <div className='p-6'>
                  <FormProvider {...formMethods}>
                    <form
                      onSubmit={formMethods.handleSubmit(onSubmit, handleError)}
                      className='space-y-6'
                    >
                      {/* Registry Information Section */}
                      <RegistryInformationCard formType={FormType.BIRTH} />

                      {/* Child Information Section */}
                      <ChildInformationCard />

                      {/* Mother Information Section */}
                      <MotherInformationCard />

                      {/* Father Information Section */}
                      <FatherInformationCard />

                      {/* Marriage Information Section */}
                      <MarriageInformationCard />

                      {/* Attendant Information Section */}
                      <AttendantInformationCard />

                      {/* Certification of Informant Section */}
                      <CertificationOfInformantCard />

                      {/* Processing Section */}
                      {/* TODO: Add Processing Component */}

                      {/* Affidavit Section */}
                      {/* TODO: Add Affidavit Component */}

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

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                {/* PDF Preview will be added here later */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
