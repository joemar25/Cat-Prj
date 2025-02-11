'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
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
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { useEffect } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface ReceivedByCardProps<T extends FieldValues = FieldValues> {
  /**
   * The field name prefix for this section.
   * For example, if your form schema uses a key like "receivedBy", then
   * all fields will be named "receivedBy.name", "receivedBy.title", and "receivedBy.date".
   * Defaults to "receivedBy".
   */
  fieldPrefix?: string;
  /**
   * The title to display on the card header.
   * Defaults to "Received By".
   */
  cardTitle?: string;
}

const ReceivedByCard = <T extends FieldValues = FieldValues>({
  fieldPrefix = 'receivedBy',
  cardTitle = 'Received By',
}: ReceivedByCardProps<T>) => {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<T>();

  // Watch the staff name (e.g., "receivedBy.name")
  const selectedName = watch(`${fieldPrefix}.name` as Path<T>);

  // Create a constant for the title field name.
  const titleFieldName = `${fieldPrefix}.title` as Path<T>;

  // Auto-fill the title when a staff name is selected.
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      // Cast staff.title to any to satisfy the setValue signature.
      setValue(titleFieldName, staff.title as any, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
    }
  }, [selectedName, setValue, isSubmitted, titleFieldName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Signature Field */}
        <FormField
          control={control}
          name={`${fieldPrefix}.signature` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <FormControl>
                <Input placeholder='Signature' {...field} className='h-10' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name and Title Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name={`${fieldPrefix}.name` as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select staff name' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CIVIL_REGISTRAR_STAFF.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={titleFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Title will auto-fill'
                    {...field}
                    className='h-10'
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Received By Date */}
        <FormField
          control={control}
          name={`${fieldPrefix}.date` as Path<T>}
          render={({ field }) => (
            <DatePickerField
              field={{
                value: field.value,
                onChange: field.onChange,
              }}
              label='Date'
              placeholder='Select date'
            />
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ReceivedByCard;
