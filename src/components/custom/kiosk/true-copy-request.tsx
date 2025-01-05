// src/components/kiosk/true-copy-request.tsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useKioskStore, DocumentType } from "@/state/use-kiosk-store"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function TrueCopyRequest() {
    const { setEmail, setSelectedDocuments, prevStep, completeTrueCopy } = useKioskStore()
    const [localEmail, setLocalEmail] = useState("")
    const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([])

    const documentTypes = [
        { value: "birth" as DocumentType, label: "Birth Certificate" },
        { value: "marriage" as DocumentType, label: "Marriage Certificate" },
        { value: "death" as DocumentType, label: "Death Certificate" }
    ]

    const handleDocSelect = (docType: DocumentType) => {
        setSelectedDocs(prev =>
            prev.includes(docType)
                ? prev.filter(d => d !== docType)
                : [...prev, docType]
        )
    }

    const handleSubmit = () => {
        if (localEmail && selectedDocs.length > 0) {
            setEmail(localEmail)
            setSelectedDocuments(selectedDocs)
            completeTrueCopy()
        }
    }

    return (
        <div className="max-w-md w-full p-6">
            <CardHeader>
                <CardTitle className="text-2xl">Request Certified Copy</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="font-medium text-lg">Select Documents</Label>
                    {documentTypes.map((doc) => (
                        <div key={doc.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={doc.value}
                                checked={selectedDocs.includes(doc.value)}
                                onCheckedChange={() => handleDocSelect(doc.value)}
                            />
                            <Label htmlFor={doc.value} className="text-lg">{doc.label}</Label>
                        </div>
                    ))}
                </div>

                <div>
                    <Label htmlFor="email" className="font-medium text-lg">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your registered email"
                        value={localEmail}
                        onChange={(e) => setLocalEmail(e.target.value)}
                        className="mt-2 text-lg"
                    />
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="text-lg">
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!localEmail || selectedDocs.length === 0}
                    className="text-lg"
                >
                    Request Copies
                </Button>
            </CardFooter>
        </div>
    )
}