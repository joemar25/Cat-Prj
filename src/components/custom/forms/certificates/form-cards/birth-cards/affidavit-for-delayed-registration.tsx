'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

interface DelayedRegistrationFormProps {
  affiantAddressNcrMode: boolean;
  setAffiantAddressNcrMode: (value: boolean) => void;
  adminOfficerAddressNcrMode: boolean;
  setAdminOfficerAddressNcrMode: (value: boolean) => void;
}

const DelayedRegistrationForm: React.FC<DelayedRegistrationFormProps> = ({
  affiantAddressNcrMode,
  setAffiantAddressNcrMode,
  adminOfficerAddressNcrMode,
  setAdminOfficerAddressNcrMode,
}) => {
  const { control, watch, setValue, getValues } = useFormContext();
  const isDelayedRegistration = watch('isDelayedRegistration');

  // When delayed registration is toggled on, ensure the nested object is initialized.
  useEffect(() => {
    // Use getValues to fetch the current value.
    const currentDelayedReg = getValues('affidavitOfDelayedRegistration');
    if (isDelayedRegistration && currentDelayedReg === null) {
      setValue('affidavitOfDelayedRegistration', {
        affiant: {
          name: '',
          citizenship: '',
          civilStatus: '',
          address: {
            houseNumber: '',
            street: '',
            barangay: '',
            cityMunicipality: '',
            province: '',
            country: '',
          },
        },
        registrationType: '',
        parentMaritalStatus: '',
        reasonForDelay: '',
        dateSworn: new Date(),
        adminOfficer: {
          name: '',
          position: '',
          signature: '',
          address: {
            houseNumber: '',
            street: '',
            barangay: '',
            cityMunicipality: '',
            province: '',
            country: '',
          },
        },
        ctcInfo: { number: '', dateIssued: new Date(), placeIssued: '' },
      });
    }
  }, [isDelayedRegistration, setValue, getValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affidavit for Delayed Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Toggle for Delayed Registration */}
          <FormField
            control={control}
            name='isDelayedRegistration'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='font-normal'>
                  This is a delayed registration
                </FormLabel>
              </FormItem>
            )}
          />

          {isDelayedRegistration && (
            <div className='space-y-6'>
              {/* Affiant Basic Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.affiant.name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiant Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Affiant Citizenship */}
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.affiant.citizenship'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiant Citizenship</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Affiant Civil Status */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.affiant.civilStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Civil Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select civil status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='SINGLE'>Single</SelectItem>
                          <SelectItem value='MARRIED'>Married</SelectItem>
                          <SelectItem value='DIVORCED'>Divorced</SelectItem>
                          <SelectItem value='WIDOWED'>Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Admin Officer Address Section (Copied from AffidavitOfPaternityForm) */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Officer Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <NCRModeSwitch
                      isNCRMode={adminOfficerAddressNcrMode}
                      setIsNCRMode={setAdminOfficerAddressNcrMode}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <LocationSelector
                        provinceFieldName='affidavitOfDelayedRegistration.adminOfficer.address.province'
                        municipalityFieldName='affidavitOfDelayedRegistration.adminOfficer.address.cityMunicipality'
                        barangayFieldName='affidavitOfDelayedRegistration.adminOfficer.address.barangay'
                        provinceLabel='Province'
                        municipalityLabel='City/Municipality'
                        selectTriggerClassName='h-10 px-3 text-base md:text-sm'
                        provincePlaceholder='Select province'
                        municipalityPlaceholder='Select city/municipality'
                        className='grid grid-cols-2 gap-4'
                        isNCRMode={adminOfficerAddressNcrMode}
                        showBarangay={true}
                        barangayLabel='Barangay'
                        barangayPlaceholder='Select barangay'
                      />
                      <FormField
                        control={control}
                        name='affidavitOfDelayedRegistration.adminOfficer.address.country'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className='h-10'
                                value={field.value ?? ''}
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

              {/* Registration Type and Parent Status */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.registrationType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='SELF'>Self</SelectItem>
                          <SelectItem value='OTHER'>Other Person</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.parentMaritalStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent&apos;s Marital Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='MARRIED'>Married</SelectItem>
                          <SelectItem value='NOT_MARRIED'>
                            Not Married
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reason for Delay */}
              <FormField
                control={control}
                name='affidavitOfDelayedRegistration.reasonForDelay'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Delay</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        className='min-h-[100px]'
                        placeholder='Enter the reason for delayed registration...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Admin Officer Details */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.adminOfficer.name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Administering Officer</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.adminOfficer.position'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position/Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.adminOfficer.signature'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* CTC Information */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.ctcInfo.number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTC Number</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.ctcInfo.dateIssued'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePickerField
                          field={{
                            value: field.value,
                            onChange: field.onChange,
                          }}
                          label='Date Issued'
                          placeholder='Select date issued'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='affidavitOfDelayedRegistration.ctcInfo.placeIssued'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place Issued</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DelayedRegistrationForm;
