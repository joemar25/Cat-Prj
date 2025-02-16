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
import { useDeathCertificateForm } from '@/hooks/form-certificates-hooks/useDeathCertificateForm';
import type { DeathCertificateFormProps } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { FormType } from '@prisma/client';
import { FormProvider } from 'react-hook-form';
import AttendantInformationCard from './form-cards/death-cards/attendant-information-card';
import CausesOfDeathCard from './form-cards/death-cards/causes-of-death';
import DeathByExternalCausesCard from './form-cards/death-cards/death-by-external-causes';
import DeceasedInformationCard from './form-cards/death-cards/deceased-information-card';
import MaternalConditionCard from './form-cards/death-cards/maternal-condition-card';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const { formMethods, onSubmit, handleError } = useDeathCertificateForm({
    onOpenChange,
  });

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
                      <RegistryInformationCard formType={FormType.DEATH} />
                      <DeceasedInformationCard />
                      <CausesOfDeathCard />
                      <MaternalConditionCard />
                      <DeathByExternalCausesCard />
                      <AttendantInformationCard />
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
                          Save
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
                {/* PDF Viewer or preview component can be added here */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
