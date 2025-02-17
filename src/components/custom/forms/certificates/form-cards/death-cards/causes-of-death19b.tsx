'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const CausesOfDeath19bCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>19b. Causes of Death</CardTitle>
        <p className='text-sm text-muted-foreground'>
          If the deceased is aged 8 days and over
        </p>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* I. Immediate Cause */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>I. Immediate Cause (a)</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='causesOfDeath19b.immediate.cause'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cause</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the immediate cause of death'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='causesOfDeath19b.immediate.interval'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval Between Onset and Death</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g., 2 hours, 3 days, 1 week'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Antecedent Cause */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>Antecedent Cause (b)</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='causesOfDeath19b.antecedent.cause'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cause</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the antecedent cause'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='causesOfDeath19b.antecedent.interval'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval Between Onset and Death</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g., 2 weeks, 1 month' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Underlying Cause */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>Underlying Cause (c)</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='causesOfDeath19b.underlying.cause'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cause</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the underlying cause'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='causesOfDeath19b.underlying.interval'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval Between Onset and Death</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g., 6 months, 1 year' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* II. Other Significant Conditions */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>
            II. Other Significant Conditions
          </h3>
          <FormField
            control={control}
            name='causesOfDeath19b.otherSignificantConditions'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Other significant conditions contributing to death:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter other significant conditions'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CausesOfDeath19bCard;
