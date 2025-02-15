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

interface ProcessingCardProps<T extends FieldValues = FieldValues> {
  fieldPrefix: string;
  cardTitle: string;
  hideDate?: boolean;
  showSignature?: boolean;
  showNameInPrint?: boolean;
  showTitleOrPosition?: boolean;
}

function ProcessingDetailsCard<T extends FieldValues = FieldValues>({
  fieldPrefix,
  cardTitle,
  hideDate = false,
  showSignature = true,
  showNameInPrint = true,
  showTitleOrPosition = true,
}: ProcessingCardProps<T>) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<T>();

  const selectedName = watch(`${fieldPrefix}.nameInPrint` as Path<T>);
  const titleFieldName = `${fieldPrefix}.titleOrPosition` as Path<T>;

  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue(titleFieldName, staff.title as any, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
      setValue(`${fieldPrefix}.signature` as Path<T>, staff.name as any, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
    }
  }, [selectedName, setValue, isSubmitted, titleFieldName, fieldPrefix]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {showSignature && (
          <FormField
            control={control}
            name={`${fieldPrefix}.signature` as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Signature will auto-fill'
                    {...field}
                    value={field.value || ''}
                    className='h-10'
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {showNameInPrint && (
            <FormField
              control={control}
              name={`${fieldPrefix}.nameInPrint` as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name in Print</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
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
          )}

          {showTitleOrPosition && (
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
                      value={field.value || ''}
                      className='h-10'
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {!hideDate && (
          <FormField
            control={control}
            name={`${fieldPrefix}.date` as Path<T>}
            render={({ field }) => (
              <DatePickerField
                field={{
                  value: field.value || null,
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Export specialized versions
export function PreparedByCard<T extends FieldValues = FieldValues>(
  props: Omit<ProcessingCardProps<T>, 'fieldPrefix' | 'cardTitle'>
) {
  return (
    <ProcessingDetailsCard<T>
      fieldPrefix='preparedBy'
      cardTitle='Prepared By'
      {...props}
    />
  );
}

export function ReceivedByCard<T extends FieldValues = FieldValues>(
  props: Omit<ProcessingCardProps<T>, 'fieldPrefix' | 'cardTitle'>
) {
  return (
    <ProcessingDetailsCard<T>
      fieldPrefix='receivedBy'
      cardTitle='Received By'
      {...props}
    />
  );
}

export function RegisteredAtOfficeCard<T extends FieldValues = FieldValues>(
  props: ProcessingCardProps<T>
) {
  return (
    <ProcessingDetailsCard<T>
      fieldPrefix={props.fieldPrefix}
      cardTitle={props.cardTitle}
      hideDate={props.hideDate}
      showSignature={props.showSignature}
      showNameInPrint={props.showNameInPrint}
      showTitleOrPosition={props.showTitleOrPosition}
    />
  );
}
