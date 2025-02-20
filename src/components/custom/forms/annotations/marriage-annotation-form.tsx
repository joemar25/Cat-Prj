'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMarriageAnnotation } from '@/hooks/form-annotations-actions'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ExtendedMarriageAnnotationFormProps,
  MarriageAnnotationFormValues,
  marriageAnnotationSchema,
} from '@/lib/types/zod-form-annotations/marriage-annotation-form-schema'

// Inline type for name structure.
type NameType = { firstName?: string; first?: string; lastName?: string; last?: string }

const defaultValues: MarriageAnnotationFormValues = {
  pageNumber: '',
  bookNumber: '',
  registryNumber: '',
  dateOfRegistration: new Date(),
  husbandName: '',
  husbandDateOfBirthAge: '',
  husbandCitizenship: '',
  husbandCivilStatus: '',
  husbandFather: '',
  husbandMother: '',
  wifeName: '',
  wifeDateOfBirthAge: '',
  wifeCitizenship: '',
  wifeCivilStatus: '',
  wifeFather: '',
  wifeMother: '',
  dateOfMarriage: new Date(),
  placeOfMarriage: '',
  issuedTo: '',
  purpose: '',
  preparedByName: '',
  preparedByPosition: '',
  verifiedByName: '',
  verifiedByPosition: '',
  civilRegistrar: 'PRISCILLA L. GALICIA',
  civilRegistrarPosition: 'OIC - City Civil Registrar',
  amountPaid: 0,
  orNumber: '',
  datePaid: new Date(),
}

