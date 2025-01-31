// src/components/custom/civil-registry/actions/print-document-action.tsx
import { toast } from 'sonner'

interface PrintDocumentActionProps {
    documentUrl: string | null
    registryNumber: string
}

export function usePrintDocumentAction({ documentUrl }: PrintDocumentActionProps) {
    const handlePrintDocument = async () => {
        if (!documentUrl) {
            toast.error('No document available to print')
            return
        }

        try {
            const cleanUrl = documentUrl.startsWith('/') ? documentUrl.slice(1) : documentUrl
            const previewUrl = `/api/preview?path=${encodeURIComponent(cleanUrl)}`

            // Option 1: Open in new tab
            window.open(previewUrl, '_blank')

            // Option 2: If you prefer the print dialog directly
            // window.open(previewUrl, '_blank')?.print()

        } catch (error) {
            console.error('Document loading error:', error)
            toast.error('Failed to load document')
        }
    }

    return { handlePrintDocument }
}