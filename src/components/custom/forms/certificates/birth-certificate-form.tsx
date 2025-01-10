'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { createBirthCertificate } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormProps,
  BirthCertificateFormValues,
  birthCertificateSchema,
  defaultBirthCertificateValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageOfParentsCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';
import ReceivedByCard from './form-cards/birth-cards/received-by';
import RegisteredByCard from './form-cards/birth-cards/registered-by';
import RegistryInformationCard from './form-cards/birth-cards/registry-information-card';
import RemarksCard from './form-cards/birth-cards/remarks';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateSchema),
    defaultValues: defaultBirthCertificateValues,
  });

  const onSubmit = async (values: BirthCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createBirthCertificate(values);

      if (result.success) {
        toast.success('Birth certificate has been registered successfully');
        onOpenChange(false); // Close the dialog
        form.reset(); // Reset the form
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register birth certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Republic of the Philippines
            <br />
            OFFICE OF THE CIVIL REGISTRAR GENERAL
            <br />
            CERTIFICATE OF LIVE BIRTH
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <Card>
              <CardContent className='space-y-6'>
                {/* Registry Information */}
                <RegistryInformationCard />
                {/* Child Information */}
                <ChildInformationCard />

                {/* Mother Information */}
                <MotherInformationCard />
                {/* Father Information */}
                <FatherInformationCard />
                {/* Marriage of Parents */}
                <MarriageOfParentsCard />
                {/* Attendant Information */}
                <AttendantInformationCard />
                {/* Certification of Informant */}
                <CertificationOfInformantCard />
                {/* Received By */}
                <ReceivedByCard />
                {/* Registered By */}
                <RegisteredByCard />
                {/* Remarks */}
                <RemarksCard />
                <div className='flex justify-end space-x-4'>
                  <Button type='button' variant='outline' onClick={onCancel}>
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
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
