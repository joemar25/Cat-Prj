// src/lib/types/navigation.ts
import { type IconsType } from '@/components/ui/icons'
import type { LucideIcon } from 'lucide-react'

// Base navigation item interface
export interface BaseNavigationItem {
    id: string
    title: string
    url: string
    iconName?: keyof IconsType
    notViewedCount?: number
}

// Main navigation item with possible sub-items
export interface NavigationItem extends BaseNavigationItem {
    type: 'main' | 'secondary'
    items?: Array<Omit<BaseNavigationItem, 'iconName' | 'type'>>
}

// Type aliases for better readability
export type NavConfig = NavigationItem
export type NavMainConfig = NavigationItem & { type: 'main' }
export type NavSecondaryConfig = NavigationItem & { type: 'secondary' }

// Transformed navigation item interfaces
export interface NavMainItem {
    title: string
    url: string
    icon?: LucideIcon
    items?: Array<{
        title: string
        url: string
        notViewedCount?: number
        click?: () => void
    }>
    notViewedCount?: number,
    click?: () => void
}

export interface NavSecondaryItem {
    title: string
    url: string
    icon?: LucideIcon
    notViewedCount?: number
    click?: () => void
}

// Navigation configuration interface
export interface NavigationConfiguration {
    mainNav: NavConfig[]
    secondaryNav: NavConfig[]
}

// Type guard for items with sub-items
export function hasSubItems(item: NavConfig): item is NavigationItem & { items: NonNullable<NavigationItem['items']> } {
    return 'items' in item && Array.isArray(item.items) && item.items.length > 0
}