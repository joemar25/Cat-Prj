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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Type of Attendant */}
        <FormField
          control={control}
          name='medicalCertificate.attendant'
          render={({ field }) => {
            // Derive a string value from the attendant object for display.
            let currentValue: string | undefined;
            const val = field.value;
            if (val) {
              if (val.privatePhysician) currentValue = 'Private Physician';
              else if (val.publicHealthOfficer)
                currentValue = 'Public Health Officer';
              else if (val.hospitalAuthority)
                currentValue = 'Hospital Authority';
              else if (val.none) currentValue = 'None';
              else if (val.others) currentValue = 'Others';
            }
            return (
              <FormItem>
                <FormLabel>Type of Attendant</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(selected: string) => {
                      // Build a new attendant object with the selected type.
                      const newAttendant = {
                        privatePhysician: selected === 'Private Physician',
                        publicHealthOfficer:
                          selected === 'Public Health Officer',
                        hospitalAuthority: selected === 'Hospital Authority',
                        none: selected === 'None',
                        others: selected === 'Others',
                        othersSpecify: '',
                        duration: field.value?.duration || { from: '', to: '' },
                      };
                      field.onChange(newAttendant);
                    }}
                    value={currentValue || ''}
                    defaultValue={currentValue}
                  >
                    <SelectTrigger ref={field.ref} className='h-10'>
                      <SelectValue placeholder='Select attendant type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Private Physician'>
                        Private Physician
                      </SelectItem>
                      <SelectItem value='Public Health Officer'>
                        Public Health Officer
                      </SelectItem>
                      <SelectItem value='Hospital Authority'>
                        Hospital Authority
                      </SelectItem>
                      <SelectItem value='None'>None</SelectItem>
                      <SelectItem value='Others'>Others</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Attendance Duration Section */}
        <div className='grid grid-cols-2 gap-4'>
          {/* From Date */}
          <FormField
            control={control}
            name='medicalCertificate.attendant.duration.from'
            render={({ field }) => (
              <FormItem>
                <DatePickerField
                  field={{ value: field.value ?? '', onChange: field.onChange }}
                  label='From'
                  placeholder='Select end date'
                />
              </FormItem>
            )}
          />

          {/* To Date */}
          <FormField
            control={control}
            name='medicalCertificate.attendant.duration.to'
            render={({ field }) => (
              <FormItem>
                <DatePickerField
                  field={{ value: field.value ?? '', onChange: field.onChange }}
                  label='To'
                  placeholder='Select end date'
                />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;
