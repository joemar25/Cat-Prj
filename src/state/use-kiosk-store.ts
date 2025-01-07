

// src/state/use-kiosk-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KioskService = 'TRUE_COPY' | 'VERIFY' | null;
export type DocumentType = 'birth' | 'marriage' | 'death';

interface KioskState {
    currentStep: number;
    service: KioskService;
    userId?: string;
    email?: string;
    selectedDocuments: DocumentType[];
    kioskNumber?: number;
    queueId?: string;

    /** Step navigation */
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;

    /** Data setters */
    setService: (service: KioskService) => void;
    setUserId: (id: string) => void;
    setEmail: (email: string) => void;
    setSelectedDocuments: (docs: DocumentType[]) => void;

    /** Complete flows */
    completeVerification: () => Promise<void>;
    completeTrueCopy: () => Promise<void>;

    /** Reset everything */
    resetFlow: () => void;
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
            queueId: undefined,

            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => {
                if (state.currentStep === 3) {
                    // When going back from success step, don't reset everything
                    return {
                        currentStep: 2,
                        kioskNumber: undefined,
                        queueId: undefined
                    };
                }
                if (state.currentStep === 2) {
                    return {
                        currentStep: 1,
                        service: null,
                        userId: undefined,
                        email: undefined,
                        selectedDocuments: [],
                        kioskNumber: undefined,
                        queueId: undefined
                    };
                }
                return { currentStep: state.currentStep };
            }),
            goToStep: (step) => set(() => ({ currentStep: step })),

            setService: (service) => set(() => ({ service })),
            setUserId: (id) => set(() => ({ userId: id })),
            setEmail: (email) => set(() => ({ email })),
            setSelectedDocuments: (docs) => set(() => ({ selectedDocuments: docs })),

            completeTrueCopy: async () => {
                const state = get();
                try {
                    const response = await fetch('/api/queue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            serviceType: 'TRUE_COPY',
                            email: state.email || undefined,
                            documents: state.selectedDocuments,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to create queue entry');
                    }

                    const data = await response.json();

                    set({
                        kioskNumber: data.kioskNumber,
                        currentStep: 3,
                        queueId: data.id
                    });
                } catch (error) {
                    console.error('True Copy queue creation error:', error);
                    alert(error instanceof Error ? error.message : 'Failed to create queue entry');
                    set({
                        kioskNumber: undefined,
                        currentStep: 3,
                        queueId: undefined
                    });
                }
            },

            completeVerification: async () => {
                const state = get();
                try {
                    const response = await fetch('/api/queue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            serviceType: 'VERIFY',
                            userId: state.userId || undefined,
                            email: state.email || undefined,
                            documents: [],
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to create queue entry');
                    }

                    const data = await response.json();

                    set({
                        currentStep: 3,
                        kioskNumber: data.kioskNumber,
                        queueId: data.id
                    });
                } catch (error) {
                    console.error('Verification queue creation error:', error);
                    alert(error instanceof Error ? error.message : 'Failed to create queue entry');
                    set({
                        currentStep: 3,
                        kioskNumber: undefined,
                        queueId: undefined
                    });
                }
            },

            resetFlow: () => set(() => ({
                currentStep: 1,
                service: null,
                userId: undefined,
                email: undefined,
                selectedDocuments: [],
                kioskNumber: undefined,
                queueId: undefined,
            })),
        }),
        {
            name: "kiosk-storage", // Name for the persisted storage
        }
    )
);












// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// export type KioskService = 'TRUE_COPY' | 'VERIFY' | null
// export type DocumentType = 'birth' | 'marriage' | 'death'

// interface KioskState {
//     currentStep: number
//     service: KioskService
//     userId?: string
//     email?: string
//     selectedDocuments: DocumentType[]
//     kioskNumber?: number
//     queueId?: string

//     /** Step navigation */
//     nextStep: () => void
//     prevStep: () => void
//     goToStep: (step: number) => void

//     /** Data setters */
//     setService: (service: KioskService) => void
//     setUserId: (id: string) => void
//     setEmail: (email: string) => void
//     setSelectedDocuments: (docs: DocumentType[]) => void

//     /** Complete flows */
//     completeVerification: () => Promise<void>
//     completeTrueCopy: () => Promise<void>

//     /** Reset everything */
//     resetFlow: () => void
// }

// export const useKioskStore = create(
//     persist<KioskState>(
//         (set, get) => ({
//             currentStep: 1,
//             service: null,
//             userId: undefined,
//             email: undefined,
//             selectedDocuments: [],
//             kioskNumber: undefined,
//             queueId: undefined,

//             nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
//             prevStep: () => set((state) => {
//                 if (state.currentStep === 3) {
//                     // When going back from success step, don't reset everything
//                     return {
//                         currentStep: 2,
//                         kioskNumber: undefined,
//                         queueId: undefined
//                     }
//                 }
//                 if (state.currentStep === 2) {
//                     return {
//                         currentStep: 1,
//                         service: null,
//                         userId: undefined,
//                         email: undefined,
//                         selectedDocuments: [],
//                         kioskNumber: undefined,
//                         queueId: undefined
//                     }
//                 }
//                 return { currentStep: state.currentStep }
//             }),
//             goToStep: (step) => set(() => ({ currentStep: step })),

//             setService: (service) => set(() => ({ service })),
//             setUserId: (id) => set(() => ({ userId: id })),
//             setEmail: (email) => set(() => ({ email })),
//             setSelectedDocuments: (docs) => set(() => ({ selectedDocuments: docs })),

//             completeTrueCopy: async () => {
//                 const state = get()
//                 try {
//                     const response = await fetch('/api/queue', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             serviceType: 'TRUE_COPY',
//                             email: state.email || undefined,
//                             documents: state.selectedDocuments,
//                         }),
//                     })

//                     if (!response.ok) {
//                         const errorData = await response.json()
//                         throw new Error(errorData.error || 'Failed to create queue entry')
//                     }

//                     const data = await response.json()

//                     set({
//                         kioskNumber: data.kioskNumber,
//                         currentStep: 3,
//                         queueId: data.id
//                     })
//                 } catch (error) {
//                     console.error('True Copy queue creation error:', error)
//                     alert(error instanceof Error ? error.message : 'Failed to create queue entry')
//                     set({
//                         kioskNumber: undefined,
//                         currentStep: 3,
//                         queueId: undefined
//                     })
//                 }
//             },

//             completeVerification: async () => {
//                 const state = get()
//                 try {
//                     const response = await fetch('/api/queue', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             serviceType: 'VERIFY',
//                             userId: state.userId || undefined,
//                             email: state.email || undefined,
//                             documents: [],
//                         }),
//                     })

//                     if (!response.ok) {
//                         const errorData = await response.json()
//                         throw new Error(errorData.error || 'Failed to create queue entry')
//                     }

//                     const data = await response.json()

//                     set({
//                         currentStep: 3,
//                         kioskNumber: data.kioskNumber,
//                         queueId: data.id
//                     })
//                 } catch (error) {
//                     console.error('Verification queue creation error:', error)
//                     alert(error instanceof Error ? error.message : 'Failed to create queue entry')
//                     set({
//                         currentStep: 3,
//                         kioskNumber: undefined,
//                         queueId: undefined
//                     })
//                 }
//             },

//             resetFlow: () => set(() => ({
//                 currentStep: 1,
//                 service: null,
//                 userId: undefined,
//                 email: undefined,
//                 selectedDocuments: [],
//                 kioskNumber: undefined,
//                 queueId: undefined,
//             })),
//         }),
//         {
//             name: "kiosk-storage",
//         }
//     )
// )