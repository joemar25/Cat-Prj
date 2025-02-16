import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { useFormContext } from 'react-hook-form';

const CausesOfDeathCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Causes of Death</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Immediate Cause */}
        <FormField
          control={control}
          name='medicalCertificate.causesOfDeath.immediate.cause'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immediate Cause</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter the immediate cause of death'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Antecedent Cause */}
        <FormField
          control={control}
          name='medicalCertificate.causesOfDeath.antecedent.cause'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Antecedent Cause</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter the antecedent cause of death'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Underlying Cause */}
        <FormField
          control={control}
          name='medicalCertificate.causesOfDeath.underlying.cause'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Underlying Cause</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter the underlying cause of death'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other Significant Conditions */}
        <FormField
          control={control}
          name='medicalCertificate.causesOfDeath.otherSignificantConditions'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Other Significant Conditions Contributing to Death
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter other significant conditions contributing to death'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CausesOfDeathCard;
