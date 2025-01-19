// src/components/custom/public_request_forms/death_cert_form.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDocumentStore from '@/state/use-document-store'
import { deathRequestSchema, type DeathRequestData } from '@/lib/validation/forms/request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const civilStatusOptions = ['SINGLE', 'MARRIED', 'WIDOWED', 'SEPARATED'] as const

export default function DeathCertificateForm() {
    const router = useRouter()
    const { deathFormData, setDeathFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting } = useDocumentStore()

    const form = useForm<DeathRequestData>({
        resolver: zodResolver(deathRequestSchema.shape.data),
        defaultValues: deathFormData
    })

    const onSubmit = async (formData: DeathRequestData) => {
        try {
            setIsSubmitting(true)
            const validatedData = deathRequestSchema.shape.data.parse(formData)

            const payload = {
                type: 'DEATH' as const,
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
            setDeathFormData({})
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

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert>
                <AlertDescription>
                    Please fill in all required fields marked with an asterisk (*).
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deceased&apos;s Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nameOfDeceased">Full Name *</Label>
                        <Input
                            id="nameOfDeceased"
                            {...form.register('nameOfDeceased')}
                            aria-invalid={!!form.formState.errors.nameOfDeceased}
                        />
                        {form.formState.errors.nameOfDeceased && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.nameOfDeceased.message}
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
                        <Label htmlFor="age">Age *</Label>
                        <Input
                            id="age"
                            type="number"
                            {...form.register('age', {
                                valueAsNumber: true,
                                min: { value: 0, message: 'Age must be a positive number' }
                            })}
                            aria-invalid={!!form.formState.errors.age}
                        />
                        {form.formState.errors.age && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.age.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="civilStatus">Civil Status *</Label>
                        <Select
                            onValueChange={(value) => form.setValue('civilStatus', value as typeof civilStatusOptions[number])}
                            defaultValue={form.watch('civilStatus')}
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
                        {form.formState.errors.civilStatus && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.civilStatus.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="citizenship">Citizenship *</Label>
                        <Input
                            id="citizenship"
                            {...form.register('citizenship')}
                            aria-invalid={!!form.formState.errors.citizenship}
                        />
                        {form.formState.errors.citizenship && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.citizenship.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfDeath">Date of Death *</Label>
                        <Input
                            id="dateOfDeath"
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            {...form.register('dateOfDeath')}
                            aria-invalid={!!form.formState.errors.dateOfDeath}
                        />
                        {form.formState.errors.dateOfDeath && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.dateOfDeath.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="placeOfDeath">Place of Death *</Label>
                        <Input
                            id="placeOfDeath"
                            {...form.register('placeOfDeath')}
                            aria-invalid={!!form.formState.errors.placeOfDeath}
                        />
                        {form.formState.errors.placeOfDeath && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.placeOfDeath.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="causeOfDeath">Cause of Death *</Label>
                        <Input
                            id="causeOfDeath"
                            {...form.register('causeOfDeath')}
                            aria-invalid={!!form.formState.errors.causeOfDeath}
                        />
                        {form.formState.errors.causeOfDeath && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.causeOfDeath.message}
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