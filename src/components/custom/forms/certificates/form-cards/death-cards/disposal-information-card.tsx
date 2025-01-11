// DisposalInformationCard.tsx
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const DisposalInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disposal Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Method of Disposal */}
        <FormField
          control={control}
          name='disposal.method'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method of Disposal</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Burial, Cremation, etc.' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          {/* Burial/Cremation Permit Section */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Burial/Cremation Permit</h4>
            <FormField
              control={control}
              name='disposal.burialPermit.number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='disposal.burialPermit.dateIssued'
              render={({ field }) => (
                <FormItem>
                  <DatePickerField field={field} label='Date Issued' />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Transfer Permit Section */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Transfer Permit</h4>
            <FormField
              control={control}
              name='disposal.transferPermit.number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='disposal.transferPermit.dateIssued'
              render={({ field }) => (
                <FormItem>
                  <DatePickerField field={field} label='Date Issued' />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Cemetery Information */}
        <FormField
          control={control}
          name='cemeteryAddress'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name and Address of Cemetery or Crematory</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DisposalInformationCard;
