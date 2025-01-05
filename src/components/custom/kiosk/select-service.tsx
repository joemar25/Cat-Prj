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
        setService("TRUE_COPY")
        goToStep(2)
    }

    const handleVerify = () => {
        setService("VERIFY")
        goToStep(2)
    }

    return (
        <div className="max-w-md w-full p-2">
            <CardHeader>
                <CardTitle className="text-3xl">Select Service</CardTitle> {/* Increased font size */}
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <p className="text-lg">Please choose the service you want to proceed with:</p> {/* Increased font size */}

                <Button onClick={handleTrueCopy}>Request True Copy</Button>
                <Button variant="outline" onClick={handleVerify}>
                    Verify Registration
                </Button>
            </CardContent>
        </div>
    )
}