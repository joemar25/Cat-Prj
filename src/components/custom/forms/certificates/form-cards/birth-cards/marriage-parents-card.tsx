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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const MarriageOfParentsCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marriage of Parents</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Marriage Date Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Date of Marriage</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='marriageOfParents.date'
              render={({ field }) => {
                // Convert the separate date fields to a Date object
                const dateValue = field.value
                  ? new Date(
                      parseInt(field.value.year),
                      parseInt(field.value.month) - 1, // Months are 0-based in JavaScript
                      parseInt(field.value.day)
                    )
                  : undefined;

                return (
                  <DatePickerField
                    field={{
                      value: dateValue,
                      onChange: (date) => {
                        if (date) {
                          // Convert back to your form's expected format
                          field.onChange({
                            year: date.getFullYear().toString(),
                            month: (date.getMonth() + 1).toString(), // Add 1 because months are 0-based
                            day: date.getDate().toString(),
                          });
                        } else {
                          field.onChange({
                            year: '',
                            month: '',
                            day: '',
                          });
                        }
                      },
                    }}
                    label='Date of Marriage'
                    placeholder='Select marriage date'
                  />
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Marriage Place Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Place of Marriage</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='marriageOfParents.place.province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const provinceObj = allProvinces.find(
                          (p) => p.id === value
                        );
                        field.onChange(provinceObj?.name || '');
                        setSelectedProvince(value);
                      }}
                      value={
                        allProvinces.find((p) => p.name === field.value)?.id ||
                        ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select province' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allProvinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
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
                name='marriageOfParents.place.cityMunicipality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!selectedProvince}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select city/municipality' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citiesMunicipalities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
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
      </CardContent>
    </Card>
  );
};

export default MarriageOfParentsCard;
