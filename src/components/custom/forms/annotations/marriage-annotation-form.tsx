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
  ExtendedMarriageAnnotationFormProps,
  marriageAnnotationDefaultValues,
  MarriageAnnotationFormValues,
  marriageAnnotationSchema,
  MarriageCertificateForm,
} from '@/lib/types/zod-form-annotations/formSchemaAnnotation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const MarriageAnnotationForm = ({
  open,
  onOpenChange,
  onCancel,
  row,
}: ExtendedMarriageAnnotationFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<MarriageAnnotationFormValues>({
    resolver: zodResolver(marriageAnnotationSchema),
    defaultValues: marriageAnnotationDefaultValues,
  });

  useEffect(() => {
    if (row?.original) {
      const form = row.original;
      const marriageForm =
        form.marriageCertificateForm as MarriageCertificateForm;

      if (marriageForm) {
        // Basic form info
        setValue('pageNumber', form.pageNumber);
        setValue('bookNumber', form.bookNumber);
        setValue('registryNumber', form.registryNumber);
        setValue('dateOfRegistration', new Date(form.dateOfRegistration));

        // Husband's information
        const husbandFullName =
          `${marriageForm.husbandFirstName} ${marriageForm.husbandMiddleName} ${marriageForm.husbandLastName}`.trim();
        setValue('husbandName', husbandFullName);
        setValue(
          'husbandDateOfBirthAge',
          `${new Date(
            marriageForm.husbandDateOfBirth
          ).toLocaleDateString()} / ${marriageForm.husbandAge}`
        );
        setValue('husbandCitizenship', marriageForm.husbandCitizenship);
        setValue('husbandCivilStatus', marriageForm.husbandCivilStatus);

        // Handle husband's parents
        if (
          marriageForm.husbandFatherName &&
          typeof marriageForm.husbandFatherName === 'object'
        ) {
          const fatherName = [
            marriageForm.husbandFatherName.firstName ||
              marriageForm.husbandFatherName.first,
            marriageForm.husbandFatherName.lastName ||
              marriageForm.husbandFatherName.last,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();
          setValue('husbandFather', fatherName);
        }

        if (
          marriageForm.husbandMotherMaidenName &&
          typeof marriageForm.husbandMotherMaidenName === 'object'
        ) {
          const motherName = [
            marriageForm.husbandMotherMaidenName.firstName ||
              marriageForm.husbandMotherMaidenName.first,
            marriageForm.husbandMotherMaidenName.lastName ||
              marriageForm.husbandMotherMaidenName.last,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();
          setValue('husbandMother', motherName);
        }

        // Wife's information
        const wifeFullName =
          `${marriageForm.wifeFirstName} ${marriageForm.wifeMiddleName} ${marriageForm.wifeLastName}`.trim();
        setValue('wifeName', wifeFullName);
        setValue(
          'wifeDateOfBirthAge',
          `${new Date(marriageForm.wifeDateOfBirth).toLocaleDateString()} / ${
            marriageForm.wifeAge
          }`
        );
        setValue('wifeCitizenship', marriageForm.wifeCitizenship);
        setValue('wifeCivilStatus', marriageForm.wifeCivilStatus);

        // Handle wife's parents
        if (
          marriageForm.wifeFatherName &&
          typeof marriageForm.wifeFatherName === 'object'
        ) {
          const fatherName = [
            marriageForm.wifeFatherName.firstName ||
              marriageForm.wifeFatherName.first,
            marriageForm.wifeFatherName.lastName ||
              marriageForm.wifeFatherName.last,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();
          setValue('wifeFather', fatherName);
        }

        if (
          marriageForm.wifeMotherMaidenName &&
          typeof marriageForm.wifeMotherMaidenName === 'object'
        ) {
          const motherName = [
            marriageForm.wifeMotherMaidenName.firstName ||
              marriageForm.wifeMotherMaidenName.first,
            marriageForm.wifeMotherMaidenName.lastName ||
              marriageForm.wifeMotherMaidenName.last,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();
          setValue('wifeMother', motherName);
        }

        // Marriage details
        if (marriageForm.dateOfMarriage) {
          setValue('dateOfMarriage', new Date(marriageForm.dateOfMarriage));
        }

        if (
          marriageForm.placeOfMarriage &&
          typeof marriageForm.placeOfMarriage === 'object'
        ) {
          const placeOfMarriage = [
            marriageForm.placeOfMarriage.church,
            marriageForm.placeOfMarriage.cityMunicipality,
            marriageForm.placeOfMarriage.province,
          ]
            .filter(Boolean)
            .join(', ');
          setValue('placeOfMarriage', placeOfMarriage);
        }

        // Officials and verification info
        if (form.preparedBy) {
          setValue('preparedByName', form.preparedBy.name);
          // Use null coalescing
          setValue('preparedByPosition', form.receivedByPosition || '');
        }

        if (form.verifiedBy) {
          setValue('verifiedByName', form.verifiedBy.name);
          // Use null coalescing
          setValue('verifiedByPosition', form.registeredByPosition || '');
        }

        // Set default values for required fields
        setValue('civilRegistrar', 'PRISCILLA L. GALICIA');
        setValue('civilRegistrarPosition', 'OIC - City Civil Registrar');
        setValue('purpose', 'Legal Purposes');
        setValue('issuedTo', husbandFullName);
        setValue('amountPaid', 250.0);
        setValue('datePaid', new Date());
      }
    }
  }, [row, setValue]);

  const onSubmit = async (data: MarriageAnnotationFormValues) => {
    try {
      const response = await createMarriageAnnotation(data);
      if (response.success) {
        toast.success('Marriage annotation created successfully', {
          duration: 3000,
        });
        onOpenChange(false);
        reset();
      } else {
        toast.error('Failed to create marriage annotation', {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred', {
        duration: 3000,
        description:
          'Please try again or contact support if the issue persists.',
      });
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
    onCancel();
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
                    </div>
                    <div className='space-y-1'>
                      <Label>Book number</Label>
                      <Input {...register('bookNumber')} />
                    </div>
                  </div>
                </div>

                {/* Main Form */}
                <div className='space-y-4'>
                  {/* Column Headers */}
                  <div className='grid grid-cols-2 gap-4'>
                    <h3 className='font-medium text-center'>HUSBAND</h3>
                    <h3 className='font-medium text-center'>WIFE</h3>
                  </div>

                  {/* Form Fields */}
                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Name</Label>
                    <Input {...register('husbandName')} />
                    <Input {...register('wifeName')} />
                  </div>

                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Date of Birth/Age</Label>
                    <Input {...register('husbandDateOfBirthAge')} />
                    <Input {...register('wifeDateOfBirthAge')} />
                  </div>

                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Citizenship</Label>
                    <Input {...register('husbandCitizenship')} />
                    <Input {...register('wifeCitizenship')} />
                  </div>

                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Civil Status</Label>
                    <Input {...register('husbandCivilStatus')} />
                    <Input {...register('wifeCivilStatus')} />
                  </div>

                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Mother</Label>
                    <Input {...register('husbandMother')} />
                    <Input {...register('wifeMother')} />
                  </div>

                  <div className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Father</Label>
                    <Input {...register('husbandFather')} />
                    <Input {...register('wifeFather')} />
                  </div>

                  {/* Single Column Fields */}
                  <div className='space-y-4 pt-4'>
                    <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                      <Label className='font-medium'>Registry number</Label>
                      <Input {...register('registryNumber')} />
                    </div>
                    <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                      <Label className='font-medium'>
                        Date of registration
                      </Label>
                      <Input type='date' {...register('dateOfRegistration')} />
                    </div>
                    <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                      <Label className='font-medium'>Date of marriage</Label>
                      <Input type='date' {...register('dateOfMarriage')} />
                    </div>
                    <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                      <Label className='font-medium'>Place of marriage</Label>
                      <Input {...register('placeOfMarriage')} />
                    </div>
                  </div>
                </div>

                {/* Certification Section */}
                <div className='space-y-4 pt-4'>
                  <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                    <p>This certification is issued to</p>
                    <Input {...register('issuedTo')} />
                  </div>
                  <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                    <p>Upon his/her request for</p>
                    <Input {...register('purpose')} />
                  </div>
                </div>

                {/* Signature Section */}
                <div className='grid grid-cols-2 gap-8 pt-8'>
                  <div className='space-y-8'>
                    <div className='space-y-4'>
                      <p className='font-medium'>Prepared by:</p>
                      <div className='space-y-1'>
                        <Input
                          className='text-center'
                          placeholder='Name and Signature'
                          {...register('preparedByName')}
                        />
                        <Input
                          className='text-center'
                          placeholder='Position'
                          {...register('preparedByPosition')}
                        />
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <p className='font-medium'>Verified by:</p>
                      <div className='space-y-1'>
                        <Input
                          className='text-center'
                          placeholder='Name and Signature'
                          {...register('verifiedByName')}
                        />
                        <Input
                          className='text-center'
                          placeholder='Position'
                          {...register('verifiedByPosition')}
                        />
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
                    <Label className='font-medium'>Amount paid</Label>
                    <Input
                      type='number'
                      step='0.01'
                      {...register('amountPaid', { valueAsNumber: true })}
                    />
                  </div>
                  <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                    <Label className='font-medium'>O.R. Number</Label>
                    <Input {...register('orNumber')} />
                  </div>
                  <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                    <Label className='font-medium'>Date Paid</Label>
                    <Input type='date' {...register('datePaid')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting} className='h-10 ml-2'>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  <span>Submit Form</span>
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
