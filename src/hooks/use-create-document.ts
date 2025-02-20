// src/hooks/use-create-document.ts
import { AttachmentType, DocumentStatus } from '@prisma/client'

interface CreateDocumentInput {
    userId: string
    formId: string
    formType: string
    registryNumber: string
    fileUrl: string
    fileName: string
    fileSize: number
    mimeType: string
    type: AttachmentType
    title: string
    status?: DocumentStatus
}

const useCreateDocument = () => {
    const createDocument = async (input: CreateDocumentInput) => {
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            })

            if (!response.ok) {
                throw new Error('Failed to create document')
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error('Error creating document:', error)
            throw error
        }
    }

    return { createDocument }
}

export default useCreateDocument