// src\components\custom\feedback\feedback-wordcloud.tsx
"use client"

import { TagCloud } from 'react-tagcloud'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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

interface Tag {
    value: string
    count: number
    props?: {
        title?: string
        style?: React.CSSProperties
    }
}

// Define vibrant colors for different categories
const COLOR_PALETTE = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Light Blue
    '#96CEB4', // Mint
    '#FFA07A', // Light Salmon
    '#88D8B0', // Light Green
    '#FF8C94', // Pink
    '#7FD1B9', // Sea Green
    '#FF9F1C', // Orange
    '#B39DDB', // Purple
    '#4CAF50', // Green
    '#9575CD', // Deep Purple
    '#4FC3F7', // Light Blue
    '#81C784', // Light Green
    '#FFB74D'  // Orange
]

const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'is', 'are', 'was', 'were', 'am', 'been', 'being', 'can', 'could'
])

const customRenderer = (tag: Tag, size: number) => {
    // Get a consistent color for each word based on its value
    const colorIndex = tag.value.length % COLOR_PALETTE.length
    const wordColor = COLOR_PALETTE[colorIndex]

    return (
        <span
            key={tag.value}
            style={{
                fontSize: `${size}px`,
                margin: '3px',
                padding: '3px',
                display: 'inline-block',
                color: wordColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
                fontWeight: tag.count > 5 ? 600 : 400,
                ...tag.props?.style,
            }}
            title={`${tag.value}: mentioned ${tag.count} times`}
            className="hover:scale-110 hover:brightness-110"
        >
            {tag.value}
        </span>
    )
}

const FeedbackWordCloud = ({ feedback }: { feedback: FeedbackItem[] }) => {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        const wordCount: Record<string, number> = {}

        feedback.forEach(item => {
            const text = item.feedback || ''
            const words = text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 2 && !STOP_WORDS.has(word))

            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1
            })
        })

        const tagData = Object.entries(wordCount)
            .map(([value, count]) => ({
                value,
                count,
                props: {
                    style: {
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }
                }
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 30)

        setTags(tagData)
    }, [feedback])

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                    Feedback Wordcloud
                    <span className="text-sm font-normal ml-2">
                        (From {feedback.length} responses)
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="min-h-[320px] flex items-center justify-center p-4">
                    {tags.length > 0 ? (
                        <TagCloud
                            minSize={18}
                            maxSize={48}
                            tags={tags}
                            className="text-center select-none"
                            renderer={customRenderer}
                            shuffle={true}
                            onClick={(tag: Tag) => {
                                console.log('Selected theme:', tag.value, 'mentioned', tag.count, 'times')
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default FeedbackWordCloud