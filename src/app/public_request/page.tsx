// src/app/public_request/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { FormType } from '@prisma/client'
import useDocumentStore from '@/state/use-document-store'
import DeathCertificateForm from '@/components/custom/public_request_forms/death_cert_form'
import BirthCertificateForm from '@/components/custom/public_request_forms/birth_cert_form'
import MarriageCertificateForm from '@/components/custom/public_request_forms/marriage_cert_form'

export default function DocumentRequestForm() {
    const { selectedFormType, setSelectedFormType } = useDocumentStore()

    const handleFormSelection = (value: FormType) => {
        setSelectedFormType(value)
    }

    const FormRenderer = () => {
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
                                onClick={() => setSelectedFormType(null)}
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