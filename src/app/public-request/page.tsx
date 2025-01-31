// src/app/public-request/page.tsx
'use client'

import { useEffect } from 'react'
import { FormType } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useDocumentStore from '@/state/use-document-store'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import DeathCertificateForm from '@/components/custom/public-request-forms/death-cert-form'
import BirthCertificateForm from '@/components/custom/public-request-forms/birth-cert-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MarriageCertificateForm from '@/components/custom/public-request-forms/marriage-cert-form'

export default function DocumentRequestForm() {
    const { selectedFormType, setSelectedFormType } = useDocumentStore()

    useEffect(() => {
        console.log('Current selected form type:', selectedFormType)
    }, [selectedFormType])

    const handleFormSelection = (value: FormType) => {
        console.log('Form type selected:', value)
        setSelectedFormType(value)
    }

    const FormRenderer = () => {
        console.log('Rendering form for type:', selectedFormType)
        switch (selectedFormType) {
            case 'BIRTH':
                return <BirthCertificateForm />
            case 'DEATH':
                return <DeathCertificateForm />
            case 'MARRIAGE':
                return <MarriageCertificateForm />
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Request Certified True Copy</CardTitle>
                    <CardDescription>
                        Please select the type of document you would like to request
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!selectedFormType ? (
                        <div className="space-y-6">
                            <RadioGroup
                                value={selectedFormType ?? undefined}
                                onValueChange={handleFormSelection}
                                className="space-y-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="BIRTH" id="birth" />
                                    <Label htmlFor="birth">Birth Certificate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="DEATH" id="death" />
                                    <Label htmlFor="death">Death Certificate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="MARRIAGE" id="marriage" />
                                    <Label htmlFor="marriage">Marriage Certificate</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    ) : (
                        <>
                            <Button
                                onClick={() => {
                                    console.log('Returning to form selection')
                                    setSelectedFormType(null)
                                }}
                                variant="outline"
                                className="mb-6"
                            >
                                Back to Form Selection
                            </Button>
                            <FormRenderer />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}