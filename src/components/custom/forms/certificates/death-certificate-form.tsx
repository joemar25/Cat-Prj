'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import DatePickerField from '../../datepickerfield/date-picker-field';
import AgeAtTimeOfDeathCard from './form-cards/death-cards/age-at-time-of-death-card';
import AttendantInfoCard from './form-cards/death-cards/attendant-info-card';
import CertificationOfDeathCard from './form-cards/death-cards/certification-of-death-card';
import DateOfDeathAndBirthCard from './form-cards/death-cards/date-of-death-and-birth-card';
import ExternalCausesCard from './form-cards/death-cards/external-causes-card';
import FamilyInfoCard from './form-cards/death-cards/family-info-card';
import InfoCard from './form-cards/death-cards/info-card';
import InformantInfoCard from './form-cards/death-cards/informant-info-card';
import LocationInformationCard from './form-cards/death-cards/location-information-card';
import MaternalConditionCard from './form-cards/death-cards/maternal-condition-card';
import MedicalCertificateCard from './form-cards/death-cards/medical-certificate-card';
import PersonalInformationCard from './form-cards/death-cards/personal-information-card';
import ReceivedByCard from './form-cards/death-cards/received-by-card';
import RegisteredAtCivilRegistrarCard from './form-cards/death-cards/registered-at-civil-registrar-card';
import RemarksCard from './form-cards/death-cards/remarks-card';
import SexAndCivilStatusCard from './form-cards/death-cards/sex-and-civil-status-card';

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
        onOpenChange(false); // Close the dialog
        form.reset(); // Reset the form
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Republic of the Philippines
            <br />
            OFFICE OF THE CIVIL REGISTRAR GENERAL
            <br />
            CERTIFICATE OF DEATH
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <Card className='w-full max-w-4xl mx-auto'>
              <CardHeader>
                <CardTitle>Certificate of Death</CardTitle>
                <CardDescription>
                  Republic of the Philippines - Office of the Civil Registrar
                  General
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Registry Information */}

                {/* Location Information */}
                <LocationInformationCard />

                {/* Personal Information */}
                <PersonalInformationCard />

                {/* Sex and Civil Status */}
                <SexAndCivilStatusCard />

                {/* Date of Death and Date of Birth */}
                <DateOfDeathAndBirthCard />

                {/* Age at the Time of Death */}
                <AgeAtTimeOfDeathCard />

                {/* Place of Death */}
                <FormField
                  control={form.control}
                  name='placeOfDeath'
                  render={({ field }) => (
                    <FormItem className='pb-2'>
                      <FormLabel>Place of Death</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Religion, Citizenship, Residence, and Occupation */}
                <InfoCard />

                {/* Family Information */}
                <FamilyInfoCard />

                {/* Medical Certificate */}
                <MedicalCertificateCard />

                {/* Maternal Condition */}
                <MaternalConditionCard />

                {/* Death by External Causes */}
                <ExternalCausesCard />

                {/* Attendant Information */}
                <AttendantInfoCard />

                {/* Certification of Death */}
                <CertificationOfDeathCard />

                {/* Disposal Information */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>
                    Disposal Information
                  </h3>
                  <FormField
                    control={form.control}
                    name='disposal.method'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Method of Disposal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Burial, Cremation, etc.'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium'>
                        Burial/Cremation Permit
                      </h4>
                      <FormField
                        control={form.control}
                        name='disposal.burialPermit.number'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='disposal.burialPermit.dateIssued'
                        render={({ field }) => (
                          <FormItem>
                            <DatePickerField
                              field={field}
                              label='Date Issued'
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium'>Transfer Permit</h4>
                      <FormField
                        control={form.control}
                        name='disposal.transferPermit.number'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='disposal.transferPermit.dateIssued'
                        render={({ field }) => (
                          <FormItem>
                            <DatePickerField
                              field={field}
                              label='Date Issued'
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Cemetery Information */}
                <FormField
                  control={form.control}
                  name='cemeteryAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name and Address of Cemetery or Crematory
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Informant Information */}
                <InformantInfoCard />

                {/* Received By */}
                <ReceivedByCard />

                {/* Registered at Civil Registrar */}
                <RegisteredAtCivilRegistrarCard />

                {/* Remarks/Annotations */}
                <RemarksCard />

                {/* Submit Button */}
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-10'
                    onClick={onCancel}
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
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
