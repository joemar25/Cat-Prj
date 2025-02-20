'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBirthCertificateForm } from '@/hooks/form-certificates-hooks/useBirthCertificateForm';
import { FormProvider } from 'react-hook-form';
import {
  PreparedByCard,
  ReceivedByCard,
  RegisteredAtOfficeCard,
} from './form-cards/shared-components/processing-details-cards';

import { FormType } from '@prisma/client';
import DelayedRegistrationForm from './form-cards/birth-cards/affidavit-for-delayed-registration';
import AffidavitOfPaternityForm from './form-cards/birth-cards/affidavit-of-paternity';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageInformationCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';
import RemarksCard from './form-cards/shared-components/remarks-card';

interface BirthCertificateFormProps {
  open: boolean;
  onOpenChangeAction: () => Promise<void>;
  onCancelAction: () => Promise<void>;
}

export default function BirthCertificateForm({
  open,
  onOpenChangeAction,
  onCancelAction,
}: BirthCertificateFormProps) {
  const { formMethods, onSubmit, handleError } = useBirthCertificateForm({
    onOpenChange: onOpenChangeAction,
  });

  const handleFormSubmit = async (data: any) => {
    const result = await formMethods.trigger();

    if (result) {
      try {
        await onSubmit(data);
        formMethods.reset();
        toast.success('Form submitted successfully');
      } catch (error) {
        toast.error('Error submitting form');
        handleError(error);
      }
    } else {
      toast.warning('Please complete all required fields');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className='max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0'>
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleFormSubmit, handleError)}
            className='space-y-6'
          >
            <div className='h-full flex flex-col'>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold text-center py-4'>
                  Certificate of Live Birth
                </DialogTitle>
              </DialogHeader>

              <div className='flex flex-1 overflow-hidden'>
                <div className='w-full'>
                  <ScrollArea className='h-[calc(95vh-120px)]'>
                    <div className='p-6 space-y-4'>
                      <RegistryInformationCard formType={FormType.BIRTH} />
                      <ChildInformationCard />
                      <MotherInformationCard />
                      <FatherInformationCard />
                      <MarriageInformationCard />
                      <AttendantInformationCard />
                      <CertificationOfInformantCard />
                      <PreparedByCard />
                      <ReceivedByCard />
                      <RegisteredAtOfficeCard
                        fieldPrefix='registeredByOffice'
                        cardTitle='Registered at the Office of Civil Registrar'
                      />
                      <RemarksCard
                        fieldName='remarks'
                        cardTitle='Birth Certificate Remarks'
                        label='Additional Remarks'
                        placeholder='Enter any additional remarks or annotations'
                      />
                      <AffidavitOfPaternityForm />
                      <DelayedRegistrationForm />
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            <DialogFooter className='absolute bottom-2 right-2 gap-2 flex items-center'>
              <Button
                type='button'
                variant='outline'
                className='py-2 w-32 bg-muted-foreground/80 hover:bg-muted-foreground hover:text-accent text-accent'
                onClick={onCancelAction}
              >
                Cancel
              </Button>
              <Button type='submit' variant='default' className='py-2 w-32'>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
