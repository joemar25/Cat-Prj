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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const MarriageOfParentsCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marriage of Parents</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Marriage Date */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='marriageOfParents.date.month'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select month' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {new Date(0, i).toLocaleString('default', {
                          month: 'long',
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='marriageOfParents.date.day'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select day' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='marriageOfParents.date.year'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder='Enter year' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Marriage Place */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='marriageOfParents.place.cityMunicipality'
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
            name='marriageOfParents.place.province'
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
            name='marriageOfParents.place.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder='Enter country' {...field} />
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

export default MarriageOfParentsCard;
