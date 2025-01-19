// src/components/custom/public_request_forms/marriage_cert_form.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDocumentStore from '@/state/use-document-store'
import { marriageRequestSchema, type MarriageRequestData } from '@/lib/validation/forms/request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const civilStatusOptions = ['SINGLE', 'WIDOWED', 'DIVORCED', 'SEPARATED'] as const
type CivilStatus = typeof civilStatusOptions[number]

export default function MarriageCertificateForm() {
    const router = useRouter()
    const { marriageFormData, setMarriageFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting } = useDocumentStore()

    const form = useForm<MarriageRequestData>({
        resolver: zodResolver(marriageRequestSchema.shape.data),
        defaultValues: marriageFormData
    })

    const onSubmit = async (formData: MarriageRequestData) => {
        try {
            setIsSubmitting(true)
            const validatedData = marriageRequestSchema.shape.data.parse(formData)

            const payload = {
                type: 'MARRIAGE' as const,
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
            setMarriageFormData({})
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

    const setCivilStatus = (value: string, field: 'husbandCivilStatus' | 'wifeCivilStatus') => {
        form.setValue(field, value as CivilStatus)
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert>
                <AlertDescription>
                    Please fill in all required fields marked with an asterisk (*).
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Husband&apos;s Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="husbandName">Full Name *</Label>
                        <Input
                            id="husbandName"
                            {...form.register('husbandName')}
                            aria-invalid={!!form.formState.errors.husbandName}
                        />
                        {form.formState.errors.husbandName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="husbandDateOfBirthAge">Date of Birth/Age *</Label>
                        <Input
                            id="husbandDateOfBirthAge"
                            {...form.register('husbandDateOfBirthAge')}
                            aria-invalid={!!form.formState.errors.husbandDateOfBirthAge}
                            max={today}
                        />
                        {form.formState.errors.husbandDateOfBirthAge && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandDateOfBirthAge.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="husbandCitizenship">Citizenship *</Label>
                        <Input
                            id="husbandCitizenship"
                            {...form.register('husbandCitizenship')}
                            aria-invalid={!!form.formState.errors.husbandCitizenship}
                        />
                        {form.formState.errors.husbandCitizenship && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandCitizenship.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="husbandCivilStatus">Civil Status *</Label>
                        <Select
                            onValueChange={(value) => setCivilStatus(value, 'husbandCivilStatus')}
                            defaultValue={form.watch('husbandCivilStatus')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                {civilStatusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.husbandCivilStatus && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandCivilStatus.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="husbandFather">Father&apos;s Name *</Label>
                        <Input
                            id="husbandFather"
                            {...form.register('husbandFather')}
                            aria-invalid={!!form.formState.errors.husbandFather}
                        />
                        {form.formState.errors.husbandFather && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandFather.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="husbandMother">Mother&apos;s Name *</Label>
                        <Input
                            id="husbandMother"
                            {...form.register('husbandMother')}
                            aria-invalid={!!form.formState.errors.husbandMother}
                        />
                        {form.formState.errors.husbandMother && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.husbandMother.message}
                            </p>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6">Wife&apos;s Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="wifeName">Full Name *</Label>
                        <Input
                            id="wifeName"
                            {...form.register('wifeName')}
                            aria-invalid={!!form.formState.errors.wifeName}
                        />
                        {form.formState.errors.wifeName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wifeDateOfBirthAge">Date of Birth/Age *</Label>
                        <Input
                            id="wifeDateOfBirthAge"
                            {...form.register('wifeDateOfBirthAge')}
                            aria-invalid={!!form.formState.errors.wifeDateOfBirthAge}
                            max={today}
                        />
                        {form.formState.errors.wifeDateOfBirthAge && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeDateOfBirthAge.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wifeCitizenship">Citizenship *</Label>
                        <Input
                            id="wifeCitizenship"
                            {...form.register('wifeCitizenship')}
                            aria-invalid={!!form.formState.errors.wifeCitizenship}
                        />
                        {form.formState.errors.wifeCitizenship && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeCitizenship.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wifeCivilStatus">Civil Status *</Label>
                        <Select
                            onValueChange={(value) => setCivilStatus(value, 'wifeCivilStatus')}
                            defaultValue={form.watch('wifeCivilStatus')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                {civilStatusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.wifeCivilStatus && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeCivilStatus.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wifeFather">Father&apos;s Name *</Label>
                        <Input
                            id="wifeFather"
                            {...form.register('wifeFather')}
                            aria-invalid={!!form.formState.errors.wifeFather}
                        />
                        {form.formState.errors.wifeFather && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeFather.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wifeMother">Mother&apos;s Name *</Label>
                        <Input
                            id="wifeMother"
                            {...form.register('wifeMother')}
                            aria-invalid={!!form.formState.errors.wifeMother}
                        />
                        {form.formState.errors.wifeMother && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.wifeMother.message}
                            </p>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-6">Marriage Details</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="dateOfMarriage">Date of Marriage *</Label>
                        <Input
                            id="dateOfMarriage"
                            type="date"
                            max={today}
                            {...form.register('dateOfMarriage')}
                            aria-invalid={!!form.formState.errors.dateOfMarriage}
                        />
                        {form.formState.errors.dateOfMarriage && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.dateOfMarriage.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="placeOfMarriage">Place of Marriage *</Label>
                        <Input
                            id="placeOfMarriage"
                            {...form.register('placeOfMarriage')}
                            aria-invalid={!!form.formState.errors.placeOfMarriage}
                        />
                        {form.formState.errors.placeOfMarriage && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.placeOfMarriage.message}
                            </p>
                        )}
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