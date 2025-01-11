'use client';

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
  defaultDeathCertificateValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Import our new card components
import { PDFViewer } from '@react-pdf/renderer';
import AttendantInformationCard from './form-cards/death-cards/attendant-information-card';
import CertificationOfDeathCard from './form-cards/death-cards/certification-of-death-card';
import DisposalInformationCard from './form-cards/death-cards/disposal-information-card';
import FamilyInformationCard from './form-cards/death-cards/family-information-card';
import InformantInformationCard from './form-cards/death-cards/informant-information-card';
import MedicalCertificateCard from './form-cards/death-cards/medical-certificate-card';
import PersonalInformationCard from './form-cards/death-cards/personal-information-card';
import RegistryInformationCard from './form-cards/death-cards/regsitry-information-card';
import RemarksCard from './form-cards/death-cards/remarks-card';
import DeathCertificatePDF from './preview/death-certificate/death-certificate-preview';

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateSchema),
    defaultValues: defaultDeathCertificateValues,
  });

  async function onSubmit(data: DeathCertificateFormValues) {
    try {
      setIsSubmitting(true);
      const result = await createDeathCertificate(data);

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
    }
  }

  // Add this function in your DeathCertificateForm component
  const transformFormDataForPreview = (
    data: Partial<DeathCertificateFormValues> | null
  ): Partial<DeathCertificateFormValues> => {
    if (!data) return {};

    return {
      // Registry Information
      registryNumber: data.registryNumber,
      province: data.province,
      cityMunicipality: data.cityMunicipality,

      // Personal Information
      name: data.name,
      sex: data.sex,
      civilStatus: data.civilStatus,
      dateOfDeath: data.dateOfDeath,
      dateOfBirth: data.dateOfBirth,
      ageAtDeath: data.ageAtDeath,
      placeOfDeath: data.placeOfDeath,
      religion: data.religion,
      citizenship: data.citizenship,
      residence: data.residence,
      occupation: data.occupation,

      // Family Information
      fatherName: data.fatherName,
      motherMaidenName: data.motherMaidenName,

      // Medical Certificate
      causesOfDeath: data.causesOfDeath,
      maternalCondition: data.maternalCondition,
      deathByExternalCauses: data.deathByExternalCauses,

      // Attendant Information
      attendant: data.attendant,

      // Certification
      certification: data.certification,

      // Disposal Information
      disposal: data.disposal,
      cemeteryAddress: data.cemeteryAddress,

      // Informant
      informant: data.informant,

      // Civil Registry
      receivedBy: data.receivedBy,
      registeredAtCivilRegistrar: data.registeredAtCivilRegistrar,

      // Remarks
      remarks: data.remarks,
    };
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
            <div className='w-1/2 border-r'>
              <div className='h-[calc(95vh-120px)] overflow-y-auto p-6'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    {/* Registry Information - Basic details about the certificate registration */}
                    <RegistryInformationCard />

                    {/* Personal Information - Deceased person's basic details */}
                    <PersonalInformationCard />

                    {/* Family Information - Parents' details */}
                    <FamilyInformationCard />

                    {/* Medical Certificate Section - Cause of death and related medical info */}
                    <MedicalCertificateCard />

                    {/* Attendant Information - Medical professional or attendant details */}
                    <AttendantInformationCard />

                    {/* Certification of Death - Official death certification details */}
                    <CertificationOfDeathCard />

                    {/* Disposal Information - Burial/cremation details and permits */}
                    <DisposalInformationCard />

                    {/* Informant Information - Details of the person reporting the death */}
                    <InformantInformationCard />

                    {/* Remarks - Additional notes or annotations */}
                    <RemarksCard />

                    {/* Form Actions */}
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
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <DeathCertificatePDF
                    data={transformFormDataForPreview(form.watch())}
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
