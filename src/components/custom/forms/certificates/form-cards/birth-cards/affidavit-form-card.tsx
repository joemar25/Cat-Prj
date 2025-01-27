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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const AffidavitFormsCard: React.FC = () => {
  const { control, watch } = useFormContext();
  const hasAffidavitOfPaternity = watch('hasAffidavitOfPaternity');
  const isDelayedRegistration = watch('isDelayedRegistration');

  return (
    <div className='space-y-6'>
      {/* Affidavit of Paternity Section */}
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='font-normal'>
                    Include Affidavit of Paternity
                  </FormLabel>
                </FormItem>
              )}
            />

            {hasAffidavitOfPaternity && (
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Admin Officer Details */}
                <div className='space-y-4 md:col-span-2'>
                  <Separator className='my-4' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <FormField
                      control={control}
                      name='affidavitOfPaternityDetails.adminOfficer.name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Administering Officer</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='affidavitOfPaternityDetails.adminOfficer.position'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position/Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='affidavitOfPaternityDetails.adminOfficer.signature'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                      name='affidavitOfPaternityDetails.ctcInfo.number'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTC Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name='affidavitOfPaternityDetails.ctcInfo.dateIssued'
                      render={({ field }) => (
                        <DatePickerField
                          field={{
                            value: field.value,
                            onChange: field.onChange,
                          }}
                          label='Date Issued'
                          placeholder='Select date issued'
                        />
                      )}
                    />
                    <FormField
                      control={control}
                      name='affidavitOfPaternityDetails.ctcInfo.placeIssued'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place Issued</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delayed Registration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Affidavit for Delayed Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
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
                {/* Affiant Details */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='affidavitOfDelayedRegistration.affiant.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiant Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='affidavitOfDelayedRegistration.affiant.civilStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Civil Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                          value={field.value}
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
                          value={field.value}
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name='affidavitOfDelayedRegistration.ctcInfo.dateIssued'
                    render={({ field }) => (
                      <DatePickerField
                        field={{
                          value: field.value,
                          onChange: field.onChange,
                        }}
                        label='Date Issued'
                        placeholder='Select date issued'
                      />
                    )}
                  />
                  <FormField
                    control={control}
                    name='affidavitOfDelayedRegistration.ctcInfo.placeIssued'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place Issued</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
    </div>
  );
};

export default AffidavitFormsCard;
