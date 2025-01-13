'use client';

import * as React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface WitnessesCardProps {
  className?: string;
}

export const WitnessesCard: React.FC<WitnessesCardProps> = ({ className }) => {
  const { control } = useFormContext<MarriageCertificateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'witnesses',
  });

  return (
    <Card className={cn('border dark:border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Witnesses</CardTitle>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => append({ name: '', signature: '' })}
          className='h-8'
        >
          <Plus className='h-4 w-4 mr-1' />
          Add Witness
        </Button>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 relative'
            >
              {/* Witness Name */}
              <FormField
                control={control}
                name={`witnesses.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Witness Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className='h-10'
                        placeholder='Enter witness name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Witness Signature */}
              <FormField
                control={control}
                name={`witnesses.${index}.signature`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className='h-10'
                        placeholder='Signature'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove Button */}
              {fields.length > 2 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => remove(index)}
                  className='absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full'
                >
                  <Trash2 className='h-4 w-4 text-destructive' />
                </Button>
              )}
            </div>
          ))}

          {fields.length < 2 && (
            <p className='text-sm text-muted-foreground'>
              At least two witnesses are required.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WitnessesCard;
