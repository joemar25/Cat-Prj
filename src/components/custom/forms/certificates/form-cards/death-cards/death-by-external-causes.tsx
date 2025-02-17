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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const ExternalCausesCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>19d. Death by External Causes</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* External Causes Section */}
        <div className='space-y-4'>
          <FormField
            control={control}
            name='medicalCertificate.externalCauses.mannerOfDeath'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  a. Manner of death (Homicide, Suicide, Accident, Legal
                  Intervention, etc.)
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter manner of death' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='medicalCertificate.externalCauses.placeOfOccurrence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  b. Place of Occurrence of External Cause (e.g. home, farm,
                  factory, street, sea, etc.)
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter place of occurrence' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Autopsy Section with divider */}
        <div className='pt-4 border-t'>
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>20. Autopsy</h3>
            <p className='text-sm text-muted-foreground'>(Yes/No)</p>
          </div>
          <div className='mt-2'>
            <FormField
              control={control}
              name='medicalCertificate.autopsy'
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'yes')}
                    value={field.value ? 'yes' : 'no'}
                  >
                    <FormControl>
                      <SelectTrigger ref={field.ref} className='h-10'>
                        <SelectValue placeholder='Select autopsy status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='yes'>Yes</SelectItem>
                      <SelectItem value='no'>No</SelectItem>
                    </SelectContent>
                  </Select>
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

export default ExternalCausesCard;
