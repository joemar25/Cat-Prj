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
import { createDeathAnnotation } from '@/hooks/form-annotations-actions';
import { DeathAnnotationFormFields } from '@/lib/constants/form-annotations-dynamic-fields';
import {
  DeathAnnotationFormValues,
  deathAnnotationSchema,
  ExtendedDeathAnnotationFormProps,
} from '@/lib/types/zod-form-annotations/death-annotation-form-schema';
import { PlaceStructure } from '@/lib/types/zod-form-annotations/form-annotation-shared-interfaces';

import { formatDateTime } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const DeathAnnotationForm: React.FC<ExtendedDeathAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
  row,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DeathAnnotationFormValues>({
    resolver: zodResolver(deathAnnotationSchema),
  });

  useEffect(() => {
    if (row?.original) {
      // Basic form information
      setValue('pageNumber', row.original.pageNumber);
      setValue('bookNumber', row.original.bookNumber);
      setValue('registryNumber', row.original.registryNumber);
      setValue(
        'dateOfRegistration',
        row.original.dateOfRegistration
          ? new Date(row.original.dateOfRegistration)
          : new Date()
      );

      const deathForm = row.original.deathCertificateForm;
      if (deathForm) {
        // Handle deceased name
        const deceasedName = deathForm.deceasedName;
        if (deceasedName && typeof deceasedName === 'object') {
          const nameObj = deceasedName as {
            first?: string;
            middle?: string;
            last?: string;
          };

          const fullName = [
            nameObj.first || '',
            nameObj.middle || '',
            nameObj.last || '',
          ]
            .filter(Boolean)
            .join(' ');

          setValue('nameOfDeceased', fullName);
        }

        // Basic details
        setValue('sex', deathForm.sex || '');
        setValue('civilStatus', deathForm.civilStatus || '');
        setValue('citizenship', deathForm.citizenship || '');

        // Handle dates
        if (deathForm.dateOfDeath) {
          setValue('dateOfDeath', new Date(deathForm.dateOfDeath));
        }

        if (deathForm.dateOfBirth && deathForm.dateOfDeath) {
          const birthDate = new Date(deathForm.dateOfBirth);
          const deathDate = new Date(deathForm.dateOfDeath);
          const age = Math.floor(
            (deathDate.getTime() - birthDate.getTime()) /
              (1000 * 60 * 60 * 24 * 365.25)
          );
          setValue('age', age);
        }

        // Handle place of death
        if (
          typeof deathForm.placeOfDeath === 'object' &&
          deathForm.placeOfDeath
        ) {
          const place = deathForm.placeOfDeath as PlaceStructure;
          const placeOfDeath = [
            place.hospital,
            place.barangay,
            place.cityMunicipality,
            place.province,
          ]
            .filter(Boolean)
            .join(', ');
          setValue('placeOfDeath', placeOfDeath);
        }

        // Handle cause of death

        if (
          deathForm.causesOfDeath &&
          typeof deathForm.causesOfDeath === 'object' &&
          deathForm.causesOfDeath !== null &&
          'immediate' in deathForm.causesOfDeath
        ) {
          const immediate = deathForm.causesOfDeath.immediate;
          setValue('causeOfDeath', immediate ? String(immediate) : '');
        }
      }

      // Officials information
      if (row.original.preparedBy) {
        setValue('preparedByName', row.original.preparedBy.name || '');
      }
      setValue('preparedByPosition', row.original.receivedByPosition || '');

      if (row.original.verifiedBy) {
        setValue('verifiedByName', row.original.verifiedBy.name || '');
      }
      setValue('verifiedByPosition', row.original.registeredByPosition || '');

      // Fixed values
      setValue('civilRegistrar', 'PRISCILLA L. GALICIA');
      setValue('civilRegistrarPosition', 'OIC - City Civil Registrar');
    }
  }, [row, setValue]);

  const onSubmit = async (data: DeathAnnotationFormValues) => {
    try {
      const response = await createDeathAnnotation(data);
      if (response.success) {
        toast.success('Death annotation created successfully');
        onOpenChange(false);
        reset();
      } else {
        toast.error('Failed to create death annotation');
      }
    } catch (error) {
      console.error('Error creating death annotation:', error);
      toast.error('An error occurred while creating the death annotation');
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Death Annotation Form
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='container mx-auto p-4'>
            <Card className='w-full max-w-3xl mx-auto bg-background text-foreground border dark:border-border'>
              <CardContent className='p-6 space-y-6'>
                {/* Header */}
                <div className='relative'>
                  <h2 className='text-lg font-medium'>
                    TO WHOM IT MAY CONCERN:
                  </h2>
                  <p className='absolute top-0 right-0'>
                    {formatDateTime(new Date())}
                  </p>
                  <p className='mt-2'>
                    We certify that, among others, the following facts of death
                    appear in our Register of Death on
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
                      <Label>of Book number</Label>
                      <Input {...register('bookNumber')} />
                      {errors.bookNumber && (
                        <span className='text-red-500'>
                          {errors.bookNumber.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Form Fields */}
                <div className='space-y-4'>
                  {DeathAnnotationFormFields.map((field, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-[150px_1fr] gap-4 items-center'
                    >
                      <Label className='font-medium'>{field.label}</Label>
                      <Input
                        {...register(
                          field.name as keyof DeathAnnotationFormValues
                        )}
                        type={field.type}
                      />
                      {errors[field.name as keyof typeof errors] && (
                        <span className='text-red-500'>
                          {errors[field.name as keyof typeof errors]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Certification Section */}
                <div className='space-y-4 pt-4'>
                  <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                    <p>This certification is issued to</p>
                    <Input {...register('issuedTo')} />
                    {errors.issuedTo && (
                      <span className='text-red-500'>
                        {errors.issuedTo.message}
                      </span>
                    )}
                  </div>
                  <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                    <p>upon his/her request for</p>
                    <Input {...register('purpose')} />
                    {errors.purpose && (
                      <span className='text-red-500'>
                        {errors.purpose.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Signature Section */}
                <div className='grid grid-cols-2 gap-8 pt-8'>
                  <div className='space-y-8'>
                    <div className='space-y-4'>
                      <p className='font-medium'>Prepared By</p>
                      <div className='space-y-1'>
                        <Input
                          className='text-center'
                          placeholder='Name and Signature'
                          {...register('preparedByName')}
                        />
                        {errors.preparedByName && (
                          <span className='text-red-500'>
                            {errors.preparedByName.message}
                          </span>
                        )}
                        <Input
                          className='text-center'
                          placeholder='Position'
                          {...register('preparedByPosition')}
                        />
                        {errors.preparedByPosition && (
                          <span className='text-red-500'>
                            {errors.preparedByPosition.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <p className='font-medium'>Verified By</p>
                      <div className='space-y-1'>
                        <Input
                          className='text-center'
                          placeholder='Name and Signature'
                          {...register('verifiedByName')}
                        />
                        {errors.verifiedByName && (
                          <span className='text-red-500'>
                            {errors.verifiedByName.message}
                          </span>
                        )}
                        <Input
                          className='text-center'
                          placeholder='Position'
                          {...register('verifiedByPosition')}
                        />
                        {errors.verifiedByPosition && (
                          <span className='text-red-500'>
                            {errors.verifiedByPosition.message}
                          </span>
                        )}
                      </div>
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

                {/* Payment Section */}
                <div className='space-y-2 pt-4'>
                  <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Amount Paid</Label>
                    <Input
                      type='number'
                      step='0.01'
                      {...register('amountPaid', { valueAsNumber: true })}
                    />
                    {errors.amountPaid && (
                      <span className='text-red-500'>
                        {errors.amountPaid.message}
                      </span>
                    )}
                  </div>
                  <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                    <Label className='font-medium'>O.R. Number</Label>
                    <Input {...register('orNumber')} />
                    {errors.orNumber && (
                      <span className='text-red-500'>
                        {errors.orNumber.message}
                      </span>
                    )}
                  </div>
                  <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Date Paid</Label>
                    <Input type='date' {...register('datePaid')} />
                    {errors.datePaid && (
                      <span className='text-red-500'>
                        {errors.datePaid.message}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              type='button'
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

export default DeathAnnotationForm;
