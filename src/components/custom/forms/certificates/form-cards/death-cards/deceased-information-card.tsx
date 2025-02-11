import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema'

import TimePicker from '@/components/custom/time/time-picker'
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field'
import LocationSelector from '@/components/custom/forms/certificates/form-cards/shared-components/location-selector'

const DeceasedInformationCard = () => {
  const { control } = useFormContext<DeathCertificateFormValues>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Deceased Information
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
                name='deceasedInfo.firstName'
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
                name='deceasedInfo.middleName'
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
                name='deceasedInfo.lastName'
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
            <CardTitle className='text-sm font-semibold'>
              Identity Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='deceasedInfo.sex'
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
                name='deceasedInfo.civilStatus'
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
                  name='deceasedInfo.dateOfDeath'
                  render={({ field }) => (
                    <FormItem>
                      <DatePickerField
                        field={{ value: field.value, onChange: field.onChange }}
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
                name='deceasedInfo.dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <DatePickerField
                      field={{ value: field.value, onChange: field.onChange }}
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
                name='deceasedInfo.ageAtDeath.years'
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
                        maxLength={3}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : value)
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
                name='deceasedInfo.ageAtDeath.months'
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
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : value)
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
                name='deceasedInfo.ageAtDeath.days'
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
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : value)
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
                name='deceasedInfo.ageAtDeath.hours'
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
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : value)
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
            {/* New LocationSelector for Place of Death */}
            <LocationSelector
              provinceFieldName='deceasedInfo.placeOfDeath.province'
              municipalityFieldName='deceasedInfo.placeOfDeath.cityMunicipality'
              barangayFieldName='deceasedInfo.placeOfDeath.barangay'
              provinceLabel='Province'
              municipalityLabel='City/Municipality'
              barangayLabel='Barangay'
              isNCRMode={false}
              showBarangay={false}
              provincePlaceholder='Type province name...'
              municipalityPlaceholder='Type city/municipality name...'
              barangayPlaceholder='Type barangay name...'
              formItemClassName=''
              formLabelClassName=''
            />
            {/* Additional field for street (e.g. hospital/clinic name) */}
            <FormField
              control={control}
              name='deceasedInfo.placeOfDeath.street'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street / Institution</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter street or institution'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Residence Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-semibold'>Residence</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* New LocationSelector for Residence */}
            <LocationSelector
              provinceFieldName='deceasedInfo.residence.province'
              municipalityFieldName='deceasedInfo.residence.cityMunicipality'
              barangayFieldName='deceasedInfo.residence.barangay'
              provinceLabel='Province'
              municipalityLabel='City/Municipality'
              barangayLabel='Barangay'
              isNCRMode={false}
              showBarangay={true}
              provincePlaceholder='Type province name...'
              municipalityPlaceholder='Type city/municipality name...'
              barangayPlaceholder='Type barangay name...'
              formItemClassName=''
              formLabelClassName=''
            />
            {/* Optional: Additional field for street/house number if needed */}
            <FormField
              control={control}
              name='deceasedInfo.residence.street'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street / House Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter street and house number'
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
            {/* Father's Name */}
            <div className='space-y-4'>
              <h4 className='text-sm'>Father's Name</h4>
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
            {/* Mother's Maiden Name */}
            <div className='space-y-4'>
              <h4 className='text-sm'>Mother's Maiden Name</h4>
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
                name='deceasedInfo.religion'
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
                name='deceasedInfo.citizenship'
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
              {/* Occupation */}
              <FormField
                control={control}
                name='deceasedInfo.occupation'
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
  )
}

export default DeceasedInformationCard
