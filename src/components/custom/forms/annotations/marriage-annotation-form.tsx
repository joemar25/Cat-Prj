'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMarriageAnnotation } from '@/hooks/form-annotations-actions';
import {
  MarriageAnnotationFormValues,
  marriageAnnotationSchema,
} from '@/lib/types/zod-form-annotations/formSchemaAnnotation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface MarriageAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

const MarriageAnnotationForm: React.FC<MarriageAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarriageAnnotationFormValues>({
    resolver: zodResolver(marriageAnnotationSchema),
    defaultValues: {
      pageNumber: '12',
      bookNumber: '3',
      registryNumber: 'REG-2025-001',
      dateOfRegistration: new Date('2025-01-01'),
      husbandName: 'John Doe',
      wifeName: 'Jane Smith',
      husbandDateOfBirthAge: '1980-06-15 / 45',
      wifeDateOfBirthAge: '1985-09-10 / 40',
      husbandCitizenship: 'Filipino',
      wifeCitizenship: 'Filipino',
      husbandCivilStatus: 'Single',
      wifeCivilStatus: 'Single',
      husbandMother: 'Maria Doe',
      wifeMother: 'Anna Smith',
      husbandFather: 'Joseph Doe',
      wifeFather: 'Robert Smith',
      dateOfMarriage: new Date('2025-01-10'),
      placeOfMarriage: 'City Hall, Manila',
      issuedTo: 'John and Jane',
      purpose: 'Legal requirement',
      preparedByName: 'Clerk Juan',
      preparedByPosition: 'Clerk II',
      verifiedByName: 'Verifier Ana',
      verifiedByPosition: 'Verifier I',
      civilRegistrar: 'Priscilla Galicia',
      civilRegistrarPosition: 'OIC - City Civil Registrar',
      amountPaid: 500.0,
      orNumber: 'OR-2025-001',
      datePaid: new Date('2025-01-05'),
    },
  });

  const onSubmit = async (data: MarriageAnnotationFormValues) => {
    try {
      const response = await createMarriageAnnotation(data);
      if (response.success) {
        toast.success('Marriage annotation created successfully');
        onOpenChange(false);
        reset();
      } else {
        toast.error('Failed to create marriage annotation');
      }
    } catch (error) {
      console.error('Error creating marriage annotation:', error);
      toast.error('An error occurred while creating the annotation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Marriage Annotation Form (Form 3A)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='container mx-auto p-4'>
            <Card className='w-full max-w-3xl mx-auto bg-background text-foreground border dark:border-border'>
              <CardContent className='p-6 space-y-6'>
                {/* Header */}
                <div className='space-y-2'>
                  <h2 className='text-lg font-medium'>
                    TO WHOM IT MAY CONCERN:
                  </h2>
                  <p>
                    We certify that, among others, the following marriage
                    appears in our Register of Marriages:
                  </p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <Label>On page</Label>
                      <Input {...register('pageNumber')} />
                      {errors.pageNumber && (
                        <span className='text-red-500'>
                          {errors.pageNumber.message}
                        </span>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <Label>Book number</Label>
                      <Input {...register('bookNumber')} />
                      {errors.bookNumber && (
                        <span className='text-red-500'>
                          {errors.bookNumber.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <h3 className='font-medium text-center'>HUSBAND</h3>
                    <h3 className='font-medium text-center'>WIFE</h3>
                  </div>
                  {[
                    {
                      label: 'Name',
                      name: ['husbandName', 'wifeName'] as const,
                    },
                    {
                      label: 'Date of Birth/Age',
                      name: [
                        'husbandDateOfBirthAge',
                        'wifeDateOfBirthAge',
                      ] as const,
                    },
                    {
                      label: 'Citizenship',
                      name: ['husbandCitizenship', 'wifeCitizenship'] as const,
                    },
                    {
                      label: 'Civil Status',
                      name: ['husbandCivilStatus', 'wifeCivilStatus'] as const,
                    },
                    {
                      label: 'Mother',
                      name: ['husbandMother', 'wifeMother'] as const,
                    },
                    {
                      label: 'Father',
                      name: ['husbandFather', 'wifeFather'] as const,
                    },
                  ].map((field, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-[150px_1fr_1fr] gap-4 items-center'
                    >
                      <Label className='font-medium'>{field.label}</Label>
                      <Input {...register(field.name[0])} />
                      {errors[field.name[0]] && (
                        <span className='text-red-500'>
                          {errors[field.name[0]]?.message}
                        </span>
                      )}
                      <Input {...register(field.name[1])} />
                      {errors[field.name[1]] && (
                        <span className='text-red-500'>
                          {errors[field.name[1]]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Single Column Fields */}
                  {[
                    {
                      label: 'Registry number',
                      name: 'registryNumber',
                      type: 'text',
                    },
                    {
                      label: 'Date of registration',
                      name: 'dateOfRegistration',
                      type: 'date',
                    },
                    {
                      label: 'Date of marriage',
                      name: 'dateOfMarriage',
                      type: 'date',
                    },
                    {
                      label: 'Place of marriage',
                      name: 'placeOfMarriage',
                      type: 'text',
                    },
                  ].map((field, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-[150px_1fr] gap-4 items-center'
                    >
                      <Label className='font-medium'>{field.label}</Label>
                      <Input
                        type={field.type}
                        {...register(
                          field.name as keyof MarriageAnnotationFormValues
                        )}
                      />
                      {errors[
                        field.name as keyof MarriageAnnotationFormValues
                      ] && (
                        <span className='text-red-500'>
                          {
                            errors[
                              field.name as keyof MarriageAnnotationFormValues
                            ]?.message
                          }
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarriageAnnotationForm;
