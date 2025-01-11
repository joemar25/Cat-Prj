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

const ChildInformationCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Child Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Name Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='childInfo.firstName'
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
            name='childInfo.middleName'
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
            name='childInfo.lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter last name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sex and Weight */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='childInfo.sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select sex' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Male'>Male</SelectItem>
                    <SelectItem value='Female'>Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='childInfo.weight'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight at Birth (grams)</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter weight' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date of Birth */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='childInfo.dateOfBirth.month'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month of Birth</FormLabel>
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
            name='childInfo.dateOfBirth.day'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day of Birth</FormLabel>
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
            name='childInfo.dateOfBirth.year'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Birth</FormLabel>
                <FormControl>
                  <Input placeholder='Enter year' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Place of Birth */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='childInfo.placeOfBirth.hospital'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital/Clinic/Institution</FormLabel>
                <FormControl>
                  <Input placeholder='Enter place of birth' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province - Moved before City/Municipality */}
          <FormField
            control={control}
            name='childInfo.placeOfBirth.province'
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
                    allProvinces.find((p) => p.name === field.value)?.id || ''
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

          {/* City/Municipality */}
          <FormField
            control={control}
            name='childInfo.placeOfBirth.cityMunicipality'
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
        </div>

        {/* Birth Type and Order */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='childInfo.typeOfBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Birth</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Single'>Single</SelectItem>
                    <SelectItem value='Twin'>Twin</SelectItem>
                    <SelectItem value='Triplet'>Triplet</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='childInfo.multipleBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>If Multiple Birth</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select order' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='First'>First</SelectItem>
                    <SelectItem value='Second'>Second</SelectItem>
                    <SelectItem value='Third'>Third</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='childInfo.birthOrder'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Order</FormLabel>
                <FormControl>
                  <Input placeholder='Enter birth order' {...field} />
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

export default ChildInformationCard;
