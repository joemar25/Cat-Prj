// src/components/custom/public_request_forms/birth_cert_form.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDocumentStore from '@/state/use-document-store'
import { birthRequestSchema, type BirthRequestData } from '@/lib/validation/forms/request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function BirthCertificateForm() {
    const router = useRouter()
    const { birthFormData, setBirthFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting } = useDocumentStore()

    const form = useForm<BirthRequestData>({
        resolver: zodResolver(birthRequestSchema.shape.data),
        defaultValues: birthFormData
    })

    const onSubmit = async (formData: BirthRequestData) => {
        try {
            setIsSubmitting(true)
            const validatedData = birthRequestSchema.shape.data.parse(formData)

            const payload = {
                type: 'BIRTH' as const,
                data: validatedData
            }

            const response = await fetch('/api/public-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit request')
            }

            toast.success('Request Submitted', {
                description: `Your request has been submitted successfully. Registry number: ${result.registryNumber}`,
            })

            form.reset()
            setBirthFormData({})
            router.push('/public_request')
        } catch (error) {
            console.error('Submission error:', error)
            if (error instanceof Error) {
                toast.error('Submission Failed', {
                    description: error.message,
                })
                setFormErrors({ submit: error.message })
            } else {
                toast.error('Submission Failed', {
                    description: 'An unexpected error occurred',
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function to format date to prevent future dates
    const today = new Date().toISOString().split('T')[0]

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert>
                <AlertDescription>
                    Please fill in all required fields marked with an asterisk (*).
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Child&apos;s Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nameOfChild">Child&apos;s Full Name *</Label>
                        <Input
                            id="nameOfChild"
                            {...form.register('nameOfChild')}
                            aria-invalid={!!form.formState.errors.nameOfChild}
                        />
                        {form.formState.errors.nameOfChild && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.nameOfChild.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sex">Sex *</Label>
                        <Select
                            onValueChange={(value) => form.setValue('sex', value as 'MALE' | 'FEMALE')}
                            defaultValue={form.watch('sex')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.sex && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.sex.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            max={today}
                            {...form.register('dateOfBirth')}
                            aria-invalid={!!form.formState.errors.dateOfBirth}
                        />
                        {form.formState.errors.dateOfBirth && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.dateOfBirth.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                        <Input
                            id="placeOfBirth"
                            {...form.register('placeOfBirth')}
                            aria-invalid={!!form.formState.errors.placeOfBirth}
                        />
                        {form.formState.errors.placeOfBirth && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.placeOfBirth.message}
                            </p>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6">Parents&apos; Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nameOfMother">Mother&apos;s Full Name *</Label>
                        <Input
                            id="nameOfMother"
                            {...form.register('nameOfMother')}
                            aria-invalid={!!form.formState.errors.nameOfMother}
                        />
                        {form.formState.errors.nameOfMother && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.nameOfMother.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="citizenshipMother">Mother&apos;s Citizenship *</Label>
                        <Input
                            id="citizenshipMother"
                            {...form.register('citizenshipMother')}
                            aria-invalid={!!form.formState.errors.citizenshipMother}
                        />
                        {form.formState.errors.citizenshipMother && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.citizenshipMother.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nameOfFather">Father&apos;s Full Name *</Label>
                        <Input
                            id="nameOfFather"
                            {...form.register('nameOfFather')}
                            aria-invalid={!!form.formState.errors.nameOfFather}
                        />
                        {form.formState.errors.nameOfFather && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.nameOfFather.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="citizenshipFather">Father&apos;s Citizenship *</Label>
                        <Input
                            id="citizenshipFather"
                            {...form.register('citizenshipFather')}
                            aria-invalid={!!form.formState.errors.citizenshipFather}
                        />
                        {form.formState.errors.citizenshipFather && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.citizenshipFather.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateMarriageParents">Parents&apos; Marriage Date</Label>
                        <Input
                            id="dateMarriageParents"
                            type="date"
                            max={today}
                            {...form.register('dateMarriageParents')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="placeMarriageParents">Parents&apos; Marriage Place</Label>
                        <Input
                            id="placeMarriageParents"
                            {...form.register('placeMarriageParents')}
                        />
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6">Request Details</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose of Request *</Label>
                        <Input
                            id="purpose"
                            {...form.register('purpose')}
                            aria-invalid={!!form.formState.errors.purpose}
                        />
                        {form.formState.errors.purpose && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.purpose.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requesterName">Requester&apos;s Name *</Label>
                        <Input
                            id="requesterName"
                            {...form.register('requesterName')}
                            aria-invalid={!!form.formState.errors.requesterName}
                        />
                        {form.formState.errors.requesterName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.requesterName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="relationshipToOwner">Relationship to Document Owner *</Label>
                        <Input
                            id="relationshipToOwner"
                            {...form.register('relationshipToOwner')}
                            aria-invalid={!!form.formState.errors.relationshipToOwner}
                        />
                        {form.formState.errors.relationshipToOwner && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.relationshipToOwner.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNo">Contact Number *</Label>
                        <Input
                            id="contactNo"
                            {...form.register('contactNo')}
                            aria-invalid={!!form.formState.errors.contactNo}
                        />
                        {form.formState.errors.contactNo && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.contactNo.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Complete Address *</Label>
                        <Input
                            id="address"
                            {...form.register('address')}
                            aria-invalid={!!form.formState.errors.address}
                        />
                        {form.formState.errors.address && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.address.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {formErrors.submit && (
                <Alert variant="destructive">
                    <AlertDescription>{formErrors.submit}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
        </form>
    )
}