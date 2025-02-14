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
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const [registryNCRMode, setRegistryNCRMode] = useState(false);

  const formMethods = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateFormSchema),
    mode: 'onChange',
    defaultValues: {
      registryNumber: '',
      province: '',
      cityMunicipality: '',
      childInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        sex: 'Male',
        dateOfBirth: '',
        placeOfBirth: {
          hospital: '',
          cityMunicipality: '',
          province: '',
        },
        typeOfBirth: 'Single',
        birthOrder: '',
        weightAtBirth: '',
      },
      // Add other default values as needed
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
    // Add other specific error checks
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
                      <RegistryInformationCard
                        formType={FormType.BIRTH}
                        isNCRMode={registryNCRMode}
                        setIsNCRMode={setRegistryNCRMode}
                      />

                      {/* Child Information Section */}
                      {/* TODO: Add Child Information Component */}

                      {/* Mother Information Section */}
                      {/* TODO: Add Mother Information Component */}

                      {/* Father Information Section */}
                      {/* TODO: Add Father Information Component */}

                      {/* Marriage Information Section */}
                      {/* TODO: Add Marriage Information Component */}

                      {/* Attendant Information Section */}
                      {/* TODO: Add Attendant Information Component */}

                      {/* Informant Section */}
                      {/* TODO: Add Informant Component */}

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
