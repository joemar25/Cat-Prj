'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createBirthCertificate } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormProps,
  BirthCertificateFormValues,
  birthCertificateSchema,
  defaultBirthCertificateValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateSchema),
    defaultValues: defaultBirthCertificateValues,
  });

  const onSubmit = async (values: BirthCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createBirthCertificate(values);

      if (result.success) {
        toast.success('Birth certificate has been registered successfully');
        onOpenChange(false); // Close the dialog
        form.reset(); // Reset the form
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register birth certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Republic of the Philippines
            <br />
            OFFICE OF THE CIVIL REGISTRAR GENERAL
            <br />
            CERTIFICATE OF LIVE BIRTH
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <Card>
              <CardContent className='space-y-6'>
                {/* Registry Information */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='registryNo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registry No.</FormLabel>
                        <FormControl>
                          <Input
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
                        <FormLabel>City/Province</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter province' {...field} />
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
                            placeholder='Enter city/municipality'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Child Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Child Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='childInfo.firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
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
                        name='childInfo.middleName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input
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

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name='childInfo.weight'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight at Birth (grams)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Enter weight'
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='childInfo.placeOfBirth.hospital'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospital/Clinic/Institution</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter place of birth'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='childInfo.placeOfBirth.cityMunicipality'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Municipality</FormLabel>
                            <FormControl>
                              <Input
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
                        name='childInfo.placeOfBirth.province'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter province' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
                        name='childInfo.birthOrder'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Order</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter birth order'
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

                {/* Mother Information */}
                {/* Mother Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mother Information</CardTitle>
                    <CardTitle className='text-sm font-medium pt-8'>
                      Maiden Name :
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='motherInfo.firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
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
                        name='motherInfo.middleName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input
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
                        name='motherInfo.lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name (Maiden)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter maiden name'
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
                        control={form.control}
                        name='motherInfo.citizenship'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Citizenship</FormLabel>
                            <FormControl>
                              <Input
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
                        name='motherInfo.religion'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Religion</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter religion' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.occupation'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter occupation'
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
                        control={form.control}
                        name='motherInfo.age'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Age at time of this birth (completed Years)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Enter age'
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
                        control={form.control}
                        name='motherInfo.totalChildren'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Children Born Alive</FormLabel>
                            <FormControl>
                              <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.livingChildren'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              No. Children Still Living including this birth
                            </FormLabel>
                            <FormControl>
                              <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.childrenDead'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              No. Children Born Alive But now Dead
                            </FormLabel>
                            <FormControl>
                              <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                      <FormField
                        control={form.control}
                        name='motherInfo.residence.address'
                        render={({ field }) => (
                          <FormItem className='col-span-2'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='House No., St., Barangay'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.residence.cityMunicipality'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Municipality</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter city' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.residence.province'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter province' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='motherInfo.residence.country'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter Country' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                {/* Father Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Father Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='fatherInfo.firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
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
                        name='fatherInfo.middleName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input
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
                        name='fatherInfo.lastName'
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

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='fatherInfo.citizenship'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Citizenship</FormLabel>
                            <FormControl>
                              <Input
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
                        name='fatherInfo.religion'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Religion</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter religion' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fatherInfo.occupation'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter occupation'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Added Age Input */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='fatherInfo.age'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Age at time of this birth (completed Years)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Enter age'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                      <FormField
                        control={form.control}
                        name='fatherInfo.residence.address'
                        render={({ field }) => (
                          <FormItem className='col-span-2'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='House No., St., Barangay'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fatherInfo.residence.cityMunicipality'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Municipality</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter city' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fatherInfo.residence.province'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter province' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fatherInfo.residence.country'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter Country' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Marriage of Parents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Marriage of Parents</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='marriageOfParents.date.month'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
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
                        control={form.control}
                        name='marriageOfParents.date.day'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>
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
                        control={form.control}
                        name='marriageOfParents.date.year'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter year' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='marriageOfParents.place.cityMunicipality'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Municipality</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter city' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='marriageOfParents.place.province'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter province' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
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

                {/* Attendant Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendant Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='attendant.type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Attendant</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className='grid grid-cols-2 md:grid-cols-5 gap-4'
                            >
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='Physician' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Physician
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='Nurse' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Nurse
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='Midwife' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Midwife
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='Hilot' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Hilot
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='Others' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Others
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='attendant.certification.time'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time of Birth</FormLabel>
                            <FormControl>
                              <Input type='time' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='attendant.certification.date'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='attendant.certification.name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name in Print</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='attendant.certification.title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title or Position</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter title' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='attendant.certification.address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter complete address'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Certification of Informant */}
                <Card>
                  <CardHeader>
                    <CardTitle>Certification of Informant</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='informant.name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name in Print</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='informant.relationship'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship to the Child</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter relationship'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='informant.address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
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
                      name='informant.date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type='date' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Received By */}
                <Card>
                  <CardHeader>
                    <CardTitle>Received By</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='receivedBy.name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name in Print</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='receivedBy.title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title or Position</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter title' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='receivedBy.date'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Registered By */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Registered at the Office of Civil Registrar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='registeredBy.name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name in Print</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='registeredBy.title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title or Position</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter title' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='registeredBy.date'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Remarks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Remarks/Annotations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name='remarks'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder='Enter remarks or annotations'
                              className='min-h-[100px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className='flex justify-end space-x-4'>
                  <Button type='button' variant='outline' onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='h-10 ml-2'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        Save Registration
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
