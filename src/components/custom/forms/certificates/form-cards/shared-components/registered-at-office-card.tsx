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
import { useEffect, useState } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface RegisteredAtOfficeCardProps<
  T extends FieldValues = FieldValues
> {
  /**
   * The field name prefix for this section.
   * For example, if your form schema uses a key like "registeredByOffice", then
   * all fields will be named "registeredByOffice.name", "registeredByOffice.title", etc.
   * Defaults to "registeredByOffice".
   */
  fieldPrefix?: string;
  /**
   * The title to display on the card header.
   * Defaults to "Registered at the Office of Civil Registrar".
   */
  cardTitle?: string;
  /**
   * The list of staff options to display in the select.
   * Defaults to CIVIL_REGISTRAR_STAFF.
   */
  staffOptions?: { id: string; name: string; title: string }[];
  /**
   * When true, the date field will not be rendered.
   */
  hideDate?: boolean;
  /**
   * When true, displays a signature field.
   * @default false
   */
  showSignature?: boolean;
}

const RegisteredAtOfficeCard = <T extends FieldValues = FieldValues>({
  fieldPrefix = 'registeredByOffice',
  cardTitle = 'Registered at the Office of Civil Registrar',
  staffOptions = CIVIL_REGISTRAR_STAFF,
  hideDate = false,
  showSignature = false,
}: RegisteredAtOfficeCardProps<T>) => {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<T>();
  const [localState] = useState({}); // (You can add additional local state if needed)

  // Watch the staff name (e.g., "registeredByOffice.name")
  const selectedName = watch(`${fieldPrefix}.name` as Path<T>);

  // Create constants for auto-filled fields.
  const titleFieldName = `${fieldPrefix}.title` as Path<T>;
  const signatureFieldName = `${fieldPrefix}.signature` as Path<T>;

  // Auto-fill title and (optionally) signature when a staff name is selected.
  useEffect(() => {
    const staff = staffOptions.find((staff) => staff.name === selectedName);
    if (staff) {
      setValue(titleFieldName, staff.title as any, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
      if (showSignature) {
        setValue(signatureFieldName, staff.name as any, {
          shouldValidate: isSubmitted,
          shouldDirty: true,
        });
      }
    }
  }, [
    selectedName,
    setValue,
    isSubmitted,
    staffOptions,
    titleFieldName,
    signatureFieldName,
    showSignature,
  ]);

  // Determine grid columns based on visible fields.
  const getGridCols = () => {
    let baseCols = 2; // Name and Title
    if (showSignature) baseCols++;
    if (!hideDate) baseCols++;
    return `md:grid-cols-${baseCols}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className={`grid grid-cols-1 ${getGridCols()} gap-4`}>
          {/* Name Field */}
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
                    {staffOptions.map((staff) => (
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

          {/* Title/Position Field */}
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
                    className='h-10'
                    disabled
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Signature Field (if enabled) */}
          {showSignature && (
            <FormField
              control={control}
              name={signatureFieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Signature will auto-fill'
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      className='h-10'
                      disabled
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Date Field (if not hidden) */}
          {!hideDate && (
            <FormField
              control={control}
              name={`${fieldPrefix}.date` as Path<T>}
              render={({ field }) => (
                <DatePickerField
                  field={{
                    value: field.value ?? null,
                    onChange: field.onChange,
                  }}
                  label='Date'
                  placeholder='Select date'
                  ref={field.ref}
                />
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisteredAtOfficeCard;
