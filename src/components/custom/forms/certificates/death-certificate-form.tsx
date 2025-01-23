'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Loader2, Save } from 'lucide-react'
import { PDFViewer } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDeathCertificate } from '@/hooks/form-certificate-actions'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmationDialog, shouldSkipAlert } from '@/components/custom/confirmation-dialog/confirmation-dialog'
import { DeathCertificateFormProps, DeathCertificateFormValues, deathCertificateSchema, defaultDeathCertificateValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate'

// Import all the card components
import DeathCertificatePDF from './preview/death-certificate/death-certificate-preview'
import RemarksCard from '@/components/custom/forms/certificates/form-cards/death-cards/remarks-card'
import PreparedByCard from '@/components/custom/forms/certificates/form-cards/death-cards/prepared-by-card'
import ReceivedByCard from '@/components/custom/forms/certificates/form-cards/death-cards/received-by-card'
import CausesOfDeathCard from '@/components/custom/forms/certificates/form-cards/death-cards/causes-of-death'
import MaternalConditionCard from '@/components/custom/forms/certificates/form-cards/death-cards/maternal-condition-card'
import MedicalCertificateCard from '@/components/custom/forms/certificates/form-cards/death-cards/medical-certificate-card'
import RegisteredAtOfficeCard from '@/components/custom/forms/certificates/form-cards/death-cards/registered-at-office-card'
import DisposalInformationCard from '@/components/custom/forms/certificates/form-cards/death-cards/disposal-information-card'
import PersonalInformationCard from '@/components/custom/forms/certificates/form-cards/death-cards/personal-information-card'
import DeathByExternalCausesCard from '@/components/custom/forms/certificates/form-cards/death-cards/death-by-external-causes'
import RegistryInformationCard from '@/components/custom/forms/certificates/form-cards/death-cards/regsitry-information-card'
import AttendantInformationCard from '@/components/custom/forms/certificates/form-cards/death-cards/attendant-information-card'
import CertificationOfDeathCard from '@/components/custom/forms/certificates/form-cards/death-cards/certification-of-death-card'
import CertificationInformantCard from '@/components/custom/forms/certificates/form-cards/death-cards/certification-of-informant-card'

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [pendingSubmission, setPendingSubmission] =
    useState<DeathCertificateFormValues | null>(null)

  const form = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateSchema),
    defaultValues: defaultDeathCertificateValues,
  })

  const onSubmit = async (values: DeathCertificateFormValues) => {
    try {
      setIsSubmitting(true)
      const result = await createDeathCertificate(values)

      if (result.success) {
        toast.success('Death certificate has been registered successfully')
        onOpenChange(false)
        form.reset()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to register death certificate. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (values: DeathCertificateFormValues) => {
    if (shouldSkipAlert('skipDeathCertificateAlert')) {
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

  // Add this function in your DeathCertificateForm component
  const transformFormDataForPreview = (
    data: Partial<DeathCertificateFormValues> | null
  ): Partial<DeathCertificateFormValues> => {
    if (!data) return {}

    return {
      // Registry Information
      registryNumber: data.registryNumber,
      province: data.province,
      cityMunicipality: data.cityMunicipality,

      // Personal Information
      name: data.name,
      sex: data.sex,
      civilStatus: data.civilStatus,
      dateOfDeath: data.dateOfDeath,
      dateOfBirth: data.dateOfBirth,
      ageAtDeath: data.ageAtDeath,
      placeOfDeath: data.placeOfDeath,
      religion: data.religion,
      citizenship: data.citizenship,
      residence: data.residence,
      occupation: data.occupation,

      // Family Information
      fatherName: data.fatherName,
      motherMaidenName: data.motherMaidenName,

      // Medical Certificate
      causesOfDeath: data.causesOfDeath,
      maternalCondition: data.maternalCondition,
      deathByExternalCauses: data.deathByExternalCauses,

      // Attendant Information
      attendant: data.attendant,

      // Certification
      certification: data.certification,

      // Disposal Information
      disposal: data.disposal,
      cemeteryAddress: data.cemeteryAddress,

      // Informant
      informant: data.informant,

      // Civil Registry
      receivedBy: data.receivedBy,
      registeredAtCivilRegistrar: data.registeredAtCivilRegistrar,

      preparedBy: data.preparedBy && {
        signature: data.preparedBy.signature,
        name: data.preparedBy.name,
        title: data.preparedBy.title,
        date: data.preparedBy.date,
      },

      // Remarks
      remarks: data.remarks,
    }
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
              Certificate of Death
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            {/* Left Side - Form */}
            <div className='w-1/2 border-r'>
              <div className='h-[calc(95vh-120px)] overflow-y-auto p-6'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit, handleError)}
                    className='space-y-6'
                  >
                    {/* Registry Information */}
                    <RegistryInformationCard />

                    {/* Personal Information */}
                    <PersonalInformationCard />

                    {/* Medical Certificate */}
                    <MedicalCertificateCard />

                    {/* Causes of Death */}
                    <CausesOfDeathCard />

                    {/* Maternal Condition */}
                    <MaternalConditionCard />

                    {/* Death by External Causes */}
                    <DeathByExternalCausesCard />

                    {/* Attendant Information */}
                    <AttendantInformationCard />

                    {/* Certification of Death */}
                    <CertificationOfDeathCard />

                    {/* Disposal Information */}
                    <DisposalInformationCard />

                    {/* Informant Information */}
                    <CertificationInformantCard />

                    {/* Prepared By */}
                    <PreparedByCard />

                    {/* Received By */}
                    <ReceivedByCard />

                    {/* Registered at Civil Registrar */}
                    <RegisteredAtOfficeCard />

                    {/* Remarks */}
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

                <ConfirmationDialog
                  open={showAlert}
                  onOpenChange={setShowAlert}
                  onConfirm={confirmSubmit}
                  isSubmitting={isSubmitting}
                  localStorageKey='skipDeathCertificateAlert'
                />
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <DeathCertificatePDF
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