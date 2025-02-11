'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ImportPDFBirthProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportPDFMarriage({ open, onOpenChange }: ImportPDFBirthProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Handle drag over the drop area
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Handle clicking the drop area to trigger file input
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Handle dragging the PDF preview
  const handleDragStart = (event: React.DragEvent<HTMLIFrameElement>) => {
    event.dataTransfer.setData('text/plain', '')
  }

  const handleDrag = (event: React.DragEvent<HTMLIFrameElement>) => {
    const rect = dropRef.current?.getBoundingClientRect()
    if (rect) {
      // Ensure the iframe stays within the bounds of the drop area
      const newX = event.clientX - rect.left - 150
      const newY = event.clientY - rect.top - 200

      setPreviewPosition({
        x: Math.max(0, Math.min(newX, rect.width - 300)),
        y: Math.max(0, Math.min(newY, rect.height - 400)),
      })
    }
  }

  // Reset the state when cancel is clicked
  const handleCancel = () => {
    setPdfFile(null)
    setPreviewUrl(null)
    setPreviewPosition({ x: 0, y: 0 })
    setIsDragging(false)
    onOpenChange(false)
  }

  // Handle the import action
  const handleImport = () => {
    if (pdfFile) {
      // Perform the import action here (e.g., upload the file)
      console.log('Importing PDF:', pdfFile.name)
      onOpenChange(false)
    } else {
      alert('Please select a PDF file to import.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-semibold'>
            Upload PDF Certificate of Marriage
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-center justify-center p-4'>
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => setIsDragging(false)}
            onClick={handleClick}
            style={{
              position: 'relative',
              width: '100%',
              height: '500px',
              border: `2px dashed ${isDragging ? '#3b82f6' : '#ccc'}`,
              backgroundColor: isDragging ? '#f0f9ff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {previewUrl ? (
              <iframe
                src={previewUrl}
                draggable
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                style={{
                  position: 'absolute',
                  left: previewPosition.x,
                  top: previewPosition.y,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  cursor: 'move',
                }}
              />
            ) : (
              <p className='text-center text-gray-500'>
                Drag and drop a PDF file here or click to upload
              </p>
            )}
            <input
              type='file'
              accept='application/pdf'
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          <div className='mt-4 flex justify-end gap-2'>
            <Button variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}