const MarriageAnnotationForm: React.FC<ExtendedMarriageAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
  formData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<MarriageAnnotationFormValues>({
    resolver: zodResolver(marriageAnnotationSchema),
    defaultValues,
  })

  useEffect(() => {
    if (formData) {
      const form = formData
      const marriageForm = form.marriageCertificateForm
      if (marriageForm) {
        // Basic registration info
        setValue('pageNumber', form.pageNumber)
        setValue('bookNumber', form.bookNumber)
        setValue('registryNumber', form.registryNumber)
        setValue('dateOfRegistration', new Date(form.dateOfRegistration))

        // Husband's Information
        const husbandFullName = `${marriageForm.husbandFirstName} ${marriageForm.husbandMiddleName} ${marriageForm.husbandLastName}`.trim()
        setValue('husbandName', husbandFullName)
        setValue(
          'husbandDateOfBirthAge',
          `${new Date(marriageForm.husbandDateOfBirth).toLocaleDateString()} / ${marriageForm.husbandAge}`
        )
        setValue('husbandCitizenship', marriageForm.husbandCitizenship)
        setValue('husbandCivilStatus', marriageForm.husbandCivilStatus)
        if (marriageForm.husbandFatherName && typeof marriageForm.husbandFatherName === 'object') {
          const fatherObj = marriageForm.husbandFatherName as NameType
          const fatherName = [
            fatherObj.firstName || fatherObj.first,
            fatherObj.lastName || fatherObj.last,
          ]
            .filter(Boolean)
            .join(' ')
          setValue('husbandFather', fatherName)
        }
        if (marriageForm.husbandMotherMaidenName && typeof marriageForm.husbandMotherMaidenName === 'object') {
          const motherObj = marriageForm.husbandMotherMaidenName as NameType
          const motherName = [
            motherObj.firstName || motherObj.first,
            motherObj.lastName || motherObj.last,
          ]
            .filter(Boolean)
            .join(' ')
          setValue('husbandMother', motherName)
        }

        // Wife's Information
        const wifeFullName = `${marriageForm.wifeFirstName} ${marriageForm.wifeMiddleName} ${marriageForm.wifeLastName}`.trim()
        setValue('wifeName', wifeFullName)
        setValue(
          'wifeDateOfBirthAge',
          `${new Date(marriageForm.wifeDateOfBirth).toLocaleDateString()} / ${marriageForm.wifeAge}`
        )
        setValue('wifeCitizenship', marriageForm.wifeCitizenship)
        setValue('wifeCivilStatus', marriageForm.wifeCivilStatus)
        if (marriageForm.wifeFatherName && typeof marriageForm.wifeFatherName === 'object') {
          const fatherObj = marriageForm.wifeFatherName as NameType
          const fatherName = [
            fatherObj.firstName || fatherObj.first,
            fatherObj.lastName || fatherObj.last,
          ]
            .filter(Boolean)
            .join(' ')
          setValue('wifeFather', fatherName)
        }
        if (marriageForm.wifeMotherMaidenName && typeof marriageForm.wifeMotherMaidenName === 'object') {
          const motherObj = marriageForm.wifeMotherMaidenName as NameType
          const motherName = [
            motherObj.firstName || motherObj.first,
            motherObj.lastName || motherObj.last,
          ]
            .filter(Boolean)
            .join(' ')
          setValue('wifeMother', motherName)
        }

        // Marriage Details
        if (marriageForm.dateOfMarriage) {
          setValue('dateOfMarriage', new Date(marriageForm.dateOfMarriage))
        }
        if (marriageForm.placeOfMarriage && typeof marriageForm.placeOfMarriage === 'object') {
          const placeObj = marriageForm.placeOfMarriage as { church?: string; cityMunicipality?: string; province?: string }
          const placeOfMarriage = [placeObj.church, placeObj.cityMunicipality, placeObj.province]
            .filter(Boolean)
            .join(', ')
          setValue('placeOfMarriage', placeOfMarriage)
        }

        // Certification Section
        if (form.preparedBy) {
          setValue('preparedByName', form.preparedBy.name)
          setValue('preparedByPosition', form.receivedByPosition || '')
        }
        if (form.verifiedBy) {
          setValue('verifiedByName', form.verifiedBy.name)
          setValue('verifiedByPosition', form.registeredByPosition || '')
        }
        setValue('civilRegistrar', 'PRISCILLA L. GALICIA')
        setValue('civilRegistrarPosition', 'OIC - City Civil Registrar')
        setValue('purpose', 'Legal Purposes')
        setValue('issuedTo', husbandFullName)
        setValue('amountPaid', 250.0)
        setValue('datePaid', new Date())
      }
    }
  }, [formData, setValue])

  const onSubmit = async (data: MarriageAnnotationFormValues) => {
    try {
      const response = await createMarriageAnnotation(data)
      if (response.success) {
        toast.success('Marriage annotation created successfully')
        onOpenChange(false)
        reset()
      } else {
        toast.error('Failed to create marriage annotation')
      }
    } catch (error) {
      console.error('Error creating marriage annotation:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    reset()
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-6">
            Civil Registry Form 3A
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container mx-auto p-4">
            <div className="bg-background text-foreground">
              <CardContent className="p-8 space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                  <h2 className="text-xl font-medium">TO WHOM IT MAY CONCERN:</h2>
                  <p className="text-muted-foreground">
                    We certify that, among others, the following marriage appears in our Register of Marriages:
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>On page</Label>
                      <Input {...register('pageNumber')} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label>Book number</Label>
                      <Input {...register('bookNumber')} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Main Form Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <h3 className="font-medium text-center">HUSBAND</h3>
                    <h3 className="font-medium text-center">WIFE</h3>
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Name</Label>
                    <Input {...register('husbandName')} />
                    <Input {...register('wifeName')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Date of Birth/Age</Label>
                    <Input {...register('husbandDateOfBirthAge')} />
                    <Input {...register('wifeDateOfBirthAge')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Citizenship</Label>
                    <Input {...register('husbandCitizenship')} />
                    <Input {...register('wifeCitizenship')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Civil Status</Label>
                    <Input {...register('husbandCivilStatus')} />
                    <Input {...register('wifeCivilStatus')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Mother</Label>
                    <Input {...register('husbandMother')} />
                    <Input {...register('wifeMother')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                    <Label className="font-medium">Father</Label>
                    <Input {...register('husbandFather')} />
                    <Input {...register('wifeFather')} />
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <Label className="font-medium">Registry number</Label>
                      <Input {...register('registryNumber')} />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <Label className="font-medium">Date of registration</Label>
                      <Input type="date" {...register('dateOfRegistration')} />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <Label className="font-medium">Date of marriage</Label>
                      <Input type="date" {...register('dateOfMarriage')} />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <Label className="font-medium">Place of marriage</Label>
                      <Input {...register('placeOfMarriage')} />
                    </div>
                  </div>
                </div>

                {/* Certification Section */}
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <p>This certification is issued to</p>
                    <Input {...register('issuedTo')} />
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <p>Upon his/her request for</p>
                    <Input {...register('purpose')} />
                  </div>
                </div>

                {/* Signature Section */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t">
                  <div className="space-y-4">
                    <p className="font-medium">Prepared by:</p>
                    <Input
                      className="text-center"
                      placeholder="Name and Signature"
                      {...register('preparedByName')}
                    />
                    <Input
                      className="text-center"
                      placeholder="Position"
                      {...register('preparedByPosition')}
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="font-medium">Verified by:</p>
                    <Input
                      className="text-center"
                      placeholder="Name and Signature"
                      {...register('verifiedByName')}
                    />
                    <Input
                      className="text-center"
                      placeholder="Position"
                      {...register('verifiedByPosition')}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <p className="font-medium text-center">PRISCILLA L. GALICIA</p>
                    <p className="text-sm text-center text-muted-foreground">
                      OIC - City Civil Registrar
                    </p>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-2 pt-4">
                  <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                    <Label className="font-medium">Amount paid</Label>
                    <Input type="number" step="0.01" {...register('amountPaid', { valueAsNumber: true })} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                    <Label className="font-medium">O.R. Number</Label>
                    <Input {...register('orNumber')} />
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                    <Label className="font-medium">Date Paid</Label>
                    <Input type="date" {...register('datePaid')} />
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="ml-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Submit Form</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MarriageAnnotationForm
