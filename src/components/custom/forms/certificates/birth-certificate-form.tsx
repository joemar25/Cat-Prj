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
import { createBirthCertificate } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormProps,
  BirthCertificateFormValues,
  createBirthCertificateSchema,
  defaultBirthCertificateFormValues,
} from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormType } from '@prisma/client';

import AffidavitFormsCard from './form-cards/birth-cards/affidavit-form-card';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageOfParentsCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';

import PreparedByCard from './form-cards/shared-components/prepared-by-card';
import ReceivedByCard from './form-cards/shared-components/received-by-card';
import RegisteredAtOfficeCard from './form-cards/shared-components/registered-at-office-card';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';
import RemarksCard from './form-cards/shared-components/remarks-card';
import BirthCertificatePDF from './preview/birth-certificate/birth-certificate-pdf';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  // Manage NCR mode states for various sections
  const [registryNCRMode, setRegistryNCRMode] = useState(false);
  const [childNCRMode, setChildNCRMode] = useState(false);

  // New state for each address property using addressSchema
  const [motherResidenceNcrMode, setMotherResidenceNcrMode] = useState(false);
  const [fatherResidenceNcrMode, setFatherResidenceNcrMode] = useState(false);
  const [parentMarriagePlaceNcrMode, setParentMarriagePlaceNcrMode] =
    useState(false);
  const [attendantAddressNcrMode, setAttendantAddressNcrMode] = useState(false);
  const [informantAddressNcrMode, setInformantAddressNcrMode] = useState(false);
  const [adminOfficerAddressNcrMode, setAdminOfficerAddressNcrMode] =
    useState(false);
  const [affiantAddressNcrMode, setAffiantAddressNcrMode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<BirthCertificateFormValues | null>(null);

  // Pass all new booleans to the schema creator
  const schema = createBirthCertificateSchema(
    registryNCRMode,
    childNCRMode,
    motherResidenceNcrMode,
    fatherResidenceNcrMode,
    parentMarriagePlaceNcrMode,
    attendantAddressNcrMode,
    informantAddressNcrMode,
    adminOfficerAddressNcrMode,
    affiantAddressNcrMode
  );

  const formMethods = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultBirthCertificateFormValues,
  });

  // Reset the form if any of the mode flags change.
  useEffect(() => {
    formMethods.reset(defaultBirthCertificateFormValues);
  }, [
    registryNCRMode,
    childNCRMode,
    motherResidenceNcrMode,
    fatherResidenceNcrMode,
    parentMarriagePlaceNcrMode,
    attendantAddressNcrMode,
    informantAddressNcrMode,
    adminOfficerAddressNcrMode,
    affiantAddressNcrMode,
  ]);

  const onSubmit = async (values: BirthCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createBirthCertificate(values);

      if (result.success) {
        toast.success('Birth Certificate Registration', {
          description: 'Birth certificate has been registered successfully',
        });
        onOpenChange(false);
        formMethods.reset();
      } else if (result.warning) {
        setPendingSubmission(values);
        setShowAlert(true);
      } else {
        toast.error('Registration Error', {
          description: result.error || 'Failed to register birth certificate',
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
        const result = await createBirthCertificate(pendingSubmission, true);

        if (result.success) {
          toast.success('Birth Certificate Registration', {
            description: 'Birth certificate has been registered successfully',
          });
          onOpenChange(false);
          formMethods.reset();
        } else {
          toast.error('Registration Error', {
            description: result.error || 'Failed to register birth certificate',
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
    const errors = formMethods.formState.errors;

    formMethods
      .trigger(['registryNumber', 'province', 'cityMunicipality'])
      .then(() => {
        if (
          formMethods.getFieldState('registryNumber').error ||
          formMethods.getFieldState('province').error ||
          formMethods.getFieldState('cityMunicipality').error
        ) {
          toast.error('Birth Registry Information', {
            description:
              'Please complete registry number, province, and city/municipality fields',
          });
          return;
        }

        if (errors.childInfo) {
          toast.error(
            "Please check the child's information section for errors"
          );
          return;
        }
        if (errors.motherInfo) {
          toast.error(
            "Please check the mother's information section for errors"
          );
          return;
        }
        if (errors.fatherInfo) {
          toast.error(
            "Please check the father's information section for errors"
          );
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
                      <RegistryInformationCard
                        formType={FormType.BIRTH}
                        title='Birth Registry Information'
                        isNCRMode={registryNCRMode}
                        setIsNCRMode={setRegistryNCRMode}
                      />
                      <ChildInformationCard
                        isNCRMode={childNCRMode}
                        setIsNCRMode={setChildNCRMode}
                      />

                      {/* Pass the new state props to the components that need them */}
                      <MotherInformationCard
                        motherResidenceNcrMode={motherResidenceNcrMode}
                        setMotherResidenceNcrMode={setMotherResidenceNcrMode}
                      />
                      <FatherInformationCard
                        fatherResidenceNcrMode={fatherResidenceNcrMode}
                        setFatherResidenceNcrMode={setFatherResidenceNcrMode}
                      />
                      <MarriageOfParentsCard
                        parentMarriagePlaceNcrMode={parentMarriagePlaceNcrMode}
                        setParentMarriagePlaceNcrMode={
                          setParentMarriagePlaceNcrMode
                        }
                      />
                      <AttendantInformationCard
                        attendantAddressNcrMode={attendantAddressNcrMode}
                        setAttendantAddressNcrMode={setAttendantAddressNcrMode}
                      />
                      <CertificationOfInformantCard
                        informantAddressNcrMode={informantAddressNcrMode}
                        setInformantAddressNcrMode={setInformantAddressNcrMode}
                      />
                      <PreparedByCard<BirthCertificateFormValues>
                        fieldPrefix='preparedBy'
                        cardTitle='Prepared By'
                      />
                      <ReceivedByCard<BirthCertificateFormValues>
                        fieldPrefix='receivedBy'
                        cardTitle='Received By'
                      />

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

                      <AffidavitFormsCard
                        adminOfficerAddressNcrMode={adminOfficerAddressNcrMode}
                        setAdminOfficerAddressNcrMode={
                          setAdminOfficerAddressNcrMode
                        }
                        affiantAddressNcrMode={affiantAddressNcrMode}
                        setAffiantAddressNcrMode={setAffiantAddressNcrMode}
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
                    formType='BIRTH'
                    title='Duplicate Record Detected'
                    description='A similar birth record already exists. Do you want to proceed with saving this record?'
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
                  <BirthCertificatePDF data={formMethods.watch()} />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
