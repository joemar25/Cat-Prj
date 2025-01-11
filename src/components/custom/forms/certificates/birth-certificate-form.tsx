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
import { ScrollArea } from '@/components/ui/scroll-area';
import { createBirthCertificate } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormProps,
  BirthCertificateFormValues,
  birthCertificateSchema,
  defaultBirthCertificateValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
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
import BirthCertificatePDF from './preview/birth-certificate/birth-certificate-pdf';

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
        onOpenChange(false);
        form.reset();
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

  const transformFormDataForPreview = (
    formData: Partial<BirthCertificateFormValues>
  ): Partial<BirthCertificateFormValues> => {
    if (!formData) return {};

    return {
      ...formData,
      // Transform childInfo - ensure required fields are present
      childInfo: formData.childInfo && {
        firstName: formData.childInfo.firstName,
        middleName: formData.childInfo.middleName,
        lastName: formData.childInfo.lastName,
        sex: formData.childInfo.sex,
        dateOfBirth: {
          day: formData.childInfo.dateOfBirth.day,
          month: formData.childInfo.dateOfBirth.month,
          year: formData.childInfo.dateOfBirth.year,
        },
        placeOfBirth: {
          hospital: formData.childInfo.placeOfBirth.hospital,
          cityMunicipality: formData.childInfo.placeOfBirth.cityMunicipality,
          province: formData.childInfo.placeOfBirth.province,
        },
        typeOfBirth: formData.childInfo.typeOfBirth,
        birthOrder: formData.childInfo.birthOrder,
        weight: formData.childInfo.weight,
        multipleBirth: formData.childInfo.multipleBirth,
      },

      // Transform motherInfo - ensure required fields are present
      motherInfo: formData.motherInfo && {
        firstName: formData.motherInfo.firstName,
        middleName: formData.motherInfo.middleName,
        lastName: formData.motherInfo.lastName,
        citizenship: formData.motherInfo.citizenship,
        religion: formData.motherInfo.religion,
        totalChildren: formData.motherInfo.totalChildren,
        livingChildren: formData.motherInfo.livingChildren,
        childrenDead: formData.motherInfo.childrenDead,
        occupation: formData.motherInfo.occupation,
        age: formData.motherInfo.age,
        residence: {
          address: formData.motherInfo.residence.address,
          cityMunicipality: formData.motherInfo.residence.cityMunicipality,
          province: formData.motherInfo.residence.province,
          country: formData.motherInfo.residence.country,
        },
      },

      // Transform fatherInfo - ensure required fields are present
      fatherInfo: formData.fatherInfo && {
        firstName: formData.fatherInfo.firstName,
        middleName: formData.fatherInfo.middleName,
        lastName: formData.fatherInfo.lastName,
        citizenship: formData.fatherInfo.citizenship,
        religion: formData.fatherInfo.religion,
        occupation: formData.fatherInfo.occupation,
        age: formData.fatherInfo.age,
        residence: {
          address: formData.fatherInfo.residence.address,
          cityMunicipality: formData.fatherInfo.residence.cityMunicipality,
          province: formData.fatherInfo.residence.province,
          country: formData.fatherInfo.residence.country,
        },
      },

      // Transform marriageOfParents - ensure required fields are present
      marriageOfParents: formData.marriageOfParents && {
        date: {
          day: formData.marriageOfParents.date.day,
          month: formData.marriageOfParents.date.month,
          year: formData.marriageOfParents.date.year,
        },
        place: {
          cityMunicipality: formData.marriageOfParents.place.cityMunicipality,
          province: formData.marriageOfParents.place.province,
          country: formData.marriageOfParents.place.country,
        },
      },

      // Transform attendant - ensure required fields are present
      attendant: formData.attendant && {
        type: formData.attendant.type,
        certification: {
          time: formData.attendant.certification.time,
          name: formData.attendant.certification.name,
          title: formData.attendant.certification.title,
          address: formData.attendant.certification.address,
          date: formData.attendant.certification.date,
          signature: formData.attendant.certification.signature,
        },
      },

      // Transform informant - ensure required fields are present
      informant: formData.informant && {
        name: formData.informant.name,
        relationship: formData.informant.relationship,
        address: formData.informant.address,
        date: formData.informant.date,
        signature: formData.informant.signature,
      },

      // Transform preparedBy - ensure required fields are present
      preparedBy: formData.preparedBy && {
        name: formData.preparedBy.name,
        title: formData.preparedBy.title,
        date: formData.preparedBy.date,
        signature: formData.preparedBy.signature,
      },

      // Transform receivedBy - ensure required fields are present
      receivedBy: formData.receivedBy && {
        name: formData.receivedBy.name,
        title: formData.receivedBy.title,
        date: formData.receivedBy.date,
        signature: formData.receivedBy.signature,
      },

      // Transform registeredBy - ensure required fields are present
      registeredBy: formData.registeredBy && {
        name: formData.registeredBy.name,
        title: formData.registeredBy.title,
        date: formData.registeredBy.date,
        signature: formData.registeredBy.signature,
      },
    };
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-6'
                    >
                      <RegistryInformationCard />
                      <ChildInformationCard />
                      <MotherInformationCard />
                      <FatherInformationCard />
                      <MarriageOfParentsCard />
                      <AttendantInformationCard />
                      <CertificationOfInformantCard />
                      <ReceivedByCard />
                      <RegisteredByCard />
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
                </div>
              </ScrollArea>
            </div>

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <BirthCertificatePDF
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
