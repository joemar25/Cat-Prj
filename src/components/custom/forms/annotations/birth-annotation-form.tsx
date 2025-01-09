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
import {
  BirthAnnotationFormProps,
  BirthAnnotationFormValues,
  birthAnnotationSchema,
} from '@/lib/types/zod-form-annotations/formSchemaAnnotation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DatePickerField from '../../datepickerfield/date-picker-field';

export function BirthAnnotationForm({
  open,
  onOpenChange,
  onCancel,
}: BirthAnnotationFormProps) {
  const form = useForm<BirthAnnotationFormValues>({
    resolver: zodResolver(birthAnnotationSchema),
    defaultValues: {
      pageNumber: '',
      bookNumber: '',
      registryNumber: '',
      dateOfRegistration: new Date(),
    },
  });

  const onSubmit = async (values: BirthAnnotationFormValues) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            Birth Registration Form (Form 1A)
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Administrative Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Administrative Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                  <FormField
                    control={form.control}
                    name='pageNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Number</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter page number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='bookNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Number</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter book number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='registryNumber'
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
                    name='dateOfRegistration'
                    render={({ field }) => (
                      <DatePickerField
                        field={field}
                        label='Date of Registration'
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Child Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Child Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <FormField
                    control={form.control}
                    name='childFirstName'
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
                    name='childMiddleName'
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
                    name='childLastName'
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
                    name='sex'
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
                    name='dateOfBirth'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Date of Birth' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='placeOfBirth'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter place of birth'
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

            {/* Parents Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Parents Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='motherName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Name</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder="Enter mother's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='fatherName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Name</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder="Enter father's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='motherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother&apos;s Citizenship</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder="Enter mother's citizenship"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='fatherCitizenship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father&apos;s Citizenship</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder="Enter father's citizenship"
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

            {/* Parents Marriage Information */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Parents Marriage Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='parentsMarriageDate'
                    render={({ field }) => (
                      <DatePickerField field={field} label='Marriage Date' />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='parentsMarriagePlace'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marriage Place</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter marriage place'
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

            {/* Remarks and Verification */}
            <Card className='border dark:border-border'>
              <CardContent className='p-6'>
                <h3 className='font-semibold text-lg mb-4'>
                  Additional Information
                </h3>
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='remarks'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Input
                            className='h-10'
                            placeholder='Enter remarks'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='preparedBy'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prepared By</FormLabel>
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
                      name='verifiedBy'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verified By</FormLabel>
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
                  </div>
                </div>
              </CardContent>
            </Card>

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
