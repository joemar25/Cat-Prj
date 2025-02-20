import React, { useEffect, useRef, useState } from 'react';
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
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action';
import { createBirthAnnotation } from '@/hooks/form-annotations-actions';
import { BirthAnnotationFormFields } from '@/lib/constants/form-annotations-dynamic-fields';
import {
  BirthAnnotationFormSchema,
  BirthAnnotationFormValues,
  BirthAnnotationFormProps,
} from '@/lib/types/zod-form-annotations/birth-annotation-form-schema';
import {
  MarriagePlaceStructure,
  NameStructure,
  ParentMarriageStructure,
  PlaceStructure,
} from '@/lib/types/zod-form-annotations/form-annotation-shared-interfaces';
import { formatDateTime } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AttachmentWithCertifiedCopies } from '../../civil-registry/components/attachment-table';

export interface ExtendedBirthAnnotationFormProps extends BirthAnnotationFormProps {
  formData?: BaseRegistryFormWithRelations;
  certifiedCopyId: string;
}

const BirthAnnotationForm = ({
  open,
  onOpenChange,
  onCancel,
  formData,
  certifiedCopyId,
}: ExtendedBirthAnnotationFormProps) => {
  const isCanceling = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BirthAnnotationFormValues>({
    resolver: zodResolver(BirthAnnotationFormSchema),
    defaultValues: {
      pageNumber: '',
      bookNumber: '',
      registryNumber: '',
      dateOfRegistration: '',
      childFirstName: '',
      childMiddleName: '',
      childLastName: '',
      sex: undefined,
      dateOfBirth: '',
      placeOfBirth: '',
      motherName: '',
      fatherName: '',
      motherCitizenship: '',
      fatherCitizenship: '',
      parentsMarriageDate: '',
      parentsMarriagePlace: '',
      remarks: '',
      preparedBy: '',
      preparedByPosition: '',
      verifiedBy: '',
      verifiedByPosition: '',
    },
  });

  // Form population effect
  useEffect(() => {
    if (formData) {
      try {
        const birthForm = formData.birthCertificateForm;
        if (birthForm) {
          // Basic registration info
          setValue('pageNumber', formData.pageNumber);
          setValue('bookNumber', formData.bookNumber);
          setValue('registryNumber', formData.registryNumber);

          // Format and set registration date
          if (formData.dateOfRegistration) {
            const formattedRegistrationDate = formatDateTime(
              formData.dateOfRegistration,
              {
                monthFormat: 'numeric',
                dayFormat: 'numeric',
                yearFormat: 'numeric',
              }
            );
            setValue('dateOfRegistration', formattedRegistrationDate);
          }

          // Child's information
          const childName = birthForm.childName as NameStructure;
          if (childName) {
            setValue(
              'childFirstName',
              childName.first || childName.firstName || ''
            );
            setValue(
              'childMiddleName',
              childName.middle || childName.middleName || ''
            );
            setValue(
              'childLastName',
              childName.last || childName.lastName || ''
            );
          }

          setValue('sex', birthForm.sex || '');

          // Handle date of birth
          if (birthForm.dateOfBirth) {
            const formattedBirthDate = formatDateTime(birthForm.dateOfBirth, {
              monthFormat: 'numeric',
              dayFormat: 'numeric',
              yearFormat: 'numeric',
            });
            setValue('dateOfBirth', formattedBirthDate);
          }

          // Place of birth
          const placeOfBirth = birthForm.placeOfBirth as PlaceStructure;
          if (placeOfBirth) {
            const place =
              typeof placeOfBirth === 'string'
                ? placeOfBirth
                : [
                  placeOfBirth?.hospital,
                  placeOfBirth?.barangay,
                  placeOfBirth?.cityMunicipality,
                  placeOfBirth?.province,
                ]
                  .filter(Boolean)
                  .join(', ');
            setValue('placeOfBirth', place);
          }

          // Parents' information
          const motherName = birthForm.motherMaidenName as NameStructure;
          if (motherName) {
            const motherFullName = [
              motherName.first || motherName.firstName,
              motherName.last || motherName.lastName,
            ]
              .filter(Boolean)
              .join(' ');
            setValue('motherName', motherFullName);
          }
          setValue('motherCitizenship', birthForm.motherCitizenship || '');

          const fatherName = birthForm.fatherName as NameStructure;
          if (fatherName) {
            const fatherFullName = [
              fatherName.first || fatherName.firstName,
              fatherName.last || fatherName.lastName,
            ]
              .filter(Boolean)
              .join(' ');
            setValue('fatherName', fatherFullName);
          }
          setValue('fatherCitizenship', birthForm.fatherCitizenship || '');

          // Marriage information
          const parentMarriage =
            birthForm.parentMarriage as ParentMarriageStructure;
          if (parentMarriage?.date) {
            const formattedMarriageDate = formatDateTime(parentMarriage.date, {
              monthFormat: 'numeric',
              dayFormat: 'numeric',
              yearFormat: 'numeric',
            });
            setValue('parentsMarriageDate', formattedMarriageDate);
          }

          if (parentMarriage?.place) {
            const marriagePlace =
              typeof parentMarriage.place === 'string'
                ? parentMarriage.place
                : [
                  (parentMarriage.place as MarriagePlaceStructure)?.church,
                  (parentMarriage.place as MarriagePlaceStructure)
                    ?.cityMunicipality,
                  (parentMarriage.place as MarriagePlaceStructure)?.province,
                ]
                  .filter(Boolean)
                  .join(', ');
            setValue('parentsMarriagePlace', marriagePlace);
          }

          // Form processing information and remarks
          if (formData.remarks !== null && formData.remarks !== undefined) {
            setValue('remarks', formData.remarks);
          }

          if (formData.preparedBy) {
            setValue('preparedBy', formData.preparedBy.name || '');
            setValue('preparedByPosition', formData.receivedByPosition || '');
          }

          if (formData.verifiedBy) {
            setValue('verifiedBy', formData.verifiedBy.name || '');
            setValue('verifiedByPosition', formData.registeredByPosition || '');
          }
        }
      } catch (error) {
        console.error('Error populating form:', error);
      }
    }
  }, [formData, setValue]);

  const onSubmit = async (data: BirthAnnotationFormValues) => {
    try {
      if (!certifiedCopyId) {
        toast.error('No certified copy ID provided');
        return;
      }

      console.log('Submitting form with data:', data);
      console.log('Using certifiedCopyId:', certifiedCopyId);

      const response = await createBirthAnnotation(data, certifiedCopyId);

      if (response.success) {
        toast.success('Birth annotation created successfully');
        onOpenChange(false);
        reset();
      } else {
        toast.error(response.error || 'Failed to create birth annotation');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An error occurred while creating the annotation');
    }
  };

  const handleCancel = () => {
    isCanceling.current = true;
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-6">
            Civil Registry Form 1A
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container mx-auto p-4">
            <div>
              <CardContent className="p-8 space-y-8 w-full max-w-4xl mx-auto text-foreground">
                <div className="relative border-b pb-4">
                  <div className="flex gap-2 items-center">
                    <h2 className="text-xl font-medium">TO WHOM IT MAY CONCERN:</h2>
                  </div>
                  <p className="absolute top-0 right-0 text-sm text-muted-foreground">{formatDateTime(new Date())}</p>
                  <p className="mt-4 text-muted-foreground">
                    We certify that, among others, the following facts of birth appear in our Register of Birth on
                  </p>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label>Page number</Label>
                      <Input {...register("pageNumber")} className="w-full" />
                      {errors.pageNumber && (
                        <span className="text-destructive text-sm">{errors.pageNumber.message}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Book number</Label>
                      <Input {...register("bookNumber")} className="w-full" />
                      {errors.bookNumber && (
                        <span className="text-destructive text-sm">{errors.bookNumber.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {BirthAnnotationFormFields.slice(0, Math.ceil(BirthAnnotationFormFields.length / 2)).map(
                      (field, index) => (
                        <div key={index} className="space-y-2">
                          <Label className="font-medium">{field.label}</Label>
                          <Input
                            type={field.type}
                            {...register(field.name as keyof BirthAnnotationFormValues)}
                            className="w-full"
                          />
                          {errors[field.name as keyof typeof errors] && (
                            <span className="text-destructive text-sm">
                              {errors[field.name as keyof typeof errors]?.message}
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="space-y-6">
                    {BirthAnnotationFormFields.slice(Math.ceil(BirthAnnotationFormFields.length / 2)).map(
                      (field, index) => (
                        <div key={index} className="space-y-2">
                          <Label className="font-medium">{field.label}</Label>
                          <Input
                            type={field.type}
                            {...register(field.name as keyof BirthAnnotationFormValues)}
                            className="w-full"
                          />
                          {errors[field.name as keyof typeof errors] && (
                            <span className="text-destructive text-sm">
                              {errors[field.name as keyof typeof errors]?.message}
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-6">
                  <Label className="font-medium">Remarks</Label>
                  <textarea
                    {...register("remarks")}
                    className="w-full p-3 border rounded-md mt-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8 pt-8 border-t">
                  <div className="space-y-4">
                    <p className="font-medium">Prepared By</p>
                    <Input className="text-center" placeholder="Name and Signature" {...register("preparedBy")} />
                    <Input className="text-center" placeholder="Position" {...register("preparedByPosition")} />
                  </div>
                  <div className="space-y-4">
                    <p className="font-medium">Verified By</p>
                    <Input className="text-center" placeholder="Name and Signature" {...register("verifiedBy")} />
                    <Input className="text-center" placeholder="Position" {...register("verifiedByPosition")} />
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <p className="font-medium text-center text-lg">PRISCILLA L. GALICIA</p>
                    <p className="text-sm text-center text-muted-foreground">OIC - City Civil Registrar</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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