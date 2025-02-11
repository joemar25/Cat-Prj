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
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
;
import { useFormContext } from 'react-hook-form';

const WifeParentsInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Wife&apos;s Parents Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Father's Name */}
          <FormField
            control={control}
            name='wifeFatherName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s First Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeFatherName.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeFatherName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Last Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Father's Citizenship */}
          <FormField
            control={control}
            name='wifeFatherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Citizenship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mother's Name */}
          <FormField
            control={control}
            name='wifeMotherMaidenName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s First Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeMotherMaidenName.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='wifeMotherMaidenName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Last Name (Maiden)</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mother's Citizenship */}
          <FormField
            control={control}
            name='wifeMotherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Citizenship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nature of Property */}
          <div className='col-span-full mt-6'>
            <h3 className='font-medium mb-4'>Nature of Property</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                control={control}
                name='wifeParentsNatureOfProperty.first'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Property (First)</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter nature of property (first)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='wifeParentsNatureOfProperty.middle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Property (Middle)</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter nature of property (middle)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='wifeParentsNatureOfProperty.last'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Property (Last)</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter nature of property (last)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Parents Relationship */}
          <FormField
            control={control}
            name='wifeParentsRelationship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter relationship'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parents Residence */}
          <div className='col-span-2'>
            <FormField
              control={control}
              name='wifeParentsResidence'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residence</FormLabel>
                  <FormControl>
                    <Input
                      className='h-10'
                      placeholder='House No., St., Barangay, City/Municipality, Province, Country'
                      {...field}
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

export default WifeParentsInfoCard;
