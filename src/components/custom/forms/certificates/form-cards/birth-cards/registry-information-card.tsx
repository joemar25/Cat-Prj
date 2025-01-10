import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useFormContext, useController } from 'react-hook-form';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';

const RegistryInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  const registryNoController = useController({
    name: 'registryNo',
    control,
    defaultValue: '',
  });

  const provinceController = useController({
    name: 'province',
    control,
    defaultValue: '',
  });

  const cityMunicipalityController = useController({
    name: 'cityMunicipality',
    control,
    defaultValue: '',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='registryNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registry No.</FormLabel>
                <FormControl>
                  <Input placeholder='Enter registry number' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1'>
                  {registryNoController.fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder='Enter province' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1'>
                  {provinceController.fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <FormControl>
                  <Input placeholder='Enter city/municipality' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1'>
                  {cityMunicipalityController.fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistryInformationCard;
