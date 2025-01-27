'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';

interface ContractingPartiesCertificationProps {
  className?: string;
}

export const ContractingPartiesCertification: React.FC<
  ContractingPartiesCertificationProps
> = ({ className }) => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className={cn('border dark:border-border', className)}>
      <CardHeader>
        <CardTitle>Certification of the Contracting Parties</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Certification Text */}
          <div className='text-sm text-muted-foreground border-b pb-4'>
            <p className='leading-relaxed'>THIS IS TO CERTIFY That I</p>
            <p className='mt-2 leading-relaxed'>
              of my own free will and accord and in the presence of the person
              solemnizing this marriage and of the witnesses named below, take
              each other as husband and wife and certify further that we have
              signed (marked with our fingerprints) this certificate in
              quadruplicate this _________ day of _________, _________.
            </p>
          </div>

          {/* Signatures Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Husband's Signature */}
            <FormField
              control={control}
              name='contractingPartiesSignature.husband'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Signature of Husband
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10'
                      placeholder='Digital signature or fingerprint'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wife's Signature */}
            <FormField
              control={control}
              name='contractingPartiesSignature.wife'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Signature of Wife
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10'
                      placeholder='Digital signature or fingerprint'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractingPartiesCertification;
