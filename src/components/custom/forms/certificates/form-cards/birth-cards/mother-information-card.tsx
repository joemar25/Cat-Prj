import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const MotherInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mother Information</CardTitle>
        <CardTitle className='text-sm font-medium pt-8'>Maiden Name:</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Maiden Name Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='motherInfo.firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter first name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.middleName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter middle name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (Maiden)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter maiden name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Citizenship, Religion, Occupation */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='motherInfo.citizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship</FormLabel>
                <FormControl>
                  <Input placeholder='Enter citizenship' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.religion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <FormControl>
                  <Input placeholder='Enter religion' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.occupation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder='Enter occupation' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Age */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='motherInfo.age'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Age at time of this birth (completed Years)
                </FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter age' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Children Information */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='motherInfo.totalChildren'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Children Born Alive</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.livingChildren'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  No. Children Still Living including this birth
                </FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.childrenDead'
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Children Born Alive But now Dead</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Residence Information */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <FormField
            control={control}
            name='motherInfo.residence.address'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder='House No., St., Barangay' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.residence.cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <FormControl>
                  <Input placeholder='Enter city' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.residence.province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder='Enter province' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='motherInfo.residence.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder='Enter Country' {...field} />
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

export default MotherInformationCard;
