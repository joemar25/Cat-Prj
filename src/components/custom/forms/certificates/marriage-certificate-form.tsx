// src\components\custom\forms\certificates\marriage-certificate-form.tsx
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
import { createMarriageCertificate } from '@/hooks/form-certificate-actions';
import {
  defaultMarriageCertificateValues,
  MarriageCertificateFormProps,
  MarriageCertificateFormValues,
  marriageCertificateSchema,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { MarriageFormData } from '@/types/marriage-certificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  ConfirmationDialog,
  shouldSkipAlert,
} from '../../confirmation-dialog/confirmation-dialog';
import ContractingPartiesCertificationCard from './form-cards/marriage-cards/contracting-parties-certification.-card';
import HusbandInfoCard from './form-cards/marriage-cards/husband-info-card';
import HusbandParentsInfoCard from './form-cards/marriage-cards/husband-parent-info-card';
import MarriageDetailsCard from './form-cards/marriage-cards/marriage-details-card';
import ReceivedByCard from './form-cards/marriage-cards/received-by-card';
import RegisteredAtOfficeCard from './form-cards/marriage-cards/registered-at-office-card';
import RegistryInfoCard from './form-cards/marriage-cards/registry-info-card';
import SolemnizingOfficerCertification from './form-cards/marriage-cards/solemnizing-officer-certification-card';
import WifeInfoCard from './form-cards/marriage-cards/wife-info-card';
import WifeParentsInfoCard from './form-cards/marriage-cards/wife-parent-info-card';
import WitnessesCard from './form-cards/marriage-cards/witnesses-section-card';
import MarriageCertificatePDF from './preview/marriage-certificate/MarriageCertificatePDF';

