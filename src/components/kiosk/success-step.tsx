// src/components/kiosk/success-step.tsx
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKioskStore } from "@/state/use-kiosk-store"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function SuccessStep() {
    const {
        service,
        userId,
        email,
        kioskNumber,
        selectedDocuments,
        resetFlow
    } = useKioskStore()

    return (
        <Card className="max-w-md w-full p-6 text-center">
            <CardHeader>
                <CardTitle className="text-xl">Success!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-lg">
                    {service === "VERIFY"
                        ? "Your account has been verified successfully!"
                        : "Your certified copy request has been processed!"
                    }
                </p>

                <div className="p-4 rounded-lg">
                    <p className="text-sm mb-2">Your request has been added to the queue.</p>
                    {kioskNumber && (
                        <p className="text-xl font-bold">
                            Kiosk Number: <span className="text-blue-600">{kioskNumber}</span>
                        </p>
                    )}
                </div>

                <div className="text-left space-y-1">
                    {userId && (
                        <p>
                            <strong>User ID: </strong> {userId}
                        </p>
                    )}
                    {email && (
                        <p>
                            <strong>Email: </strong> {email}
                        </p>
                    )}
                    {service === 'TRUE_COPY' && selectedDocuments.length > 0 && (
                        <p>
                            <strong>Documents: </strong>
                            {selectedDocuments.map(doc =>
                                doc.charAt(0).toUpperCase() + doc.slice(1)
                            ).join(', ')}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
                <Button onClick={resetFlow}>Done</Button>
            </CardFooter>
        </Card>
    )
}