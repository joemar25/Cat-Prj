'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const MaternalConditionCard: React.FC = () => {
  const { control, watch } = useFormContext<DeathCertificateFormValues>();
  const sex = watch('sex'); // Watch the top-level 'sex' field

  // Only show this card if the deceased is female
  if (sex !== 'Female') return null;

  // Helper function to convert the object value into a string for display.
  const getMaternalConditionValue = (value: any): string | undefined => {
    if (!value) return undefined;
    if (value.pregnantNotInLabor) return 'pregnant_not_in_labour';
    if (value.pregnantInLabour) return 'pregnant_in_labour';
    if (value.lessThan42Days) return 'less_than_42_days';
    if (value.daysTo1Year) return '42_days_to_1_year';
    if (value.noneOfTheAbove) return 'none';
    return undefined;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maternal Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name='medicalCertificate.maternalCondition'
          render={({ field }) => {
            const currentValue = getMaternalConditionValue(field.value);
            return (
              <FormItem>
                <FormLabel>
                  Maternal Condition (if deceased is female aged 15-49 years
                  old)
                </FormLabel>
                <Select
                  onValueChange={(val: string) =>
                    field.onChange({
                      pregnantNotInLabor: val === 'pregnant_not_in_labour',
                      pregnantInLabour: val === 'pregnant_in_labour',
                      lessThan42Days: val === 'less_than_42_days',
                      daysTo1Year: val === '42_days_to_1_year',
                      noneOfTheAbove: val === 'none',
                    })
                  }
                  defaultValue={currentValue}
                >
                  <FormControl>
                    <SelectTrigger ref={field.ref} className='h-10'>
                      <SelectValue placeholder='Select maternal condition' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='pregnant_not_in_labour'>
                      Pregnant, not in labour
                    </SelectItem>
                    <SelectItem value='pregnant_in_labour'>
                      Pregnant, in labour
                    </SelectItem>
                    <SelectItem value='less_than_42_days'>
                      Less than 42 days after delivery
                    </SelectItem>
                    <SelectItem value='42_days_to_1_year'>
                      42 days to 1 year after delivery
                    </SelectItem>
                    <SelectItem value='none'>None of the choices</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default MaternalConditionCard;
