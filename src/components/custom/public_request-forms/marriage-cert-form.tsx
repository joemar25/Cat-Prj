'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from '@hookform/resolvers/zod'
import useDocumentStore from '@/state/use-document-store'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { marriageRequestSchema, type MarriageRequestData } from '@/lib/validation/forms/request'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function MarriageCertificateForm() {
    const router = useRouter()
    const { marriageFormData, setMarriageFormData, formErrors, setFormErrors, isSubmitting, setIsSubmitting } = useDocumentStore()

    const form = useForm<MarriageRequestData>({
        resolver: zodResolver(marriageRequestSchema.shape.data),
        defaultValues: {
            husbandName: marriageFormData.husbandName || "",
            wifeMaidenName: marriageFormData.wifeMaidenName || "",
            dateOfMarriage: marriageFormData.dateOfMarriage || "",
            placeOfMarriage: marriageFormData.placeOfMarriage || "",
            purpose: marriageFormData.purpose || "",
            requesterName: marriageFormData.requesterName || "",
            relationshipToOwner: marriageFormData.relationshipToOwner || "",
            contactNo: marriageFormData.contactNo || "",
            address: marriageFormData.address || "",
            copies: marriageFormData.copies || 1,
            feesPaid: marriageFormData.feesPaid || 0.0,
            orNumber: marriageFormData.orNumber || "",
            isRegisteredLate: marriageFormData.isRegisteredLate || false,
            lateRegistrationDate: marriageFormData.lateRegistrationDate || "",
            lcrNo: marriageFormData.lcrNo || "",
            bookNo: marriageFormData.bookNo || "",
            pageNo: marriageFormData.pageNo || "",
            searchedBy: marriageFormData.searchedBy || ""
        },
    })

    const onSubmit = async (formData: MarriageRequestData) => {
        try {
            setIsSubmitting(true)

            const validatedData = marriageRequestSchema.shape.data.parse({
                ...formData,
                copies: Number(formData.copies) || 1,
                feesPaid: Number(formData.feesPaid) || 0.0,
            })

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

    const today = new Date().toISOString().split('T')[0]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert>
                    <AlertDescription>
                        Please fill in all required fields marked with an asterisk (*).
                    </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Husband&apos;s Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="husbandName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h3 className="text-lg font-semibold mt-6">Wife&apos;s Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="wifeMaidenName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maiden Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h3 className="text-lg font-semibold mt-6">Marriage Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="dateOfMarriage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Marriage *</FormLabel>
                                    <FormControl>
                                        <Input type="date" max={today} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="placeOfMarriage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Place of Marriage *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h3 className="text-lg font-semibold mt-6">Request Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose of Request *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requesterName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requester&apos;s Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="relationshipToOwner"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relationship to Document Owner *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Complete Address *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="copies"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Copies *</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="feesPaid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fees Paid</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="orNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OR Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isRegisteredLate"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Is Registered Late?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lateRegistrationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Late Registration Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" max={today} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lcrNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LCR Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bookNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pageNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Page Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="searchedBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Searched By</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
        </Form>
    )
}