'use client';

import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns';

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
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';

interface ContractingPartiesCertificationProps {
  className?: string;
}

export const ContractingPartiesCertification: React.FC<
  ContractingPartiesCertificationProps
> = ({ className }) => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  // Watch contractDay field
  const contractDay = useWatch({ control, name: 'contractDay' });

  // Format contractDay into "day" and "month + year"
  const formattedDay = contractDay ? format(new Date(contractDay), 'd') : '';
  const formattedMonthYear = contractDay
    ? format(new Date(contractDay), 'MMMM yyyy')
    : '';

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
              quadruplicate this <span className=' px-5 border-b border-muted-foreground text-muted-foreground'>{formattedDay}</span> day of{' '}
              <span className=' px-5 border-b border-muted-foreground text-muted-foreground'>{formattedMonthYear}</span>.
            </p>
          </div>

          {/* Signatures Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Husband's Signature */}
            {/* <FormField
              control={control}
              name='husbandContractParty.contractingParties.signature'
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
            /> */}

            {/* Wife's Signature */}
            {/* <FormField
              control={control}
              name='wifeContractParty.contractingParties.signature'
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
            /> */}

            {/* Date of Marriage */}
            <FormField
              control={control}
              name='contractDay'
              render={({ field }) => (
                <DatePickerField field={{
                  value: field.value || '',
                  onChange: field.onChange,
                }}
                  label='Date of Marriage'
                  ref={field.ref} // Forward ref for auto-focus
                  placeholder='Select date of marriage'
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractingPartiesCertification;
