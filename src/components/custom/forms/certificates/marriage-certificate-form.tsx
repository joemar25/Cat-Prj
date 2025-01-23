// src\components\custom\forms\certificates\marriage-certificate-form.tsx
'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Loader2, Save } from 'lucide-react'
import { PDFViewer } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MarriageFormData } from '@/types/marriage-certificate'
import { createMarriageCertificate } from '@/hooks/form-certificate-actions'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { defaultMarriageCertificateValues, MarriageCertificateFormProps, MarriageCertificateFormValues, marriageCertificateSchema } from '@/lib/types/zod-form-certificate/formSchemaCertificate'

import RemarksCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/remarks-card'
import WifeInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/wife-info-card'
import ReceivedByCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/received-by-card'
import HusbandInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/husband-info-card'
import { ConfirmationDialog, shouldSkipAlert } from '@/components/custom/confirmation-dialog/confirmation-dialog'
import RegistryInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/registry-info-card'
import WitnessesCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/witnesses-section-card'
import WifeParentsInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/wife-parent-info-card'
import MarriageDetailsCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/marriage-details-card'
import HusbandParentsInfoCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/husband-parent-info-card'
import RegisteredAtOfficeCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/registered-at-office-card'
import MarriageCertificatePDF from '@/components/custom/forms/certificates/preview/marriage-certificate/marriage-certificate-pdf'
import SolemnizingOfficerCertification from '@/components/custom/forms/certificates/form-cards/marriage-cards/solemnizing-officer-certification-card'
import ContractingPartiesCertificationCard from '@/components/custom/forms/certificates/form-cards/marriage-cards/contracting-parties-certification-card'

export function MarriageCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: MarriageCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [pendingSubmission, setPendingSubmission] =
    useState<MarriageCertificateFormValues | null>(null)

  const form = useForm<MarriageCertificateFormValues>({
    resolver: zodResolver(marriageCertificateSchema),
    defaultValues: defaultMarriageCertificateValues,
  })

  const onSubmit = async (values: MarriageCertificateFormValues) => {
    try {
      setIsSubmitting(true)
      const result = await createMarriageCertificate(values)

      if (result.success) {
        toast.success('Marriage certificate has been registered successfully')
        onOpenChange(false) // Close the dialog
        form.reset() // Reset the form
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to register marriage certificate. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (values: MarriageCertificateFormValues) => {
    if (shouldSkipAlert('skipMarriageCertificateAlert')) {
      onSubmit(values)
    } else {
      setPendingSubmission(values)
      setShowAlert(true)
    }
  }

  const confirmSubmit = () => {
    if (pendingSubmission) {
      onSubmit(pendingSubmission)
      setShowAlert(false)
      setPendingSubmission(null)
    }
  }

  const transformFormDataForPreview = (
    formData: Partial<MarriageCertificateFormValues>
  ): Partial<MarriageFormData> => {
    if (!formData) return {}

    const data: Partial<MarriageFormData> = {
      ...formData,

      registryNo: formData.registryNumber || 'N/A',
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
      witnesses: {
        husband: Array.isArray(formData.witnesses?.husband)
          ? formData.witnesses.husband.map((witness) => ({
            name: witness?.name || '',
            signature: witness?.signature || '',
          }))
          : [{ name: '', signature: '' }],
        wife: Array.isArray(formData.witnesses?.wife)
          ? formData.witnesses.wife.map((witness) => ({
            name: witness?.name || '',
            signature: witness?.signature || '',
          }))
          : [{ name: '', signature: '' }],
      },

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
      contractingPartiesSignature: {
        husband: formData.contractingPartiesSignature?.husband ?? '',
        wife: formData.contractingPartiesSignature?.wife ?? '',
      },

      receivedBy: formData.receivedBy
        ? {
          signature: formData.receivedBy.signature || 'N/A',
          name: formData.receivedBy.name || 'N/A',
          title: formData.receivedBy.title || 'N/A',
          date: formData.receivedBy.date
            ? format(new Date(formData.receivedBy.date), 'MMMM dd, yyyy')
            : 'N/A',
        }
        : {
          signature: 'N/A',
          name: 'N/A',
          title: 'N/A',
          date: 'N/A',
        },

      registeredAtCivilRegistrar: formData.registeredAtCivilRegistrar
        ? {
          signature: formData.registeredAtCivilRegistrar.signature || 'N/A',
          name: formData.registeredAtCivilRegistrar.name || 'N/A',
          title: formData.registeredAtCivilRegistrar.title || 'N/A',
          date: formData.registeredAtCivilRegistrar.date
            ? format(
              new Date(formData.registeredAtCivilRegistrar.date),
              'MMMM dd, yyyy'
            ) // Month Day, Year format
            : 'N/A',
        }
        : {
          signature: 'N/A',
          name: 'N/A',
          title: 'N/A',
          date: 'N/A',
        },

      remarks: formData.remarks || 'N/A',
    }

    return data
  }

  const handleError = () => {
    toast.warning('Please fill in all required fields', {
      description: 'Some required information is missing or incorrect.',
    })
  }

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
                      <RemarksCard />
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
  )
}

export default MarriageCertificateForm
