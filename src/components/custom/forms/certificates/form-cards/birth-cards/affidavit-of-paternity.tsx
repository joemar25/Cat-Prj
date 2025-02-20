'use client'

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import LocationSelector from '../shared-components/location-selector'
import NCRModeSwitch from '../shared-components/ncr-mode-switch'
import { RegisteredAtOfficeCard } from '../shared-components/processing-details-cards'

const AffidavitOfPaternityForm: React.FC = () => {
  const { control, watch, setValue } = useFormContext()

  // Local state for NCR mode for the admin officer address.
  const [ncrMode, setncrMode] = useState(false)

  // Watch for the checkbox and nested affidavit details.
  const hasAffidavitOfPaternity = watch('hasAffidavitOfPaternity')
  const affidavitDetails = watch('affidavitOfPaternityDetails')

  // When checkbox is checked and nested details are not initialized, initialize them.
  useLayoutEffect(() => {
    if (hasAffidavitOfPaternity && !affidavitDetails) {
      setValue('affidavitOfPaternityDetails', {
        father: { signature: '', name: '' },
        mother: { signature: '', name: '' },
        dateSworn: undefined,
        adminOfficer: {
          signature: '',
          name: '',
          position: '',
          address: {
            houseNo: '',
            st: '',
            barangay: '',
            cityMunicipality: '',
            province: '',
            country: '',
          },
        },
        ctcInfo: {
          number: '',
          dateIssued: undefined,
          placeIssued: '',
        },
      })
    }
  }, [hasAffidavitOfPaternity, affidavitDetails, setValue])

  // Reset the nested affidavit details when the checkbox is unchecked.
  useEffect(() => {
    if (!hasAffidavitOfPaternity) {
      setValue('affidavitOfPaternityDetails', null)
    }
  }, [hasAffidavitOfPaternity, setValue])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Affidavit of Acknowledgment/Admission of Paternity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Checkbox to include the affidavit details */}
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

          {/* Render the nested affidavit fields if the checkbox is checked */}
          {hasAffidavitOfPaternity && (
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
                            <FormLabel>Father&apos; Name</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} />
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
                            <FormLabel>Father&apos; Signature</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} />
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
                            <FormLabel>Mother&apos; Name</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} />
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
                            <FormLabel>Mother&apos; Signature</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Administering Officer Details */}
              <RegisteredAtOfficeCard
                fieldPrefix='affidavitOfPaternityDetails.adminOfficer'
                cardTitle='Administering Officer'
                hideDate={true}
                showSignature={true}
                showNameInPrint={true}
                showTitleOrPosition={true}
              />

              {/* Admin Officer Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Officer Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <NCRModeSwitch
                      isNCRMode={ncrMode}
                      setIsNCRMode={setncrMode}
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
                        isNCRMode={ncrMode}
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
                                value={field.value || ''}
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
                            <Input {...field} value={field.value || ''} />
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
                          <DatePickerField
                            field={{
                              value: field.value ?? null,
                              onChange: field.onChange,
                            }}
                            label='Date Issued'
                            placeholder='Select date issued'
                            ref={field.ref}
                          />
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
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AffidavitOfPaternityForm
