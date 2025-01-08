'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { BirthAnnotationForm } from '../../forms/annotations/birth-annotation-form';
import DeathAnnotationForm from '../../forms/annotations/death-annotation-form';
import MarriageAnnotationForm from '../../forms/annotations/marriage-annotation-form';

// import { BirthRegistrationForm } from './birth-registration-form';
// import { DeathCertificateForm } from './death-certificate-form';
// import { DeathRegistrationForm } from './death-registration-form';
// import { LiveBirthCertificateForm } from './live-birth-certificate-form';
// import { MarriageCertificateForm } from './marriage-certificate-form';
// import { MarriageRegistrationForm } from './marriage-registration-form';

export function FormDialog() {
  const [open, setOpen] = useState(false);
  const [birthFormOpen, setBirthFormOpen] = useState(false);
  const [deathFormOpen, setDeathFormOpen] = useState(false);
  const [marriageFormOpen, setMarriageFormOpen] = useState(false);
  // const [deathCertificateOpen, setDeathCertificateOpen] = useState(false);
  //   const [marriageCertificateOpen, setMarriageCertificateOpen] = useState(false);
  // const [birthCertificateFormOpen, setBirthCertificateFormOpen] =
  //   useState(false);

  const handleFormSelect = (formType: string) => {
    setOpen(false);
    switch (formType) {
      case 'birth-annotation':
        setBirthFormOpen(true);
        break;
      case 'death-annotation':
        setDeathFormOpen(true);
        break;
      case 'marriage-annotation':
        setMarriageFormOpen(true);
        break;
      case 'death-certificate':
        // setDeathCertificateOpen(true);
        break;
      case 'marriage-certificate':
        // setMarriageCertificateOpen(true);
        break;
      case 'live-birth-certificate':
        // setBirthCertificateFormOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Create New Form
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

          <Separator className='my-2' />

          <div className='flex gap-4'>
            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('birth-annotation')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Civil Registry Form No. 1A
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Birth Available)
                </p>
              </CardContent>
            </Card>

            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('death-annotation')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Civil Registry Form No. 2A
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Death Available)
                </p>
              </CardContent>
            </Card>

            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('marriage-annotation')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  Civil Registry Form No. 3A
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  (Marriage Available)
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Separate form dialogs */}
      <BirthAnnotationForm
        open={birthFormOpen}
        onOpenChange={setBirthFormOpen}
        onCancel={() => {
          setBirthFormOpen(false);
          setTimeout(() => setOpen(true), 0);
        }}
      />

      {/* Death Annotation Form */}
      <DeathAnnotationForm
        open={deathFormOpen}
        onOpenChange={setDeathFormOpen}
        onCancel={() => {
          setDeathFormOpen(false);
          setTimeout(() => setOpen(true), 0);
        }}
      />

      <MarriageAnnotationForm
        open={marriageFormOpen}
        onOpenChange={setMarriageFormOpen}
        onCancel={() => {
          setMarriageFormOpen(false);
          setTimeout(() => setOpen(true), 0);
        }}
      />
    </>
  );
}
