'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface DeathAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

const DeathAnnotationForm: React.FC<DeathAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Death Annotation Form
          </DialogTitle>
        </DialogHeader>
        <div className='container mx-auto p-4'>
          <Card className='w-full max-w-3xl mx-auto bg-background text-foreground border dark:border-border'>
            <CardContent className='p-6 space-y-6'>
              {/* Header */}
              <div className='relative'>
                <h2 className='text-lg font-medium'>TO WHOM IT MAY CONCERN:</h2>
                <p className='absolute top-0 right-0'>{currentDate}</p>
                <p className='mt-2'>
                  We certify that, among others, the following facts of death
                  appear in our Register of Death on
                </p>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <div className='space-y-1'>
                    <Label>Page number</Label>
                    <Input />
                  </div>
                  <div className='space-y-1'>
                    <Label>of Book number</Label>
                    <Input />
                  </div>
                </div>
              </div>

              {/* Main Form Fields */}
              <div className='space-y-4'>
                {[
                  { label: 'Registry Number', type: 'text' },
                  { label: 'Date of Registration', type: 'date' },
                  { label: 'Name of Deceased', type: 'text' },
                  { label: 'Sex', type: 'text' },
                  { label: 'Age', type: 'number' },
                  { label: 'Civil Status', type: 'text' },
                  { label: 'Citizenship', type: 'text' },
                  { label: 'Date of Death', type: 'date' },
                  { label: 'Place of Death', type: 'text' },
                  { label: 'Cause of Death', type: 'text' },
                ].map((field, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-[150px_1fr] gap-4 items-center'
                  >
                    <Label className='font-medium'>{field.label}</Label>
                    <Input type={field.type} />
                  </div>
                ))}
              </div>

              {/* Certification Section */}
              <div className='space-y-4 pt-4'>
                <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                  <p>This certification is issued to</p>
                  <Input />
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                  <p>upon his/her request for</p>
                  <Input />
                </div>
              </div>

              {/* Signature Section */}
              <div className='grid grid-cols-2 gap-8 pt-8'>
                <div className='space-y-8'>
                  <div className='space-y-4'>
                    <p className='font-medium'>Prepared By</p>
                    <div className='space-y-1'>
                      <Input
                        className='text-center'
                        placeholder='Name and Signature'
                      />
                      <Input className='text-center' placeholder='Position' />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <p className='font-medium'>Verified By</p>
                    <div className='space-y-1'>
                      <Input
                        className='text-center'
                        placeholder='Name and Signature'
                      />
                      <Input className='text-center' placeholder='Position' />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-end'>
                  <p className='font-medium text-center'>
                    PRISCILLA L. GALICIA
                  </p>
                  <p className='text-sm text-center'>
                    OIC - City Civil Registrar
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className='space-y-2 pt-4'>
                <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                  <Label className='font-medium'>Amount Paid</Label>
                  <Input type='number' step='0.01' />
                </div>
                <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                  <Label className='font-medium'>O.R. Number</Label>
                  <Input />
                </div>
                <div className='grid grid-cols-[120px_1fr] gap-4 items-center'>
                  <Label className='font-medium'>Date Paid</Label>
                  <Input type='date' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeathAnnotationForm;
