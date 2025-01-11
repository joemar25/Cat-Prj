import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const FamilyInfoCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Information</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Father's Information */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='fatherName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter father's first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='fatherName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter father's last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mother's Information */}
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <FormField
            control={control}
            name='motherMaidenName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mother's first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherMaidenName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mother's last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyInfoCard;
