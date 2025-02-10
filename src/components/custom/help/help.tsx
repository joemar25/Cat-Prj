'use client'

import { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons, IconsType } from '@/components/ui/icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TUTORIALS, TutorialCategory, TutorialStep, TutorialMedia } from '@/lib/constants/tutorials'
import { hasAllPermissions } from '@/types/auth'
import { Permission } from '@prisma/client'

export function HelpTutorials({ userPermissions }: { userPermissions: Permission[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedStep, setSelectedStep] = useState<TutorialStep | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const canAccessCategory = (requiredPermissions?: Permission[]) => {
        if (!requiredPermissions) return true
        return hasAllPermissions(userPermissions, requiredPermissions)
    }

    return (
        <div className="flex-1 p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Help Documentation</h1>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <Skeleton key={idx} className="h-24 w-full rounded-md" />
                    ))}
                </div>
            ) : selectedStep ? (
                <div className="space-y-4">
                    <Button variant="outline" onClick={() => setSelectedStep(null)} className="text-sm">
                        ← Back to {selectedCategory}
                    </Button>

                    <Card className="border">
                        <CardHeader>
                            <CardTitle className="text-xl">{selectedStep.title}</CardTitle>
                            <CardDescription>{selectedStep.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedStep.media?.map((media: TutorialMedia, idx) => (
                                <div key={idx} className="rounded overflow-hidden max-w-md mx-auto space-y-2">
                                    {media.description && (
                                        <div className="text-center font-medium text-lg">{idx + 1}. {media.description}</div>
                                    )}
                                    {media.type === 'image' || media.type === 'gif' ? (
                                        <img src={media.src} alt={media.description || selectedStep.title} className="w-full object-cover rounded-md" />
                                    ) : media.type === 'video' ? (
                                        <video controls className="w-full rounded-md">
                                            <source src={media.src} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : null}
                                    {media.additionalNotes && (
                                        <p className="text-xs text-gray-500 text-center">{media.additionalNotes}</p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            ) : selectedCategory ? (
                <div className="space-y-4">
                    <Button variant="outline" onClick={() => setSelectedCategory(null)} className="text-sm">
                        ← Back to Categories
                    </Button>

                    <h2 className="text-2xl font-medium">{selectedCategory}</h2>

                    <div className="space-y-2">
                        {TUTORIALS.find(cat => cat.category === selectedCategory)?.tutorials.map((tutorial: TutorialStep) => (
                            <Card
                                key={tutorial.id}
                                className="cursor-pointer border p-4 transition hover:shadow-md"
                                onClick={() => setSelectedStep(tutorial)}
                            >
                                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                                <CardDescription>{tutorial.description}</CardDescription>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TUTORIALS.filter(category => canAccessCategory(category.requiredPermissions)).map((category: TutorialCategory) => {
                        const IconComponent = category.icon && (Icons[category.icon as keyof IconsType] as LucideIcon)
                        return (
                            <Card
                                key={category.category}
                                className="cursor-pointer border p-4 transition hover:shadow-md"
                                onClick={() => setSelectedCategory(category.category)}
                            >
                                <CardHeader className="flex items-center justify-center space-y-2">
                                    {IconComponent && (
                                        <IconComponent className="w-8 h-8" />
                                    )}
                                    <CardTitle className="text-center text-lg">{category.category}</CardTitle>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
