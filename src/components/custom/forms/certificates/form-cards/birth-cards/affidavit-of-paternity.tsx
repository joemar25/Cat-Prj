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
import React, { useEffect, useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import RegisteredAtOfficeCard from '../shared-components/registered-at-office-card';

interface AffidavitOfPaternityFormProps {
  adminOfficerAddressNcrMode?: boolean;
  setAdminOfficerAddressNcrMode?: (value: boolean) => void;
}

const AffidavitOfPaternityForm: React.FC<AffidavitOfPaternityFormProps> = ({
  adminOfficerAddressNcrMode = false,
  setAdminOfficerAddressNcrMode = () => {},
}) => {
  const { control, watch, setValue } = useFormContext();
  const hasAffidavitOfPaternity = watch('hasAffidavitOfPaternity');
  const affidavitDetails = watch('affidavitOfPaternityDetails');

  // When the checkbox is checked and the nested object is not yet initialized,
  // set it to the default values.
  useLayoutEffect(() => {
    if (hasAffidavitOfPaternity && !affidavitDetails) {
      setValue('affidavitOfPaternityDetails', {
        father: { signature: '', name: '', title: '' },
        mother: { signature: '', name: '', title: '' },
        dateSworn: new Date(), // Ensures a valid Date value is set
        adminOfficer: {
          signature: '',
          name: '',
          position: '',
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
  }, [hasAffidavitOfPaternity, affidavitDetails, setValue]);

  // When the user unchecks the checkbox, reset the nested affidavit details.
  useEffect(() => {
    if (!hasAffidavitOfPaternity) {
      setValue('affidavitOfPaternityDetails', null);
    }
  }, [hasAffidavitOfPaternity, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Affidavit of Acknowledgment/Admission of Paternity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <FormField
            control={control}
            name='hasAffidavitOfPaternity'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='font-normal'>
                  Include Affidavit of Paternity
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Render nested fields only when the checkbox is checked and the nested object exists */}
          {hasAffidavitOfPaternity ? (
            affidavitDetails ? (
              <>
                {/* Parental Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Parental Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Father's Details */}
                      <div className='space-y-4'>
                        <FormField
                          control={control}
                          name='affidavitOfPaternityDetails.father.name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Father&apos;s Name</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name='affidavitOfPaternityDetails.father.signature'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Father&apos;s Signature</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Mother's Details */}
                      <div className='space-y-4'>
                        <FormField
                          control={control}
                          name='affidavitOfPaternityDetails.mother.name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mother&apos;s Name</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name='affidavitOfPaternityDetails.mother.signature'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mother&apos;s Signature</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Administering Officer */}
                <RegisteredAtOfficeCard
                  fieldPrefix='affidavitOfPaternityDetails.adminOfficer'
                  cardTitle='Administering Officer'
                  hideDate={true}
                  showSignature={true}
                />

                {/* Admin Officer Address */}
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
                          provinceFieldName='affidavitOfPaternityDetails.adminOfficer.address.province'
                          municipalityFieldName='affidavitOfPaternityDetails.adminOfficer.address.cityMunicipality'
                          barangayFieldName='affidavitOfPaternityDetails.adminOfficer.address.barangay'
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
                          name='affidavitOfPaternityDetails.adminOfficer.address.country'
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

                {/* CTC Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>CTC Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={control}
                        name='affidavitOfPaternityDetails.ctcInfo.number'
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
                        name='affidavitOfPaternityDetails.ctcInfo.dateIssued'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <DatePickerField
                                field={{
                                  value: field.value ?? undefined,
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
                        name='affidavitOfPaternityDetails.ctcInfo.placeIssued'
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
                  </CardContent>
                </Card>
              </>
            ) : (
              <div>Loading affidavit details...</div>
            )
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default AffidavitOfPaternityForm;
