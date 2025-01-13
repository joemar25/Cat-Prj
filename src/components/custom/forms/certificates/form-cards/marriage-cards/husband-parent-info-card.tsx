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
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const HusbandParentsInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Husband&apos;s Parents Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Father's First Name */}
          <FormField
            control={control}
            name='husbandFatherName.first'
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
          {/* Father's Middle Name */}
          <FormField
            control={control}
            name='husbandFatherName.middle'
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
          {/* Father's Last Name */}
          <FormField
            control={control}
            name='husbandFatherName.last'
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
            name='husbandFatherCitizenship'
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
          {/* Maiden Mother's First Name */}
          <FormField
            control={control}
            name='husbandMotherMaidenName.first'
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
          {/* Maiden Mother's Middle Name */}
          <FormField
            control={control}
            name='husbandMotherMaidenName.middle'
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
          {/* Maiden Mother's last Name */}
          <FormField
            control={control}
            name='husbandMotherMaidenName.last'
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
            name='husbandMotherCitizenship'
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
                name='husbandParentsNatureOfProperty.first'
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
                name='husbandParentsNatureOfProperty.middle'
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
                name='husbandParentsNatureOfProperty.last'
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
            name='husbandParentsRelationship'
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
              name='husbandParentsResidence'
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

export default HusbandParentsInfoCard;
