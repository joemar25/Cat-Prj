'use client'

import { toast } from "sonner"
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackFormProps {
    userId: string
    onSubmitAction: () => Promise<void>
}

export function FeedbackForm({ userId, onSubmitAction }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!feedback.trim()) {
            toast.error("Feedback cannot be empty.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feedback, userId }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit feedback')
            }

            const result = await response.json()

            if (result.success) {
                toast.success(result.message || "Feedback submitted successfully!")
                setFeedback("")
                await onSubmitAction()
            } else {
                toast.error(result.error || "Failed to submit feedback.")
            }
        } catch (error) {
            console.error("Failed to submit feedback:", error)
            toast.error("An unexpected error occurred.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <p className="text-muted-foreground">
                Help us improve by sharing your thoughts and suggestions.
            </p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-base font-medium">
                        Your Feedback
                    </Label>
                    <Textarea
                        id="feedback"
                        placeholder="What's on your mind?"
                        className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Feedback
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}