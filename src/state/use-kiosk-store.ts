// src/state/use-kiosk-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type KioskService = "trueCopy" | "verify" | null
export type DocumentType = "birth" | "marriage" | "death"

interface KioskState {
    currentStep: number
    service: KioskService
    userId?: string
    email?: string
    selectedDocuments: DocumentType[]
    kioskNumber?: number

    /** Step navigation */
    nextStep: () => void
    prevStep: () => void
    goToStep: (step: number) => void

    /** Data setters */
    setService: (service: KioskService) => void
    setUserId: (id: string) => void
    setEmail: (email: string) => void
    setSelectedDocuments: (docs: DocumentType[]) => void

    /** Complete flows */
    completeVerification: () => Promise<void>
    completeTrueCopy: () => Promise<void>

    /** Reset everything */
    resetFlow: () => void
}

export const useKioskStore = create(
    persist<KioskState>(
        (set, get) => ({
            currentStep: 1,
            service: null,
            userId: undefined,
            email: undefined,
            selectedDocuments: [],
            kioskNumber: undefined,

            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => {
                if (state.currentStep === 3) return { currentStep: 2 }
                if (state.currentStep === 2) {
                    return {
                        currentStep: 1,
                        service: null,
                        userId: undefined,
                        email: undefined,
                        selectedDocuments: []
                    }
                }
                return { currentStep: state.currentStep }
            }),
            goToStep: (step) => set(() => ({ currentStep: step })),

            setService: (service) => set(() => ({ service })),
            setUserId: (id) => set(() => ({ userId: id })),
            setEmail: (email) => set(() => ({ email })),
            setSelectedDocuments: (docs) => set(() => ({ selectedDocuments: docs })),

            completeVerification: async () => {
                const state = get()
                try {
                    await fetch('/api/queue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            serviceType: state.service,
                            userId: state.userId || null,
                            email: state.email || null,
                            documents: [],
                            status: 'waiting'
                        }),
                    })
                    set({ currentStep: 3 })
                } catch (error) {
                    console.error('Failed to create queue entry:', error)
                    // Still advance the step even if queue creation fails
                    set({ currentStep: 3 })
                }
            },

            completeTrueCopy: async () => {
                const state = get()
                try {
                    await fetch('/api/queue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            serviceType: state.service,
                            email: state.email || null,
                            documents: state.selectedDocuments,
                            status: 'waiting'
                        }),
                    })
                    set({
                        kioskNumber: Math.floor(Math.random() * 9000 + 1000),
                        currentStep: 3
                    })
                } catch (error) {
                    console.error('Failed to create queue entry:', error)
                    // Still advance the step even if queue creation fails
                    set({
                        kioskNumber: Math.floor(Math.random() * 9000 + 1000),
                        currentStep: 3
                    })
                }
            },

            resetFlow: () => set(() => ({
                currentStep: 1,
                service: null,
                userId: undefined,
                email: undefined,
                selectedDocuments: [],
                kioskNumber: undefined,
            })),
        }),
        {
            name: "kiosk-storage",
        }
    )
)