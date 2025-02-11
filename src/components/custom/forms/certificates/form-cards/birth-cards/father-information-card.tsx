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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
;
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

interface FatherInformationCardProps {
  fatherResidenceNcrMode: boolean;
  setFatherResidenceNcrMode: (value: boolean) => void;
}

const FatherInformationCard: React.FC<FatherInformationCardProps> = ({
  fatherResidenceNcrMode,
  setFatherResidenceNcrMode,
}) => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Father Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Personal Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Personal Information</h3>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
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
                  name='fatherInfo.middleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
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
                  name='fatherInfo.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
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
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='fatherInfo.citizenship'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizenship</FormLabel>
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
                <FormField
                  control={control}
                  name='fatherInfo.religion'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter religion'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='fatherInfo.occupation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter occupation'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={control}
                  name='fatherInfo.age'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Age at time of this birth (completed Years)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter age'
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) || value === '') {
                              field.onChange(value);
                            }
                          }}
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

        {/* Residence Information Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Residence Information</h3>
          </CardHeader>
          <CardContent>
            {/* Use the passed-in props for controlling the NCR mode */}
            <NCRModeSwitch
              isNCRMode={fatherResidenceNcrMode}
              setIsNCRMode={setFatherResidenceNcrMode}
            />
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* House Number */}
                <FormField
                  control={control}
                  name='fatherInfo.residence.houseNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House No.</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter house number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Street */}
                <FormField
                  control={control}
                  name='fatherInfo.residence.street'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter street name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Province */}
                <LocationSelector
                  provinceFieldName='fatherInfo.residence.province'
                  municipalityFieldName='fatherInfo.residence.cityMunicipality'
                  barangayFieldName='fatherInfo.residence.barangay'
                  provinceLabel='Province'
                  municipalityLabel='City/Municipality'
                  selectTriggerClassName='h-10 px-3 text-base md:text-sm'
                  formItemClassName=''
                  formLabelClassName=''
                  selectContentClassName=''
                  selectItemClassName=''
                  provincePlaceholder='Select province'
                  municipalityPlaceholder='Select city/municipality'
                  className='col-span-2 grid grid-cols-2 gap-4'
                  isNCRMode={fatherResidenceNcrMode}
                  showBarangay={true}
                  barangayLabel='Barangay'
                  barangayPlaceholder='Select barangay'
                />

                {/* Country */}
                <FormField
                  control={control}
                  name='fatherInfo.residence.country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          className='h-10'
                          placeholder='Enter country'
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
      </CardContent>
    </Card>
  );
};

export default FatherInformationCard;
