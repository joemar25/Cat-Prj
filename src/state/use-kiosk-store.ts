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
    completeVerification: () => void
    completeTrueCopy: () => void

    /** Reset everything */
    resetFlow: () => void
}

export const useKioskStore = create(
    persist<KioskState>(
        (set) => ({
            currentStep: 1,
            service: null,
            userId: undefined,
            email: undefined,
            selectedDocuments: [],
            kioskNumber: undefined,

            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => {
                // If we're going back from the success step, go back to the form step
                if (state.currentStep === 3) {
                    return { currentStep: 2 }
                }
                // If we're going back from a form step, go back to service selection
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

            completeVerification: () => set(() => ({
                currentStep: 3 // Changed from 4 to 3
            })),

            completeTrueCopy: () => set(() => ({
                kioskNumber: Math.floor(Math.random() * 9000 + 1000),
                currentStep: 3 // Changed from 4 to 3
            })),

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