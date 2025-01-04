// src/lib/stores/navigation.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hasSubItems } from '@/lib/types/navigation'
import { navigationConfig } from '@/lib/config/navigation'

interface NavigationState {
    visibleMainItems: string[]
    visibleSecondaryItems: string[]
    visibleSubItems: Record<string, string[]>
    showUserSection: boolean
    toggleMainItem: (id: string) => void
    toggleSecondaryItem: (id: string) => void
    toggleSubItem: (parentId: string, itemId: string) => void
    toggleUserSection: () => void
    resetToDefault: () => void
}

// Create initial state from config
const getDefaultMainItems = () => navigationConfig.mainNav.map(item => item.id)
const getDefaultSecondaryItems = () => navigationConfig.secondaryNav.map(item => item.id)
const getDefaultSubItems = () => {
    const subItems: Record<string, string[]> = {}
    navigationConfig.mainNav.forEach(item => {
        if (hasSubItems(item)) {
            // Initialize with all sub-items visible by default
            subItems[item.id] = item.items.map(subItem => subItem.id)
        }
    })
    return subItems
}

export const useNavigationStore = create<NavigationState>()(
    persist(
        (set) => ({
            visibleMainItems: getDefaultMainItems(),
            visibleSecondaryItems: getDefaultSecondaryItems(),
            visibleSubItems: getDefaultSubItems(),
            showUserSection: true,

            toggleMainItem: (id) =>
                set((state) => {
                    const isVisible = state.visibleMainItems.includes(id)
                    const newMainItems = isVisible
                        ? state.visibleMainItems.filter((item) => item !== id)
                        : [...state.visibleMainItems, id]

                    // If hiding a parent, also hide all its sub-items
                    const newSubItems = { ...state.visibleSubItems }
                    if (isVisible) {
                        delete newSubItems[id]
                    } else {
                        // When showing a parent, show all its sub-items by default
                        const mainItem = navigationConfig.mainNav.find(item => item.id === id)
                        if (mainItem && hasSubItems(mainItem)) {
                            newSubItems[id] = mainItem.items.map(subItem => subItem.id)
                        }
                    }

                    return {
                        visibleMainItems: newMainItems,
                        visibleSubItems: newSubItems,
                    }
                }),

            toggleSecondaryItem: (id) =>
                set((state) => ({
                    visibleSecondaryItems: state.visibleSecondaryItems.includes(id)
                        ? state.visibleSecondaryItems.filter((item) => item !== id)
                        : [...state.visibleSecondaryItems, id],
                })),

            toggleSubItem: (parentId, itemId) =>
                set((state) => {
                    // Ensure parent array exists
                    const currentSubItems = state.visibleSubItems[parentId] || []
                    const newSubItems = currentSubItems.includes(itemId)
                        ? currentSubItems.filter((item) => item !== itemId)
                        : [...currentSubItems, itemId]

                    return {
                        visibleSubItems: {
                            ...state.visibleSubItems,
                            [parentId]: newSubItems,
                        },
                    }
                }),

            toggleUserSection: () =>
                set((state) => ({
                    showUserSection: !state.showUserSection,
                })),

            resetToDefault: () =>
                set({
                    visibleMainItems: getDefaultMainItems(),
                    visibleSecondaryItems: getDefaultSecondaryItems(),
                    visibleSubItems: getDefaultSubItems(),
                    showUserSection: true,
                }),
        }),
        {
            name: 'navigation-storage',
        }
    )
)