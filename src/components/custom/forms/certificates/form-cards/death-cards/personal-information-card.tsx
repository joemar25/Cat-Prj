import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import TimePicker from '@/components/custom/time-picker/time-picker';
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
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const PersonalInformationCard = () => {
  const { control, setValue } = useFormContext<DeathCertificateFormValues>();

  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Name Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Name Details</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='personalInfo.firstName'
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
                name='personalInfo.middleName'
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
                name='personalInfo.lastName'
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
          </CardContent>
        </Card>

        {/* Identity Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Identity Information</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='personalInfo.sex'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
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
                name='personalInfo.civilStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Civil Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select civil status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Single'>Single</SelectItem>
                        <SelectItem value='Married'>Married</SelectItem>
                        <SelectItem value='Widowed'>Widowed</SelectItem>
                        <SelectItem value='Divorced'>Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Important Dates and Time
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-4'>
                {/* Date of Death */}
                <FormField
                  control={control}
                  name='personalInfo.dateOfDeath'
                  render={({ field }) => (
                    <FormItem>
                      <DatePickerField
                        field={{
                          value: field.value,
                          onChange: field.onChange,
                        }}
                        label='Date of Death'
                        placeholder='Select date of death'
                      />
                    </FormItem>
                  )}
                />

                {/* Time of Death */}
                <FormField
                  control={control}
                  name='timeOfDeath'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Death</FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Date of Birth */}
              <FormField
                control={control}
                name='personalInfo.dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <DatePickerField
                      field={{
                        value: field.value,
                        onChange: field.onChange,
                      }}
                      label='Date of Birth'
                      placeholder='Select date of birth'
                    />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Age at Death Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Age at Time of Death
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-4 gap-4'>
              {/* Years */}
              <FormField
                control={control}
                name='personalInfo.ageAtDeath.years'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Years'
                        inputMode='numeric'
                        maxLength={3} // Optional: Prevent excessively long inputs
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value); // Ensure empty string is handled
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Months */}
              <FormField
                control={control}
                name='personalInfo.ageAtDeath.months'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Months</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Months'
                        inputMode='numeric'
                        maxLength={2} // Optional: Prevent excessively long inputs
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value); // Ensure empty string is handled
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Days */}
              <FormField
                control={control}
                name='personalInfo.ageAtDeath.days'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Days'
                        inputMode='numeric'
                        maxLength={2} // Optional: Prevent excessively long inputs
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value); // Ensure empty string is handled
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours */}
              <FormField
                control={control}
                name='personalInfo.ageAtDeath.hours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        className='h-10 pr-8'
                        placeholder='Hours'
                        inputMode='numeric'
                        maxLength={2} // Optional: Prevent excessively long inputs
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : value); // Ensure empty string is handled
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Place of Death Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Place of Death
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Province Selection */}
            <FormField
              control={control}
              name='personalInfo.placeOfDeath.province'
              render={({ field }) => {
                console.log('Province field value:', field.value); // Debugging
                return (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = allProvinces.find(
                          (province) => province.id === value
                        );
                        console.log('Selected province:', selected); // Debugging
                        field.onChange(selected?.name || ''); // Update form value with province name
                        setSelectedProvince(value); // Set selected province ID for filtering cities
                        setValue(
                          'personalInfo.placeOfDeath.province',
                          selected?.name || ''
                        );
                      }}
                      value={
                        allProvinces.find(
                          (province) => province.name === field.value
                        )?.id || ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select a province' />
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
                );
              }}
            />

            {/* City/Municipality Selection */}
            <FormField
              control={control}
              name='personalInfo.placeOfDeath.cityMunicipality'
              render={({ field }) => {
                console.log('City/Municipality field value:', field.value); // Debugging
                return (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange} // Update form value directly
                      value={field.value || ''} // Ensure value is a string
                      disabled={!selectedProvince} // Disable if no province is selected
                    >
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select a city/municipality' />
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
                );
              }}
            />

            {/* Specific Address (Hospital/Clinic/House No., St., Barangay) */}
            <FormField
              control={control}
              name='personalInfo.placeOfDeath.specificAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Specific Address (Hospital/Clinic/Institution/House No.,
                    St., Barangay)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10 pr-8'
                      placeholder='Enter specific address (e.g., Hospital Name, House No., Street, Barangay)'
                      inputMode='text'
                      maxLength={200} // Optional: Prevent excessively long inputs
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value); // Update the field value
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Family Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            {/* Father's Name Section */}
            <div className='space-y-4'>
              <h4 className='text-sm '>Father&apos;s Name</h4>
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='familyInfo.father.firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter father's first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='familyInfo.father.middleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter father's middle name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='familyInfo.father.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter father's last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Mother's Maiden Name Section */}
            <div className='space-y-4'>
              <h4 className='text-sm'>Mother&apos;s Maiden Name</h4>
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='familyInfo.mother.firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter mother's first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='familyInfo.mother.middleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter mother's middle name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='familyInfo.mother.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter mother's last name"
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

        {/* Additional Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              {/* Religion */}
              <FormField
                control={control}
                name='personalInfo.religion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter religion' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Citizenship */}
              <FormField
                control={control}
                name='personalInfo.citizenship'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citizenship</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter citizenship' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Residence */}
              <FormField
                control={control}
                name='personalInfo.residence.address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residence</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter complete residence address'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Occupation */}
              <FormField
                control={control}
                name='personalInfo.occupation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter occupation' />
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

export default PersonalInformationCard;
