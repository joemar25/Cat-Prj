'use client';

import {
  ConfirmationDialog,
  shouldSkipAlert,
} from '@/components/custom/confirmation-dialog/confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
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
        toast.success('Death certificate has been registered successfully');
        onOpenChange(false);
        form.reset();
      } else if (result.warning) {
        setPendingSubmission(values);
        setShowAlert(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register death certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (values: DeathCertificateFormValues) => {
    if (shouldSkipAlert('skipDeathCertificateAlert')) {
      onSubmit(values);
    } else {
      setPendingSubmission(values);
      setShowAlert(true);
    }
  };

  const confirmSubmit = async () => {
    if (pendingSubmission) {
      try {
        setIsSubmitting(true);
        const result = await createDeathCertificate(pendingSubmission, true);

        if (result.success) {
          toast.success('Death certificate has been registered successfully');
          onOpenChange(false);
          form.reset();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Failed to register death certificate. Please try again.');
      } finally {
        setIsSubmitting(false);
        setShowAlert(false);
        setPendingSubmission(null);
      }
    }
  };

  const transformFormDataForPreview = (
    data: Partial<DeathCertificateFormValues> | null
  ): Partial<DeathCertificateFormValues> => {
    if (!data) return {};

    return {
      // Registry Information
      registryNumber: data.registryNumber,
      province: data.province,
      cityMunicipality: data.cityMunicipality,

      // Death Information
      timeOfDeath: data.timeOfDeath,

      // Personal Information
      personalInfo: data.personalInfo,

      // Family Information
      familyInfo: data.familyInfo,

      // Medical Certificate
      medicalCertificate: data.medicalCertificate,

      // Attendant Information
      attendant: data.attendant,

      // Certification
      certification: data.certification,

      // Disposal Information
      disposal: data.disposal,

      // Informant Details
      informant: data.informant,

      // Administrative Information
      preparedBy: data.preparedBy,
      receivedBy: data.receivedBy,

      // Registered at Civil Registrar
      registeredAtCivilRegistrar: data.registeredAtCivilRegistrar,

      // Remarks
      remarks: data.remarks,
    };
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
    toast.warning('Please fill in all required fields', {
      description: 'Some required information is missing or incorrect.',
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
              <div className='h-[calc(95vh-120px)] overflow-y-auto p-6'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit, handleError)}
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
                  localStorageKey='skipDeathCertificateAlert'
                />
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <DeathCertificatePDF
                    data={transformFormDataForPreview(form.watch()) || {}}
                  />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
