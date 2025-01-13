'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

interface SolemnizingOfficerCertificationProps {
  className?: string;
}

export const SolemnizingOfficerCertification: React.FC<
  SolemnizingOfficerCertificationProps
> = ({ className }) => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className={cn('border dark:border-border', className)}>
      <CardHeader>
        <CardTitle>Certification of the Solemnizing Officer</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Certification Text */}
          <div className='text-sm text-muted-foreground space-y-4'>
            <p className='leading-relaxed'>
              THIS IS TO CERTIFY, That for the date and place above-written,
              personally appeared the above-mentioned parties, with their mutual
              consent, lawfully joined together in marriage which was solemnized
              by me in the presence of the witnesses named below, all of legal
              age.
            </p>
            <p className='leading-relaxed'>I CERTIFY FURTHER THAT:</p>
          </div>

          {/* Checkboxes Section */}
          <div className='space-y-4'>
            <FormField
              control={control}
              name='marriageSettlement'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    a. Marriage License No. __________, issued on __________.
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='executiveOrderApplied'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    b. The marriage was solemnized in accordance with the
                    provisions of Executive Order No. 209.
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='noMarriageLicense'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    c. No marriage license was necessary, the marriage being
                    solemnized under Art ___ of Executive Order No. 209.
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='presidentialDecreeApplied'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    d. The marriage was solemnized in accordance with the
                    provisions of Presidential Decree No. 1083.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Signature Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
            {/* Signature */}
            <FormField
              control={control}
              name='solemnizingOfficerSignature'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Signature Over Printed Name
                  </FormLabel>
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

            {/* Position */}
            <FormField
              control={control}
              name='solemnizingOfficer.position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Position/Designation
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10'
                      placeholder='Enter position'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registry Details */}
            <FormField
              control={control}
              name='solemnizingOfficer.registryNoExpiryDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Religion/Religious Sect, Registry No. and Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10'
                      placeholder='Enter registry details'
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

export default SolemnizingOfficerCertification;
