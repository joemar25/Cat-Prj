'use client';

import { ConfirmationDialog } from '@/components/custom/confirmation-dialog/confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createDeathCertificate } from '@/hooks/form-certificate-actions';
import {
  DeathCertificateFormProps,
  DeathCertificateFormValues,
  createDeathCertificateSchema,
  defaultDeathCertificateFormValues,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormType } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Shared/reusable components
import PreparedByCard from './form-cards/shared-components/prepared-by-card';
import ReceivedByCard from './form-cards/shared-components/received-by-card';
import RegisteredAtOfficeCard from './form-cards/shared-components/registered-at-office-card';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';
import RemarksCard from './form-cards/shared-components/remarks-card';

// Death-specific components
import AttendantInformationCard from './form-cards/death-cards/attendant-information-card';
import CausesOfDeathCard from './form-cards/death-cards/causes-of-death';
import CertificationOfDeathCard from './form-cards/death-cards/certification-of-death-card';
import CertificationInformantCard from './form-cards/death-cards/certification-of-informant-card';
import DeathByExternalCausesCard from './form-cards/death-cards/death-by-external-causes';
import DeceasedInformationCard from './form-cards/death-cards/deceased-information-card';
import DisposalInformationCard from './form-cards/death-cards/disposal-information-card';
import MaternalConditionCard from './form-cards/death-cards/maternal-condition-card';
import MedicalCertificateCard from './form-cards/death-cards/medical-certificate-card';
import DeathCertificatePDF from './preview/death-certificate/death-certificate-preview';
import { DeathCertificateResponse } from '@/lib/types/form-certificates-types/types';

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<DeathCertificateFormValues | null>(null);

  // Manage a flag for registry mode (adjust as needed)
  const [isNCRMode, setIsNCRMode] = useState(false);

  // Initialize the form using our Zod schema and default values.
  const formMethods = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(
      createDeathCertificateSchema(isNCRMode, isNCRMode, isNCRMode, isNCRMode)
    ),
    defaultValues: defaultDeathCertificateFormValues,
  });

  // onSubmit handler: call the server action and show toasts based on response.
  const onSubmit = async (values: DeathCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result: DeathCertificateResponse = await createDeathCertificate(
        values
      );
      if (result.success) {
        toast.success('Death Certificate Registration', {
          description: result.message,
        });
        onOpenChange(false);
        formMethods.reset();
      } else {
        if (result.warning) {
          setPendingSubmission(values);
          setShowAlert(true);
        } else {
          toast.error('Registration Error', {
            description: result.error,
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      toast.error('Registration Error', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // confirmSubmit: called when user confirms to proceed despite duplicate warnings.
  const confirmSubmit = async () => {
    if (pendingSubmission) {
      try {
        setIsSubmitting(true);
        const result: DeathCertificateResponse = await createDeathCertificate(
          pendingSubmission,
          true
        );
        if (result.success) {
          toast.success('Death Certificate Registration', {
            description: result.message,
          });
          onOpenChange(false);
          formMethods.reset();
        } else {
          toast.error('Registration Error', {
            description: result.error,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.';
        toast.error('Registration Error', { description: errorMessage });
      } finally {
        setIsSubmitting(false);
        setShowAlert(false);
        setPendingSubmission(null);
      }
    }
  };

  const handleError = () => {
    const errors = formMethods.formState.errors;
    formMethods
      .trigger(['registryNumber', 'province', 'cityMunicipality'])
      .then(() => {
        if (
          formMethods.getFieldState('registryNumber').error ||
          formMethods.getFieldState('province').error ||
          formMethods.getFieldState('cityMunicipality').error
        ) {
          toast.error('Registry Information', {
            description:
              'Please complete registry number, province, and city/municipality fields',
          });
          return;
        }
        if (errors.deceasedInfo) {
          toast.error(
            'Please check the deceased information section for errors'
          );
          return;
        }
        if (errors.familyInfo) {
          toast.error('Please check the family information section for errors');
          return;
        }
        toast.error('Please check all required fields and try again');
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0'>
        <div className='h-full flex flex-col'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-center py-4'>
              Certificate of Death
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
                      {/* Registry Information */}
                      <RegistryInformationCard
                        formType={FormType.DEATH}
                        isNCRMode={isNCRMode}
                        setIsNCRMode={setIsNCRMode}
                      />

                      {/* Deceased Information */}
                      <DeceasedInformationCard />

                      {/* Medical Certificate */}
                      <MedicalCertificateCard />

                      {/* Causes of Death */}
                      <CausesOfDeathCard />

                      {/* Maternal Condition */}
                      <MaternalConditionCard />

                      {/* Death by External Causes */}
                      <DeathByExternalCausesCard />

                      {/* Attendant Information */}
                      <AttendantInformationCard />

                      {/* Certification of Death */}
                      <CertificationOfDeathCard />

                      {/* Disposal Information */}
                      <DisposalInformationCard />

                      {/* Certification Informant */}
                      <CertificationInformantCard />

                      {/* Prepared By */}
                      <PreparedByCard<DeathCertificateFormValues>
                        fieldPrefix='preparedBy'
                        cardTitle='Prepared By'
                      />

                      {/* Received By */}
                      <ReceivedByCard<DeathCertificateFormValues>
                        fieldPrefix='receivedBy'
                        cardTitle='Received By'
                      />

                      {/* Registered At Office */}
                      <RegisteredAtOfficeCard<DeathCertificateFormValues>
                        fieldPrefix='registeredByOffice'
                        cardTitle='Registered at the Office of Civil Registrar'
                      />

                      {/* Remarks */}
                      <RemarksCard<DeathCertificateFormValues>
                        fieldName='remarks'
                        cardTitle='Death Certificate Remarks'
                        label='Additional Remarks'
                        placeholder='Enter any additional remarks or annotations'
                      />

                      <DialogFooter>
                        <Button
                          type='button'
                          variant='outline'
                          className='h-10'
                          onClick={onCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type='submit'
                          className='h-10 ml-2'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className='mr-2 h-4 w-4' />
                              Save Registration
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </FormProvider>
                  <ConfirmationDialog
                    open={showAlert}
                    onOpenChange={setShowAlert}
                    onConfirm={confirmSubmit}
                    isSubmitting={isSubmitting}
                    formType='DEATH'
                    title='Duplicate Record Detected'
                    description='A similar death record already exists. Do you want to proceed with saving this record?'
                    confirmButtonText='Proceed'
                    cancelButtonText='Cancel'
                  />
                </div>
              </ScrollArea>
            </div>
            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <DeathCertificatePDF data={formMethods.watch()} />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
