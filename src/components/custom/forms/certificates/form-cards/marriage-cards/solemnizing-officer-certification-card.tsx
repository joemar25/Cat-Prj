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
import { cn } from '@/lib/utils';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';

interface SolemnizingOfficerCertificationProps {
  className?: string;
}

export const SolemnizingOfficerCertification: React.FC<
  SolemnizingOfficerCertificationProps
> = ({ className }) => {
  const { control, watch } = useFormContext<MarriageCertificateFormValues>();

  // Watch specific form fields for dynamic updates
  const marriageLicenseNumber = watch('marriageLicenseDetails.number');
  const marriageLicenseDateIssued = watch('marriageLicenseDetails.dateIssued');
  const marriageLicensePlaceIssued = watch('marriageLicenseDetails.placeIssued');
  const marriageArticleNumber = watch('marriageArticle.articleExecutiveOrder');

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
              THIS IS TO CERTIFY; THAT BEFORE ME, on the date and place above-written,
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
              name='marriageLicenseDetails.marriageAgree.agreement'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    a. Marriage License No.{' '}
                    <span className='font-bold px-5 border-b border-muted-foreground'>{marriageLicenseNumber || ''}</span>,
                    issued on{' '}
                    <span className='font-bold px-5 border-b border-muted-foreground'>
                      {marriageLicenseDateIssued ? new Date(marriageLicenseDateIssued).toLocaleDateString() : ''}
                    </span>, at{' '}
                    <span className='font-bold px-5 border-b border-muted-foreground'>{marriageLicensePlaceIssued || ''}</span>.
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='marriageArticle.articleAgree.agreement'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    <p>
                      b. No marriage license was necessary, the marriage being
                      solemnized under Art{' '}
                      <span className='font-bold px-5 border-b border-muted-foreground '>{marriageArticleNumber || ''}</span> of Executive Order No. 209.
                    </p>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='marriageSolemnized.agreement'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    c. The marriage was solemnized in accordance with the
                    provisions of Executive Order No. 209.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Signature Section *********************************************/}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
            {/* License No */}
            <FormField
              control={control}
              name='marriageLicenseDetails.number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Marriage License No.
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10'
                      placeholder='Enter license number'
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Issued on */}
            <FormField
              control={control}
              name='marriageLicenseDetails.dateIssued'
              render={({ field }) => (
                <DatePickerField field={{
                  value: field.value || '',
                  onChange: field.onChange,
                }} 
                placeholder='Select date issued'
                label='Issued on'
                ref={field.ref}
                 />
              )}
            />
            {/* Place Issued */}
            <FormField
              control={control}
              name='marriageLicenseDetails.placeIssued'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Civil Registry Office
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10'
                      placeholder='Enter place issued'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Article No. */}
            <FormField
              control={control}
              name='marriageArticle.articleExecutiveOrder'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Article
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10'
                      placeholder='Enter article number'
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='solemnizingOfficer.name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>
                    Officer Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10'
                      placeholder='Enter officer name'
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
                    Officer Position/Designation
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10'
                      placeholder='Enter position'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Registry Details */}
            <div className='col-span-3'>
              <FormField
                control={control}
                name='solemnizingOfficer.registryNoExpiryDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground'>
                      Religion/Religious Sect, Registry No. and Expiration Date, (if applicable)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SolemnizingOfficerCertification;