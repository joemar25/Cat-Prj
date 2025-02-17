'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import LocationSelector from '../shared-components/location-selector';

const DisposalInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold">Disposal Information</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disposal Method */}
        <FormField
          control={control}
          name="corpseDisposal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Corpse Disposal Method</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  placeholder="Burial, Cremation, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Burial/Cremation Permit Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Burial/Cremation Permit</h4>
            <FormField
              control={control}
              name="burialPermit.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Enter permit number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="burialPermit.dateIssued"
              render={({ field }) => (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    label="Date Issued"
                    ref={field.ref}
                    placeholder="Select date issued"
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Transfer Permit Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Transfer Permit (if applicable)</h4>
            <FormField
              control={control}
              name="transferPermit.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Enter permit number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="transferPermit.dateIssued"
              render={({ field }) => (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: field.value ?? null,
                      onChange: field.onChange,
                    }}
                    label="Date Issued"
                    placeholder="Select date issued"
                    ref={field.ref}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Cemetery or Crematory Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Cemetery or Crematory Information</h4>
          <FormField
            control={control}
            name="cemeteryOrCrematory.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="Enter cemetery or crematory name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Use LocationSelector for the cemetery/crematory address */}
          <LocationSelector
     
            provinceFieldName="cemeteryOrCrematory.address.province"
            municipalityFieldName="cemeteryOrCrematory.address.cityMunicipality"
            barangayFieldName="cemeteryOrCrematory.address.barangay"
            provinceLabel="Province"
            municipalityLabel="City/Municipality"
            barangayLabel="Barangay"
            provincePlaceholder="Select province..."
            municipalityPlaceholder="Select city/municipality..."
            barangayPlaceholder="Select barangay..."
            showBarangay={true}
            isNCRMode={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisposalInformationCard;
