// src\components\kiosk\select-service.tsx
"use client"

import { Button } from "@/components/ui/button"
import { useKioskStore } from "@/state/use-kiosk-store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

/**
 * Step 1: Let the user pick which service they want to do:
 * - "Request True Copy"
 * - "Verify Registration"
 *
 * We'll set store.service accordingly, then jump to step 2 or 3.
 */
export function SelectServiceStep() {
    const { goToStep, setService } = useKioskStore()

    const handleTrueCopy = () => {
        setService("trueCopy")
        goToStep(2)
    }

    const handleVerify = () => {
        setService("verify")
        goToStep(2) // Changed from 3 to 2
    }

    return (
        <Card className="max-w-md w-full p-6">
            <CardHeader>
                <CardTitle className="text-xl">Select Service</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <p>Please choose the service you want to proceed with:</p>

                <Button onClick={handleTrueCopy}>Request True Copy</Button>
                <Button variant="outline" onClick={handleVerify}>
                    Verify Registration
                </Button>
            </CardContent>
        </Card>
    )
}