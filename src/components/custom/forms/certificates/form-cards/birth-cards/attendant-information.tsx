import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control, setValue } = useFormContext<BirthCertificateFormValues>();
  const [showOtherInput, setShowOtherInput] = useState(false);

  // Watch the value of `attendant.type`
  const attendantType = useWatch({
    control,
    name: 'attendant.type',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Type of Attendant Card */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Type of Attendant</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='attendant.type'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value); // Update the form value
                        setShowOtherInput(value === 'Others'); // Show/hide the input field
                        if (value === 'Others') {
                          setValue('attendant.type', ''); // Reset the value to empty string when "Others" is selected
                        } else {
                          setValue('attendant.type', value); // Set the value directly if not "Others"
                        }
                      }}
                      defaultValue={field.value}
                      className='grid grid-cols-2 md:grid-cols-5 gap-4'
                    >
                      {['Physician', 'Nurse', 'Midwife', 'Hilot', 'Others'].map(
                        (type) => (
                          <FormItem
                            key={type}
                            className='flex items-center space-x-3 space-y-0'
                          >
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {type}
                            </FormLabel>
                          </FormItem>
                        )
                      )}
                    </RadioGroup>
                  </FormControl>
                  {showOtherInput && (
                    <FormField
                      control={control}
                      name='attendant.type'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Please specify'
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value); // Update the form value with the custom input
                              }}
                              value={attendantType} // Bind the value to the current form value
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;