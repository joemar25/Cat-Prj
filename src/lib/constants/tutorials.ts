// src/lib/constants/tutorials.ts

import { Permission } from '@prisma/client'
import { IconsType } from '@/components/ui/icons'
import tutorialsData from '@/lib/jsons/tutorials.json'

export interface TutorialMedia {
    type: 'gif' | 'image' | 'video'
    src: string
    description?: string
    additionalNotes?: string
}

export interface TutorialStep {
    id: number
    title: string
    description: string
    media?: TutorialMedia[]
}

export interface TutorialCategory {
    category: string
    icon?: keyof IconsType
    requiredPermissions?: Permission[]
    tutorials: TutorialStep[]
}

export const TUTORIALS: TutorialCategory[] = tutorialsData as TutorialCategory[]