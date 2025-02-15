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

export interface PreparedByCardProps<T extends FieldValues = FieldValues> {
  /**
   * The field name prefix for this section.
   * For example, if your form schema uses a key like "preparedBy", then
   * all fields will be named "preparedBy.name", "preparedBy.title", "preparedBy.date", etc.
   * Defaults to "preparedBy".
   */
  fieldPrefix?: string;
  /**
   * The title to display on the card header.
   * Defaults to "Prepared By".
   */
  cardTitle?: string;
}

function PreparedByCard<T extends FieldValues = FieldValues>(
  props: PreparedByCardProps<T>
): JSX.Element {
  const { fieldPrefix = 'preparedBy', cardTitle = 'Prepared By' } = props;
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<T>();

  // Watch the staff name (e.g., "preparedBy.name")
  const selectedName = watch(`${fieldPrefix}.name` as Path<T>);

  // Create a constant for the title field name.
  const titleFieldName = `${fieldPrefix}.title` as Path<T>;

  // Auto-fill title when a staff name is selected.
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
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
                <Input
                  placeholder='Signature'
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  ref={field.ref}
                  className='h-10'
                />
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <FormControl>
                    <SelectTrigger className='h-10' ref={field.ref}>
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
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    ref={field.ref}
                    className='h-10'
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Prepared By Date */}
        <FormField
          control={control}
          name={`${fieldPrefix}.date` as Path<T>}
          render={({ field }) => (
            <DatePickerField
              field={{
                // If the date is undefined, pass null (or an appropriate default)
                value: field.value ?? null,
                onChange: field.onChange,
              }}
              label='Date'
              placeholder='Select date'
              ref={field.ref}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}

export default PreparedByCard;
