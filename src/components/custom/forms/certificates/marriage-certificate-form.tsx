'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultMarriageCertificateValues,
  MarriageCertificateFormProps,
  MarriageCertificateFormValues,
  marriageCertificateSchema,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DatePickerField from '../../datepickerfield/date-picker-field';

export function MarriageCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: MarriageCertificateFormProps) {
  const form = useForm<MarriageCertificateFormValues>({
    resolver: zodResolver(marriageCertificateSchema),
    defaultValues: defaultMarriageCertificateValues,
  });

  const onSubmit = async (values: MarriageCertificateFormValues) => {
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Certificate of Marriage
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Registry Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Registry Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='registryNo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registry No.</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter registry number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter province'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='cityMunicipality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Municipality</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter city/municipality'
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
            {/* Husband's Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Husband&apos;s Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='husbandFirstName'
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
                    control={form.control}
                    name='husbandMiddleName'
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
                    control={form.control}
                    name='husbandLastName'
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
                  <FormField
                    control={form.control}
                    name='husbandAge'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            type='number'
                            placeholder='Enter age'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandDateOfBirth'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date of Birth' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandPlaceOfBirth.cityMunicipality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Place of Birth (City/Municipality)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter city/municipality'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandPlaceOfBirth.province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth (Province)</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter province'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandPlaceOfBirth.country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth (Country)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='husbandSex'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || 'male'} // Default to male for husband
                        >
                          <FormControl>
                            <SelectTrigger className='h-10'>
                              <SelectValue placeholder='Select sex' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandCitizenship'
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
                    control={form.control}
                    name='husbandResidence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residence</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter complete address'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandReligion'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion/Religious Sect</FormLabel>
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
                    control={form.control}
                    name='husbandCivilStatus'
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
                            <SelectItem value='single'>Single</SelectItem>
                            <SelectItem value='widowed'>Widowed</SelectItem>
                            <SelectItem value='divorced'>Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Wife's Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Wife&apos;s Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='wifeFirstName'
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
                    control={form.control}
                    name='wifeMiddleName'
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
                    control={form.control}
                    name='wifeLastName'
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
                  <FormField
                    control={form.control}
                    name='wifeSex'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || 'female'}
                        >
                          <FormControl>
                            <SelectTrigger className='h-10'>
                              <SelectValue placeholder='Select sex' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='female'>Female</SelectItem>
                            <SelectItem value='male'>Male</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifeAge'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            type='number'
                            placeholder='Enter age'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifeDateOfBirth'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date of Birth' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifePlaceOfBirth.cityMunicipality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Place of Birth (City/Municipality)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter city/municipality'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifePlaceOfBirth.province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth (Province)</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter province'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifePlaceOfBirth.country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth (Country)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='wifeCitizenship'
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
                    control={form.control}
                    name='wifeResidence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residence</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter complete address'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifeReligion'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion/Religious Sect</FormLabel>
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
                    control={form.control}
                    name='wifeCivilStatus'
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
                            <SelectItem value='single'>Single</SelectItem>
                            <SelectItem value='widowed'>Widowed</SelectItem>
                            <SelectItem value='divorced'>Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Husband's Parents Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Husband&apos;s Parents Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='husbandFatherName.first'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s First Name</FormLabel>
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
                    control={form.control}
                    name='husbandFatherName.middle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Middle Name</FormLabel>
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
                    control={form.control}
                    name='husbandFatherName.last'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Last Name</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='husbandFatherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Citizenship</FormLabel>
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
                    control={form.control}
                    name='husbandMotherMaidenName.first'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s First Name</FormLabel>
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
                    control={form.control}
                    name='husbandMotherMaidenName.middle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Middle Name</FormLabel>
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
                    control={form.control}
                    name='husbandMotherMaidenName.last'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Last Name (Maiden)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='husbandMotherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Citizenship</FormLabel>
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
                </div>
              </CardContent>
            </Card>
            {/* Wife's Parents Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Wife&apos;s Parents Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='wifeFatherName.first'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s First Name</FormLabel>
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
                    control={form.control}
                    name='wifeFatherName.middle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Middle Name</FormLabel>
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
                    control={form.control}
                    name='wifeFatherName.last'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Last Name</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='wifeFatherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Citizenship</FormLabel>
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
                    control={form.control}
                    name='wifeMotherMaidenName.first'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s First Name</FormLabel>
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
                    control={form.control}
                    name='wifeMotherMaidenName.middle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Middle Name</FormLabel>
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
                    control={form.control}
                    name='wifeMotherMaidenName.last'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Last Name (Maiden)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='wifeMotherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Citizenship</FormLabel>
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
                </div>
              </CardContent>
            </Card>
            {/* Consent Information for Husband */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Person Giving Consent (Husband&apos;s Side)
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='husbandConsentGivenBy.first'
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
                    control={form.control}
                    name='husbandConsentGivenBy.middle'
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
                    control={form.control}
                    name='husbandConsentGivenBy.last'
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
                  <FormField
                    control={form.control}
                    name='husbandConsentRelationship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Husband</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='h-10'>
                              <SelectValue placeholder='Select relationship' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='father'>Father</SelectItem>
                            <SelectItem value='mother'>Mother</SelectItem>
                            <SelectItem value='guardian'>
                              Legal Guardian
                            </SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='husbandConsentResidence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complete Address</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='House No., St., Barangay, City/Municipality, Province'
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
            {/* Consent Information for Wife */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Person Giving Consent (Wife&apos;s Side)
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='wifeConsentGivenBy.first'
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
                    control={form.control}
                    name='wifeConsentGivenBy.middle'
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
                    control={form.control}
                    name='wifeConsentGivenBy.last'
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
                  <FormField
                    control={form.control}
                    name='wifeConsentRelationship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Wife</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='h-10'>
                              <SelectValue placeholder='Select relationship' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='father'>Father</SelectItem>
                            <SelectItem value='mother'>Mother</SelectItem>
                            <SelectItem value='guardian'>
                              Legal Guardian
                            </SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='wifeConsentResidence'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complete Address</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='House No., St., Barangay, City/Municipality, Province'
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
            {/* Marriage Details */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>Marriage Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='placeOfMarriage.office'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Place of Marriage (Office/Church/Mosque)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter office/church/mosque name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='placeOfMarriage.cityMunicipality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Municipality</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter city/municipality'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='placeOfMarriage.province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter province'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='dateOfMarriage'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date of Marriage' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='timeOfMarriage'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time of Marriage</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            type='time'
                            placeholder='Enter time of marriage'
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
            {/* Witnesses Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>Witnesses</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {[0, 1].map((index) => (
                    <div key={index} className='space-y-4'>
                      <h4 className='font-medium'>Witness {index + 1}</h4>
                      <FormField
                        control={form.control}
                        name={`witnesses.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                className='h-10'
                                placeholder='Enter full name'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`witnesses.${index}.signature`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Signature</FormLabel>
                            <FormControl>
                              <Input
                                type='file'
                                className='h-10'
                                accept='image/*'
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Receipt Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Receipt Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='receivedBy.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Received By</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='receivedBy.position'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Designation</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter position'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='receivedBy.date'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date Received' />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Registration Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Registration Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='registeredBy.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered By</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='registeredBy.position'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Designation</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter position'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='registeredBy.date'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date Registered' />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Remarks/Annotations */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Remarks/Annotations
                </h3>
                <div className='grid grid-cols-1 gap-6'>
                  <FormField
                    control={form.control}
                    name='remarks'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            className='min-h-[100px] resize-none'
                            placeholder='Enter any additional remarks or annotations'
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

            {/* Marriage Settlement Details */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Marriage Settlement Details
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='marriageSettlement'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Marriage Settlement
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Solemnizing Officer Details */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Solemnizing Officer Details
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='solemnizingOfficer.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter solemnizing officer name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='solemnizingOfficer.position'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter position'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='solemnizingOfficer.religion'
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
                    control={form.control}
                    name='solemnizingOfficer.registryNo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registry Number</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter registry number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='solemnizingOfficer.expiryDate'
                    render={({ field }) => (
                      <DatePickerField
                        field={field}
                        label='Registry Expiry Date'
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Legal Documentation Details */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Legal Documentation
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='noMarriageLicense'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            No Marriage License Required
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='executiveOrderApplied'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Executive Order Applied
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='presidentialDecreeApplied'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Presidential Decree Applied
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Signatures */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Contracting Parties Signatures
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='contractingPartiesSignature.husband'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Husband&apos;s Signature</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            className='h-10'
                            accept='image/*'
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Handle file upload logic here
                                field.onChange(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='contractingPartiesSignature.wife'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wife&apos;s Signature</FormLabel>
                        <FormControl>
                          <Input
                            type='file'
                            className='h-10'
                            accept='image/*'
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Handle file upload logic here
                                field.onChange(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* ------------------------------------------------------------------------------------- */}
            {/* Marriage License Details */}
            {/* <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Marriage License Details
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='marriageLicense.number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter license number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='marriageLicense.dateIssued'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date Issued' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='marriageLicense.placeIssued'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place Issued</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter place where license was issued'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card> */}
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                className='h-10'
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type='submit' className='h-10 ml-2'>
                <Eye className='mr-2 h-4 w-4' />
                Preview
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MarriageCertificateForm;
