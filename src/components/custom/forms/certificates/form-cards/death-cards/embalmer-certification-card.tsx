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
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const EmbalmerCertificationCard: React.FC = () => {
  const { control, watch } = useFormContext<DeathCertificateFormValues>();

  // Conditionally render this card if corpseDisposal is "Embalming"
  const corpseDisposal = watch('corpseDisposal');
  if (corpseDisposal !== 'Embalming') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Embalmer</CardTitle>
        <p className='text-sm text-muted-foreground'>
          I HEREBY CERTIFY that I have embalmed the body in accordance with the
          Department of Health regulations.
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <FormField
          control={control}
          name='embalmerCertification.nameOfDeceased'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Deceased</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter name of deceased' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='embalmerCertification.signature'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Sign here' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='embalmerCertification.nameInPrint'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name in Print</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter name in print' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='embalmerCertification.address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter address' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='embalmerCertification.titleDesignation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title/Designation</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g., Licensed Embalmer' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='embalmerCertification.licenseNo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Enter license number' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='embalmerCertification.issuedOn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued On</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='YYYY-MM-DD' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='embalmerCertification.issuedAt'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued At</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter place of issue' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name='embalmerCertification.expiryDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input {...field} placeholder='YYYY-MM-DD' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default EmbalmerCertificationCard;
