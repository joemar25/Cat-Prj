'use client'

import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import FeedbackUserChart from './feedback-user-chart'
import FeedbackWordCloud from './feedback-wordcloud'

interface FeedbackItem {
    id: string
    feedback: string
    content?: string
    submittedBy: string | null
    createdAt: Date
    updatedAt: Date
    submitterName: string | null
    user: {
        name: string | null
        email: string | null
        image: string | null
    } | null
}

const FeedbackHeader = ({ feedback }: { feedback: FeedbackItem[] }) => {
    const { t } = useTranslation()

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FeedbackWordCloud feedback={feedback} />
                <FeedbackUserChart feedback={feedback} />
            </div>
        </>
    )
}

export default FeedbackHeader