export function MarriageCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: MarriageCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<MarriageCertificateFormValues | null>(null);

  const form = useForm<MarriageCertificateFormValues>({
    resolver: zodResolver(marriageCertificateSchema),
    defaultValues: defaultMarriageCertificateValues,
  });

  const onSubmit = async (values: MarriageCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createMarriageCertificate(values);

      if (result.success) {
        toast.success('Marriage certificate has been registered successfully');
        onOpenChange(false); // Close the dialog
        form.reset(); // Reset the form
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register marriage certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (values: MarriageCertificateFormValues) => {
    if (shouldSkipAlert('skipMarriageCertificateAlert')) {
      onSubmit(values);
    } else {
      setPendingSubmission(values);
      setShowAlert(true);
    }
  };

  const confirmSubmit = () => {
    if (pendingSubmission) {
      onSubmit(pendingSubmission);
      setShowAlert(false);
      setPendingSubmission(null);
    }
  };

  const transformFormDataForPreview = (
    formData: Partial<MarriageCertificateFormValues>
  ): Partial<MarriageFormData> => {
    if (!formData) return {};

    const data: Partial<MarriageFormData> = {
      ...formData,
      // Transform dates to string format
      husbandDateOfBirth: formData.husbandDateOfBirth
        ? format(new Date(formData.husbandDateOfBirth), 'yyyy-MM-dd')
        : null,
      wifeDateOfBirth: formData.wifeDateOfBirth
        ? format(new Date(formData.wifeDateOfBirth), 'yyyy-MM-dd')
        : null,
      dateOfMarriage: formData.dateOfMarriage
        ? format(new Date(formData.dateOfMarriage), 'yyyy-MM-dd')
        : null,

      // Transform place of birth structures
      husbandPlaceOfBirth: formData.husbandPlaceOfBirth
        ? {
            cityMunicipality: formData.husbandPlaceOfBirth.cityMunicipality,
            province: formData.husbandPlaceOfBirth.province,
            country: formData.husbandPlaceOfBirth.country || 'Philippines',
          }
        : undefined,

      wifePlaceOfBirth: formData.wifePlaceOfBirth
        ? {
            cityMunicipality: formData.wifePlaceOfBirth.cityMunicipality,
            province: formData.wifePlaceOfBirth.province,
            country: formData.wifePlaceOfBirth.country || 'Philippines',
          }
        : undefined,

      // Transform place of marriage
      placeOfMarriage: formData.placeOfMarriage
        ? {
            office: formData.placeOfMarriage.office,
            cityMunicipality: formData.placeOfMarriage.cityMunicipality,
            province: formData.placeOfMarriage.province,
            country: 'Philippines',
          }
        : undefined,

      // Transform solemnizing officer
      solemnizingOfficer: formData.solemnizingOfficer
        ? {
            ...formData.solemnizingOfficer,
            registryNoExpiryDate:
              formData.solemnizingOfficer.registryNoExpiryDate,
          }
        : undefined,

      // Transform witnesses array
      witnesses:
        formData.witnesses?.map((witness) => ({
          name: witness.name,
          signature: witness.signature || '',
        })) || [],

      // Transform consent information
      husbandConsentPerson:
        formData.husbandConsentGivenBy && formData.husbandConsentRelationship
          ? {
              name: formData.husbandConsentGivenBy,
              relationship: formData.husbandConsentRelationship,
              residence: formData.husbandConsentResidence || '',
            }
          : null,

      wifeConsentPerson:
        formData.wifeConsentGivenBy && formData.wifeConsentRelationship
          ? {
              name: formData.wifeConsentGivenBy,
              relationship: formData.wifeConsentRelationship,
              residence: formData.wifeConsentResidence || '',
            }
          : null,

      // Transform marriage license details
      marriageLicenseDetails: formData.marriageLicenseDetails
        ? {
            number: formData.marriageLicenseDetails.number,
            dateIssued: formData.marriageLicenseDetails.dateIssued,
            placeIssued: formData.marriageLicenseDetails.placeIssued,
          }
        : undefined,

      // Transform signatures
      contractingPartiesSignature: formData.contractingPartiesSignature
        ? {
            husband: formData.contractingPartiesSignature.husband || '',
            wife: formData.contractingPartiesSignature.wife || '',
          }
        : undefined,
    };

    return data;
  };

  const handleError = () => {
    toast.warning('Please fill in all required fields', {
      description: 'Some required information is missing or incorrect.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0'>
        <div className='h-full flex flex-col'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-center py-4'>
              Certificate of Marriage
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            <div className='w-1/2 border-r'>
              <ScrollArea className='h-[calc(95vh-120px)]'>
                <div className='p-6'>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit, handleError)}
                      className='space-y-6'
                    >
                      <RegistryInfoCard />
                      <HusbandInfoCard />
                      <WifeInfoCard />
                      <HusbandParentsInfoCard />
                      <WifeParentsInfoCard />
                      <MarriageDetailsCard />
                      <ContractingPartiesCertificationCard />
                      <SolemnizingOfficerCertification />
                      <WitnessesCard />
                      <ReceivedByCard />
                      <RegisteredAtOfficeCard />
                      {/* <HusbandConsentInfoCard />
                      <WifeConsentInfoCard /> */}

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

                  <ConfirmationDialog
                    open={showAlert}
                    onOpenChange={setShowAlert}
                    onConfirm={confirmSubmit}
                    isSubmitting={isSubmitting}
                    localStorageKey='skipMarriageCertificateAlert'
                  />
                </div>
              </ScrollArea>
            </div>

            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <MarriageCertificatePDF
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

export default MarriageCertificateForm;

// FOR LATER USE -------------------
{
  /* Witnesses Information */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Witnesses
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {[0, 1].map((index) => (
                              <div key={index} className='space-y-4'>
                                <h4 className='font-medium'>
                                  Witness {index + 1}
                                </h4>
                                <FormField
                                  control={form.control}
                                  name={`witnesses.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Full Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          className='h-10'
                                          placeholder='Enter full name'
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`witnesses.${index}.signature`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Signature</FormLabel>
                                      <FormControl>
                                        <Input
                                          type='file'
                                          className='h-10'
                                          accept='image/*'
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file || null); // Always set a value, even if it's null
                                          }}
                                          // Don't set value prop on file inputs as they're read-only
                                          key={
                                            field.value
                                              ? 'file-input-with-value'
                                              : 'file-input-empty'
                                          } // Force re-render when value changes
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card> */
}
{
  /* Receipt Information */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Receipt Information
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <FormField
                              control={form.control}
                              name='receivedBy.name'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Received By</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter name'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='receivedBy.position'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position/Designation</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter position'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='receivedBy.date'
                              render={({ field }) => (
                                <DatePickerField
                                  field={field}
                                  label='Date Received'
                                />
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}
{
  /* Registration Information */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Registration Information
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <FormField
                              control={form.control}
                              name='registeredBy.name'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registered By</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter name'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='registeredBy.position'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position/Designation</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter position'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='registeredBy.date'
                              render={({ field }) => (
                                <DatePickerField
                                  field={field}
                                  label='Date Registered'
                                />
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}
{
  /* Remarks/Annotations */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Remarks/Annotations
                          </h3>
                          <div className='grid grid-cols-1 gap-6'>
                            <FormField
                              control={form.control}
                              name='remarks'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Remarks</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      className='min-h-[100px] resize-none'
                                      placeholder='Enter any additional remarks or annotations'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}

{
  /* Marriage Settlement Details */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Marriage Settlement Details
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                              control={form.control}
                              name='marriageSettlement'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                  <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                      Marriage Settlement
                                    </FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}

{
  /* Solemnizing Officer Details */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Solemnizing Officer Details
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <FormField
                              control={form.control}
                              name='solemnizingOfficer.name'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter solemnizing officer name'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='solemnizingOfficer.position'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter position'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='solemnizingOfficer.religion'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Religion</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter religion'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='solemnizingOfficer.registryNo'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registry Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      className='h-10'
                                      placeholder='Enter registry number'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='solemnizingOfficer.expiryDate'
                              render={({ field }) => (
                                <DatePickerField
                                  field={field}
                                  label='Registry Expiry Date'
                                />
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}

{
  /* Legal Documentation Details */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Legal Documentation
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <FormField
                              control={form.control}
                              name='noMarriageLicense'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                  <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                      No Marriage License Required
                                    </FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='executiveOrderApplied'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                  <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                      Executive Order Applied
                                    </FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='presidentialDecreeApplied'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                  <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                      Presidential Decree Applied
                                    </FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}

{
  /* Signatures */
}
{
  /* <Card className='border dark:border-border'>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-lg mb-4'>
                            Contracting Parties Signatures
                          </h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                              control={form.control}
                              name='contractingPartiesSignature.husband'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Husband&apos;s Signature
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type='file'
                                      className='h-10'
                                      accept='image/*'
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        field.onChange(file || null); // Always set a value, even if it's null
                                      }}
                                      // Don't set value prop on file inputs as they're read-only
                                      key={
                                        field.value
                                          ? 'file-input-with-value'
                                          : 'file-input-empty'
                                      } // Force re-render when value changes
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='contractingPartiesSignature.wife'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Wife&apos;s Signature</FormLabel>
                                  <FormControl>
                                    <Input
                                      type='file'
                                      className='h-10'
                                      accept='image/*'
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        field.onChange(file || null); // Always set a value, even if it's null
                                      }}
                                      // Don't set value prop on file inputs as they're read-only
                                      key={
                                        field.value
                                          ? 'file-input-with-value'
                                          : 'file-input-empty'
                                      } // Force re-render when value changes
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card> */
}
