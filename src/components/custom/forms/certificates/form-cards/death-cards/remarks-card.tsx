import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate'

const RemarksCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks/Annotations (For LCRO/OCRG Use Only)</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name='remarks'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  className='min-h-[100px]'
                  placeholder='Official remarks and annotations will be entered here'
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