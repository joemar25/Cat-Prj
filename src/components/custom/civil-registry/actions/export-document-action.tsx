import { toast } from 'sonner'

interface ExportDocumentActionProps {
    documentUrl: string | null
    registryNumber: string
}

export function useExportDocumentAction({ documentUrl, registryNumber }: ExportDocumentActionProps) {

    const handleExportDocument = async () => {
        if (!documentUrl) {
            return
        }

        const cleanUrl = documentUrl.startsWith('/') ? documentUrl.slice(1) : documentUrl
        const response = await fetch(`/api/download?path=${encodeURIComponent(cleanUrl)}`)
        const blob = await response.blob()

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const originalFileName = documentUrl.split('/').pop() || 'document.pdf'
        const fileName = `${registryNumber}_${timestamp}_${originalFileName}`

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast.success('File downloaded successfully')
    }

    return { handleExportDocument }
}