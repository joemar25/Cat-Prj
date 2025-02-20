import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';

;
import { useFormContext } from 'react-hook-form';

const RemarksCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks/Annotations</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Remarks/Annotations Field */}
        <FormField
          control={control}
          name='remarks'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Enter remarks or annotations'
                  className='min-h-[100px]'
                  {...field}
                  value={field.value ?? ''}
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

export default RemarksCard;
