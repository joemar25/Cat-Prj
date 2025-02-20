'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FieldValues, Path, useFormContext } from 'react-hook-form'

export interface RemarksCardProps<T extends FieldValues = FieldValues> {
  /** The name of the field in your form schema. Defaults to "remarks". */
  fieldName?: Path<T>
  /** The title to display on the card header. Default is "Remarks/Annotations". */
  cardTitle?: string
  /** The label to display above the textarea. Default is "Additional Remarks". */
  label?: string
  /** The placeholder text for the textarea. */
  placeholder?: string
}

const RemarksCard = <T extends FieldValues = FieldValues>({
  fieldName = 'remarks' as Path<T>,
  cardTitle = 'Remarks/Annotations',
  label = 'Additional Remarks',
  placeholder = 'Enter any additional remarks or annotations',
}: RemarksCardProps<T>) => {
  const { control } = useFormContext<T>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className='min-h-[100px] resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default RemarksCard
