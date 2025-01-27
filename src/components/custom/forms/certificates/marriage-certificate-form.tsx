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
import { createMarriageCertificate } from '@/hooks/form-certificate-actions';
import {
  defaultMarriageCertificateValues,
  MarriageCertificateFormProps,
  MarriageCertificateFormValues,
  marriageCertificateSchema,
} from '@/lib/types/zod-form-certificate/form-schema-certificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import ContractingPartiesCertificationCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/contracting-parties-certification-card';
import HusbandInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/husband-info-card';
import HusbandParentsInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/husband-parent-info-card';
import MarriageDetailsCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/marriage-details-card';
import ReceivedByCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/received-by-card';
import RegisteredAtOfficeCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/registered-at-office-card';
import RegistryInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/registry-info-card';
import RemarksCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/remarks-card';
import SolemnizingOfficerCertification from '@/components/custom/forms/certificates/form-cards/marriage-cards/solemnizing-officer-certification-card';
import WifeInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/wife-info-card';
import WifeParentsInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/wife-parent-info-card';
import WitnessesCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/witnesses-section-card';
import MarriageCertificatePDF from '@/components/custom/forms/certificates/preview/marriage-certificate/marriage-certificate-pdf';

export function MarriageCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: MarriageCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<MarriageCertificateFormValues | null>(null);

  const form = useForm<MarriageCertificateFormValues>({
    resolver: zodResolver(marriageCertificateSchema),
    defaultValues: defaultMarriageCertificateValues,
  });

  const onSubmit = async (values: MarriageCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createMarriageCertificate(values);

      if (result.success) {
        toast.success('Marriage Certificate Registration', {
          description: 'Marriage certificate has been registered successfully',
        });
        onOpenChange(false);
        form.reset();
      } else if (result.warning) {
        setPendingSubmission(values);
        setShowAlert(true);
      } else {
        toast.error('Registration Error', {
          description:
            result.error || 'Failed to register marriage certificate',
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
        const result = await createMarriageCertificate(pendingSubmission);

        if (result.success) {
          toast.success('Marriage Certificate Registration', {
            description:
              'Marriage certificate has been registered successfully',
          });
          onOpenChange(false);
          form.reset();
        } else {
          toast.error('Registration Error', {
            description:
              result.error || 'Failed to register marriage certificate',
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

    if (errors.husbandInfo) {
      toast.error("Please check the husband's information section for errors");
      return;
    }

    if (errors.wifeInfo) {
      toast.error("Please check the wife's information section for errors");
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
              Certificate of Marriage
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
                      <RegistryInfoCard />
                      <HusbandInfoCard />
                      <WifeInfoCard />
                      <HusbandParentsInfoCard />
                      <WifeParentsInfoCard />
                      <MarriageDetailsCard />
                      <ContractingPartiesCertificationCard />
                      <SolemnizingOfficerCertification />
                      <WitnessesCard />
                      <ReceivedByCard />
                      <RegisteredAtOfficeCard />
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
                    formType='MARRIAGE'
                    title='Duplicate Record Detected'
                    description='A similar marriage record already exists. Do you want to proceed with saving this record?'
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
                  <MarriageCertificatePDF
                    data={form.watch()} // Pass the current form data directly to the PDF preview
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

export default MarriageCertificateForm;
