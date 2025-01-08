'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
interface DatePickerFieldProps {
  field: {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
  };
  label: string;
  placeholder?: string;
}

const DatePickerField = ({
  field,
  label,
  placeholder = 'Pick a date',
}: DatePickerFieldProps) => {
  // State for current month displayed in calendar
  const [currentDate, setCurrentDate] = useState<Date>(
    field.value || new Date()
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Update currentDate when field.value changes
  useEffect(() => {
    if (field.value) {
      setCurrentDate(field.value);
    }
  }, [field.value]);

  // Get current year for the dropdown's default value
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate years from 1900 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className='relative'>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant='outline'
                role='combobox'
                className={cn(
                  'w-full h-10',
                  'px-3 py-2',
                  'flex items-center justify-between',
                  'text-left font-normal',
                  'bg-background',
                  'border border-input hover:bg-accent hover:text-accent-foreground',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value ? (
                  format(field.value, 'MMMM do, yyyy')
                ) : (
                  <span>{placeholder}</span>
                )}
                <CalendarIcon className='h-4 w-4 opacity-50 shrink-0 ml-auto' />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <div className='border-b border-border p-3'>
              <div className='flex items-center justify-between space-x-2'>
                <Select
                  value={currentMonth.toString()}
                  onValueChange={(value) => handleMonthChange(parseInt(value))}
                >
                  <SelectTrigger className='w-[140px] h-8'>
                    <SelectValue>{format(currentDate, 'MMMM')}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {format(new Date(2000, i, 1), 'MMMM')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={currentYear.toString()}
                  onValueChange={(value) => handleYearChange(parseInt(value))}
                >
                  <SelectTrigger className='w-[95px] h-8'>
                    <SelectValue>{currentYear}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Calendar
              mode='single'
              selected={field.value}
              month={currentDate}
              onMonthChange={setCurrentDate}
              onSelect={(date) => {
                field.onChange(date);
                setCalendarOpen(false);
              }}
              disabled={(date: Date): boolean =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
              className='rounded-b-md'
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
};

const formSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  childFirstName: z.string().min(1, 'First name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Last name is required'),
  sex: z.string().min(1, 'Sex is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  motherName: z.string().min(1, "Mother's name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  parentsMarriageDate: z.date({
    required_error: 'Marriage date is required',
  }),
  parentsMarriagePlace: z.string().min(1, 'Marriage place is required'),
  remarks: z.string().optional(),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  verifiedBy: z.string().min(1, 'Verified by is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface BirthRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BirthRegistrationForm({
  open,
  onOpenChange,
}: BirthRegistrationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageNumber: '',
      bookNumber: '',
      registryNumber: '',
      dateOfRegistration: new Date(),
    },
  });

  const onSubmit = async (values: FormValues) => {
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
                onClick={() => onOpenChange(false)}
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
