// src/state/use-document-store.ts
import { create } from 'zustand'
import { FormType } from '@prisma/client'
import type {
    BirthRequestData,
    DeathRequestData,
    MarriageRequestData
} from '@/lib/validation/request_form'

interface DocumentStore {
    selectedFormType: FormType | null
    setSelectedFormType: (formType: FormType | null) => void

    birthFormData: Partial<BirthRequestData>
    deathFormData: Partial<DeathRequestData>
    marriageFormData: Partial<MarriageRequestData>

    setBirthFormData: (data: Partial<BirthRequestData>) => void
    setDeathFormData: (data: Partial<DeathRequestData>) => void
    setMarriageFormData: (data: Partial<MarriageRequestData>) => void

    formErrors: Record<string, string>
    setFormErrors: (errors: Record<string, string>) => void

    isSubmitting: boolean
    setIsSubmitting: (status: boolean) => void

    resetStore: () => void
}

const useDocumentStore = create<DocumentStore>((set) => ({
    selectedFormType: null,
    setSelectedFormType: (formType) => set({ selectedFormType: formType }),

    birthFormData: {},
    deathFormData: {},
    marriageFormData: {},

    setBirthFormData: (data) => set({ birthFormData: data }),
    setDeathFormData: (data) => set({ deathFormData: data }),
    setMarriageFormData: (data) => set({ marriageFormData: data }),

    formErrors: {},
    setFormErrors: (errors) => set({ formErrors: errors }),

    isSubmitting: false,
    setIsSubmitting: (status) => set({ isSubmitting: status }),

    resetStore: () => set({
        selectedFormType: null,
        birthFormData: {},
        deathFormData: {},
        marriageFormData: {},
        formErrors: {},
        isSubmitting: false
    })
}))

export default useDocumentStore