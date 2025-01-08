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
import { Plus } from 'lucide-react';
import * as React from 'react';
import { BirthRegistrationForm } from './birth-registration-form';

export function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [birthFormOpen, setBirthFormOpen] = React.useState(false);

  const handleFormSelect = (formType: string) => {
    setOpen(false);
    switch (formType) {
      case 'birth':
        setBirthFormOpen(true);
        break;
      case 'death':
        break;
      case 'marriage':
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
              onClick={() => handleFormSelect('birth')}
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
              onClick={() => handleFormSelect('death')}
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
              onClick={() => handleFormSelect('marriage')}
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
      <BirthRegistrationForm
        open={birthFormOpen}
        onOpenChange={setBirthFormOpen}
      />
    </>
  );
}
