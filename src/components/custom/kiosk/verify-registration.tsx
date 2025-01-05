// src/components/kiosk/verify-registration.tsx
"use client"

import { useState } from "react"
import { AlertCircle, User as UserIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useKioskStore } from "@/state/use-kiosk-store"

import type { User } from "@prisma/client"

export type UserDetails = Pick<User, "id" | "name" | "email" | "createdAt">

export function VerifyRegistration() {
    const { setUserId, prevStep, completeVerification } = useKioskStore()
    const [userId, setLocalUserId] = useState("")
    const [confirmed, setConfirmed] = useState(false)
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [error, setError] = useState("")

    const handleVerify = async () => {
        try {
            // Here you would fetch user details from your backend
            // For demo, we'll simulate it with proper types
            const mockUserDetails: UserDetails = {
                id: userId,
                name: "John Doe",
                email: "john@example.com",
                createdAt: new Date("2024-01-15")
            }

            setUserDetails(mockUserDetails)
            setUserId(userId)
            setConfirmed(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred"
            setError(`Invalid user ID. Please try again. ${errorMessage}`)
        }
    }

    const handleConfirm = () => {
        completeVerification()
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    return (
        <Card className="max-w-md w-full p-6">
            <CardHeader>
                <CardTitle className="text-xl">Account Verification</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {!confirmed ? (
                    <>
                        <div>
                            <Label htmlFor="userId" className="font-medium">
                                User ID
                            </Label>
                            <Input
                                id="userId"
                                placeholder="Enter your user ID"
                                value={userId}
                                onChange={(e) => setLocalUserId(e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Account Verification</AlertTitle>
                            <AlertDescription>
                                Please enter your user ID to verify your account details.
                            </AlertDescription>
                        </Alert>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </>
                ) : userDetails && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <UserIcon className="w-12 h-12 text-blue-500" />
                            <div>
                                <h3 className="font-bold">{userDetails.name}</h3>
                                <p className="text-sm text-gray-500">{userDetails.email}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <p>
                                <strong>Registration Date: </strong>
                                {formatDate(userDetails.createdAt)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Please confirm if these details are correct.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                    Back
                </Button>
                {!confirmed ? (
                    <Button
                        onClick={handleVerify}
                        disabled={!userId}
                    >
                        Verify
                    </Button>
                ) : (
                    <Button onClick={handleConfirm}>
                        Confirm & Finish
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}