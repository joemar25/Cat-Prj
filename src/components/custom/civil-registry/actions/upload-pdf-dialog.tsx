'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImportPDFBirth } from '@/components/custom/modals/pdf-imports/import-pdf-birth'
import { ImportPDFDeath } from '@/components/custom/modals/pdf-imports/import-pdf-death'
import { ImportPDFMarriage } from '@/components/custom/modals/pdf-imports/import-pdf-marriage'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'


export function AddCivilRegistryFormDialogPdf() {
  const [open, setOpen] = useState(false)
  const [marriageCertificateOpen, setMarriageCertificateOpen] = useState(false)
  const [birthCertificateFormOpen, setBirthCertificateFormOpen] = useState(false)
  const [deathCertificateOpen, setDeathCertificateOpen] = useState(false)

  const handleFormSelect = (formType: string) => {
    setOpen(false)
    switch (formType) {
      //   case 'birth-annotation':
      //     setBirthFormOpen(true)
      //     break
      //   case 'death-annotation':
      //     setDeathFormOpen(true)
      //     break
      //   case 'marriage-annotation':
      //     setMarriageFormOpen(true)
      //     break
      case 'death-certificate':
        setDeathCertificateOpen(true)
        break
      case 'marriage-certificate':
        setMarriageCertificateOpen(true)
        break
      case 'live-birth-certificate':
        setBirthCertificateFormOpen(true)
        break
      default:
        break
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Icons.file className='mr-2 h-4 w-4' />
            Import PDF
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='text-center text-xl font-semibold'>
              Select Form Type
            </DialogTitle>
          </DialogHeader>

          <div className='flex gap-4'>
            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('live-birth-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Certificate of Live Birth
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Municipal Form No. 102)
                </p>
              </CardContent>
            </Card>
            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('death-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Certificate of Death
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Municipal Form No. 103)
                </p>
              </CardContent>
            </Card>

            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('marriage-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Certificate of Marriage
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Municipal Form No. 97)
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>


      <ImportPDFBirth open={birthCertificateFormOpen} onOpenChange={setBirthCertificateFormOpen} />
      <ImportPDFDeath open={deathCertificateOpen} onOpenChange={setDeathCertificateOpen} />
      <ImportPDFMarriage open={marriageCertificateOpen} onOpenChange={setMarriageCertificateOpen} />
    </>
  )
}