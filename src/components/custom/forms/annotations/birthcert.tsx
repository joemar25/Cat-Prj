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
import { createBirthAnnotation } from '@/hooks/form-annotations-actions';
import {
  BirthAnnotationFormProps,
  BirthAnnotationFormValues,
  birthAnnotationSchema,
} from '@/lib/types/zod-form-annotations/formSchemaAnnotation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const BirthAnnotationForm: React.FC<BirthAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCanceling = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BirthAnnotationFormValues>({
    resolver: zodResolver(birthAnnotationSchema),
    defaultValues: {
      pageNumber: '123',
      bookNumber: '45',
      registryNumber: 'REG-2025-001',
      dateOfRegistration: new Date('2025-01-01'),
      childFirstName: 'John',
      childMiddleName: 'Michael',
      childLastName: 'Doe',
      sex: 'Male',
      dateOfBirth: new Date('2020-06-15'),
      placeOfBirth: 'City Hospital, Manila',
      motherName: 'Jane Smith',
      fatherName: 'Robert Doe',
      motherCitizenship: 'Filipino',
      fatherCitizenship: 'Filipino',
      parentsMarriageDate: new Date('2015-05-20'),
      parentsMarriagePlace: 'St. Peter Church, Cebu City',
      remarks: 'N/A',
      preparedBy: 'Clerk Juan',
      preparedByPosition: 'Clerk II',
      verifiedBy: 'Verifier Ana',
      verifiedByPosition: 'Registrar I',
    },
  });

  const onSubmit = async (data: BirthAnnotationFormValues) => {
    if (isCanceling.current) {
      isCanceling.current = false; // Reset cancel state
      return;
    }

    try {
      const response = await createBirthAnnotation(data);
      if (response.success) {
        toast.success('Birth annotation created successfully');
        onOpenChange(false);
        reset();
      } else {
        toast.error('Failed to create birth annotation');
      }
    } catch (error) {
      console.error('Error creating birth annotation:', error);
      toast.error('An error occurred while creating the annotation');
    }
  };

  const handleCancel = () => {
    isCanceling.current = true;
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Birth Annotation Form
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='container mx-auto p-4'>
            <Card className='w-full max-w-3xl mx-auto bg-background text-foreground border dark:border-border'>
              <CardContent className='p-6 space-y-6'>
                <div className='relative'>
                  <h2 className='text-lg font-medium'>
                    TO WHOM IT MAY CONCERN:
                  </h2>
                  <p className='absolute top-0 right-0'>{currentDate}</p>
                  <p className='mt-2'>
                    We certify that, among others, the following facts of birth
                    appear in our Register of Birth on
                  </p>
                  <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div className='space-y-1'>
                      <Label>Page number</Label>
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

                <div className='space-y-4'>
                  {[
                    {
                      label: 'Registry Number',
                      name: 'registryNumber',
                      type: 'text',
                    },
                    {
                      label: 'Date of Registration',
                      name: 'dateOfRegistration',
                      type: 'date',
                    },
                    {
                      label: 'Name of Child',
                      name: 'childFirstName',
                      type: 'text',
                    },
                    {
                      label: 'Sex',
                      name: 'sex',
                      type: 'text',
                    },
                    {
                      label: 'Date of Birth',
                      name: 'dateOfBirth',
                      type: 'date',
                    },
                    {
                      label: 'Place of Birth',
                      name: 'placeOfBirth',
                      type: 'text',
                    },
                    {
                      label: 'Name of Mother',
                      name: 'motherName',
                      type: 'text',
                    },
                    {
                      label: "Mother's Citizenship",
                      name: 'motherCitizenship',
                      type: 'text',
                    },
                    {
                      label: 'Name of Father',
                      name: 'fatherName',
                      type: 'text',
                    },
                    {
                      label: "Father's Citizenship",
                      name: 'fatherCitizenship',
                      type: 'text',
                    },
                    {
                      label: 'Date of Marriage Parents',
                      name: 'parentsMarriageDate',
                      type: 'date',
                    },
                    {
                      label: 'Place of Marriage of Parents',
                      name: 'parentsMarriagePlace',
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
                          field.name as keyof BirthAnnotationFormValues
                        )}
                      />
                      {errors[field.name as keyof typeof errors] && (
                        <span className='text-red-500'>
                          {errors[field.name as keyof typeof errors]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className='space-y-2 pt-4'>
                  <Label>Remarks</Label>
                  <textarea
                    {...register('remarks')}
                    className='w-full p-2 border rounded mt-2 h-24'
                  />
                </div>

                <div className='grid grid-cols-2 gap-8 pt-8'>
                  <div className='space-y-8'>
                    <div className='space-y-4'>
                      <p className='font-medium'>Prepared By</p>
                      <Input
                        className='text-center'
                        placeholder='Name and Signature'
                        {...register('preparedBy')}
                      />
                      <Input
                        className='text-center'
                        placeholder='Position'
                        {...register('preparedByPosition')}
                      />
                    </div>
                    <div className='space-y-4'>
                      <p className='font-medium'>Verified By</p>
                      <Input
                        className='text-center'
                        placeholder='Name and Signature'
                        {...register('verifiedBy')}
                      />
                      <Input
                        className='text-center'
                        placeholder='Position'
                        {...register('verifiedByPosition')}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col items-center justify-end'>
                    <p className='font-medium text-center'>
                      PRISCILLA L. GALICIA
                    </p>
                    <p className='text-sm text-center'>
                      OIC - City Civil Registrar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleCancel}
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

export default BirthAnnotationForm;
