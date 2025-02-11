'use client'

import { toast } from "sonner"
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackFormProps {
    userId: string
    onSubmitAction: () => Promise<void>
}

export function FeedbackForm({ userId, onSubmitAction }: FeedbackFormProps) {
    const { t } = useTranslation()
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!feedback.trim()) {
            toast.error(t("feedbacks.emptyError"))
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
                toast.success(result.message || t("feedbacks.success"))
                setFeedback("")
                await onSubmitAction()
            } else {
                toast.error(result.error || t("feedbacks.submitError"))
            }
        } catch (error) {
            console.error("Failed to submit feedback:", error)
            toast.error(t("feedbacks.unexpectedError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <p className="text-muted-foreground">
                {t("feedbacks.helpText")}
            </p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-base font-medium">
                        {t("feedbacks.label")}
                    </Label>
                    <Textarea
                        id="feedback"
                        placeholder={t("feedbacks.placeholder")}
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
                            {t("feedbacks.submitting")}
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("feedbacks.submit")}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
