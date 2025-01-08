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

interface MarriageAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

const MarriageAnnotationForm: React.FC<MarriageAnnotationFormProps> = ({
  open,
  onOpenChange,
  onCancel,
}) => {
  // const currentDate = new Date().toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Marriage Annotation Form (Form 3A)
          </DialogTitle>
        </DialogHeader>
        <div className='container mx-auto p-4'>
          <Card className='w-full max-w-3xl mx-auto bg-background text-foreground border dark:border-border'>
            <CardContent className='p-6 space-y-6'>
              {/* Header */}
              <div className='space-y-2'>
                <h2 className='text-lg font-medium'>TO WHOM IT MAY CONCERN:</h2>
                <p>
                  We certify that, among others, the following marriage appears
                  in our Register of Marriages:
                </p>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <Label>On page</Label>
                    <Input />
                  </div>
                  <div className='space-y-1'>
                    <Label>Book number</Label>
                    <Input />
                  </div>
                </div>
              </div>

              {/* Main Form */}
              <div className='space-y-4'>
                {/* Column Headers */}
                <div className='grid grid-cols-2 gap-4'>
                  <h3 className='font-medium text-center'>HUSBAND</h3>
                  <h3 className='font-medium text-center'>WIFE</h3>
                </div>

                {/* Form Fields */}
                {[
                  { label: 'Name', type: 'text' },
                  { label: 'Date of Birth/Age', type: 'text' },
                  { label: 'Citizenship', type: 'text' },
                  { label: 'Civil Status', type: 'text' },
                  { label: 'Mother', type: 'text' },
                  { label: 'Father', type: 'text' },
                ].map((field, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-[120px_1fr_1fr] gap-4 items-center'
                  >
                    <Label className='font-medium'>{field.label}</Label>
                    <Input type={field.type} />
                    <Input type={field.type} />
                  </div>
                ))}

                {/* Single Column Fields */}
                <div className='space-y-4 pt-4'>
                  {[
                    { label: 'Registry number', type: 'text' },
                    { label: 'Date of registration', type: 'date' },
                    { label: 'Date of marriage', type: 'date' },
                    { label: 'Place of marriage', type: 'text' },
                  ].map((field, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-[120px_1fr] gap-4 items-center'
                    >
                      <Label className='font-medium'>{field.label}</Label>
                      <Input type={field.type} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification Section */}
              <div className='space-y-4 pt-4'>
                <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                  <p>This certification is issued to</p>
                  <Input />
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-2 items-center'>
                  <p>Upon his/her request for</p>
                  <Input />
                </div>
              </div>

              {/* Signature Section */}
              <div className='grid grid-cols-2 gap-8 pt-8'>
                <div className='space-y-8'>
                  <div className='space-y-4'>
                    <p className='font-medium'>Prepared by:</p>
                    <div className='space-y-1'>
                      <Input
                        className='text-center'
                        placeholder='Name and Signature'
                      />
                      <Input className='text-center' placeholder='Position' />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <p className='font-medium'>Verified by:</p>
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
                {[
                  { label: 'Amount paid', type: 'number' },
                  { label: 'O.R. Number', type: 'text' },
                  { label: 'Date Paid', type: 'date' },
                ].map((field, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-[120px_1fr] gap-4 items-center'
                  >
                    <Label className='font-medium'>{field.label}</Label>
                    <Input type={field.type} />
                  </div>
                ))}
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

export default MarriageAnnotationForm;
