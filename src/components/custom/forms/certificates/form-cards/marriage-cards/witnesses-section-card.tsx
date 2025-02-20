'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
;

interface WitnessesCardProps {
  className?: string;
}

export const WitnessesCard: React.FC<WitnessesCardProps> = ({ className }) => {
  const { control } = useFormContext<MarriageCertificateFormValues>();
  return (
    <Card className={cn('border dark:border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Witnesses</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Husband's Witnesses */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>
              Husband&apos;s Witnesses
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4'>
              <FormField
                control={control}
                name='husbandWitnesses.name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Witness Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className='h-10'
                        placeholder='Enter witness name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={'husbandWitnesses.signature'}
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
              <FormField
                control={control}
                name='husbandWitnesses.name2'
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
              <FormField
                control={control}
                name={'husbandWitnesses.signature2'}
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
            </div>
          </div>

          {/* Wife's Witnesses */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>
              Wife&apos;s Witnesses
            </h3>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4'>
                <FormField
                  control={control}
                  name='wifeWitnesses.name'
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
                <FormField
                  control={control}
                  name={'wifeWitnesses.signature'}
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
                <FormField
                  control={control}
                  name='wifeWitnesses.name2'
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
                <FormField
                  control={control}
                  name={'wifeWitnesses.signature2'}
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
              </div>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WitnessesCard;
