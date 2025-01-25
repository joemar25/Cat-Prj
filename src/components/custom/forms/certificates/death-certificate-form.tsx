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
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createDeathCertificate } from '@/hooks/form-certificate-actions';
import {
  DeathCertificateFormProps,
  DeathCertificateFormValues,
  deathCertificateSchema,
  defaultDeathCertificateFormValues,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Import all the card components
import RegisteredAtOfficeCard from '@/components/custom/forms/certificates/form-cards/death-cards/registered-at-office-card';
import RemarksCard from '@/components/custom/forms/certificates/form-cards/death-cards/remarks-card';
import AttendantInformationCard from './form-cards/death-cards/attendant-information-card';
import CausesOfDeathCard from './form-cards/death-cards/causes-of-death';
import CertificationOfDeathCard from './form-cards/death-cards/certification-of-death-card';
import CertificationInformantCard from './form-cards/death-cards/certification-of-informant-card';
import DeathByExternalCausesCard from './form-cards/death-cards/death-by-external-causes';
import DisposalInformationCard from './form-cards/death-cards/disposal-information-card';
import MaternalConditionCard from './form-cards/death-cards/maternal-condition-card';
import MedicalCertificateCard from './form-cards/death-cards/medical-certificate-card';
import PersonalInformationCard from './form-cards/death-cards/personal-information-card';
import PreparedByCard from './form-cards/death-cards/prepared-by-card';
import ReceivedByCard from './form-cards/death-cards/received-by-card';
import RegistryInformationCard from './form-cards/death-cards/regsitry-information-card';
import DeathCertificatePDF from './preview/death-certificate/death-certificate-preview';

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<DeathCertificateFormValues | null>(null);

  const form = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateSchema),
    defaultValues: defaultDeathCertificateFormValues,
  });

  const onSubmit = async (values: DeathCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createDeathCertificate(values);

      if (result.success) {
        toast.success('Death Certificate Registration', {
          description: 'Death certificate has been registered successfully',
        });
        onOpenChange(false);
        form.reset();
      } else if (result.warning) {
        setPendingSubmission(values);
        setShowAlert(true);
      } else {
        toast.error('Registration Error', {
          description: result.error || 'Failed to register death certificate',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      toast.error('Registration Error', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSubmit = async () => {
    if (pendingSubmission) {
      try {
        setIsSubmitting(true);
        const result = await createDeathCertificate(pendingSubmission, true);

        if (result.success) {
          toast.success('Death Certificate Registration', {
            description: 'Death certificate has been registered successfully',
          });
          onOpenChange(false);
          form.reset();
        } else {
          toast.error('Registration Error', {
            description: result.error || 'Failed to register death certificate',
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.';
        toast.error('Registration Error', {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
        setShowAlert(false);
        setPendingSubmission(null);
      }
    }
  };

  const handleError = () => {
    const errors = form.formState.errors;

    if (errors.registryNumber) {
      toast.error(errors.registryNumber.message);
      return;
    }

    if (errors.personalInfo) {
      toast.error('Please check the personal information section for errors');
      return;
    }

    if (errors.familyInfo) {
      toast.error('Please check the family information section for errors');
      return;
    }

    // Default error message
    toast.error('Please check all required fields and try again');
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit, handleError)}
                      className='space-y-6'
                    >
                      {/* Registry Information */}
                      <RegistryInformationCard />

                      {/* Personal Information */}
                      <PersonalInformationCard />

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

                      {/* Informant Information */}
                      <CertificationInformantCard />

                      {/* Prepared By */}
                      <PreparedByCard />

                      {/* Received By */}
                      <ReceivedByCard />

                      {/* Registered at Civil Registrar */}
                      <RegisteredAtOfficeCard />

                      {/* Remarks */}
                      <RemarksCard />

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
                  </Form>

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
                  <DeathCertificatePDF data={form.watch()} />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
