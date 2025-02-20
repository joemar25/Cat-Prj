'use client';
import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


interface AffidavitForDelayedMarriageRegistrationProps {
    className?: string;
}

export const AffidavitForDelayedMarriageRegistration: React.FC<
    AffidavitForDelayedMarriageRegistrationProps
> = ({ className }) => {
    const { control, watch } = useFormContext<MarriageCertificateFormValues>();
    const [affiant, setAffiant] = React.useState(false);
    const [execution, setExecution] = React.useState(false);

    const [ncrModeAdminOfficer, setNcrModeAdminOfficer] = React.useState(false);
    const [ncrModeSwornOfficer, setNcrModeSwornOfficer] = React.useState(false);

    const agreementA = useWatch({ control, name: 'affidavitForDelayed.a.a.agreement' });
    const agreementB = useWatch({ control, name: 'affidavitForDelayed.a.b.agreement' });
    // Watch specific form fields for dynamic updates
    //   const marriageLicenseNumber = watch('marriageLicenseDetails.number');
    //   const marriageLicenseDateIssued = watch('marriageLicenseDetails.dateIssued');
    //   const marriageLicensePlaceIssued = watch('marriageLicenseDetails.placeIssued');
    //   const marriageArticleNumber = watch('marriageArticle.articleExecutiveOrder');

    return (
        <Card className={cn('border dark:border-border', className)}>
            <CardHeader>
                <CardTitle>Affidavit for Delayed Marriage Registration</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
                <div className='space-y-4'>



                    {/* Affiant information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Affiant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <NCRModeSwitch
                                isNCRMode={affiant}
                                setIsNCRMode={setAffiant}
                            />
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.applicantInformation.nameOfApplicant'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Name of Affiant
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    className='h-10'
                                                    placeholder='Enter officer name'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <LocationSelector
                                    provinceFieldName='affidavitForDelayed.applicantInformation.applicantAddress.province'
                                    municipalityFieldName='affidavitForDelayed.applicantInformation.applicantAddress.cityMunicipality'
                                    barangayFieldName='affidavitForDelayed.applicantInformation.applicantAddress.barangay'
                                    provinceLabel='Province'
                                    municipalityLabel='City/Municipality'
                                    barangayLabel='Barangay'
                                    isNCRMode={affiant}
                                    showBarangay={true}
                                    provincePlaceholder='Select province'
                                    municipalityPlaceholder='Select city/municipality'
                                    barangayPlaceholder='Select barangay'
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.applicantInformation.applicantAddress.st'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street</FormLabel>
                                            <FormControl>
                                                <Input type='text' className='h-10' placeholder='Enter complete address' {...field}
                                                    value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/*Country */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.applicantInformation.applicantAddress.country'
                                    render={({ field }) => (
                                        <FormItem> 
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input type='text' className='h-10' placeholder='Enter complete address' {...field}
                                                    value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Postal Code */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.applicantInformation.postalCode'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text' className='h-10' placeholder='Enter complete address'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    maxLength={6}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.applicantInformation.signatureOfApplicant'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Signature (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text' className='h-10' placeholder='This is optional'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant for the delayed registration</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                            <FormField
                                control={control}
                                name='affidavitForDelayed.a.a.agreement'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                            a. (the affiant is the husband or wife)
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            {agreementA && (
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.a.a.nameOfPartner.first'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-foreground'>
                                                    Partner's (first)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='h-10'
                                                        placeholder='Enter officer name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.a.a.nameOfPartner.middle'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-foreground'>
                                                    Partner's (middle)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='h-10'
                                                        placeholder='Enter officer name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.a.a.nameOfPartner.last'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-foreground'>
                                                    Partner's (last)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='h-10'
                                                        placeholder='Enter officer name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='col-span-3'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                            <FormField
                                                control={control}
                                                name='affidavitForDelayed.a.a.dateOfMarriage'
                                                render={({ field }) => (
                                                    <DatePickerField field={{
                                                        value: field.value || '',
                                                        onChange: field.onChange,
                                                    }} label='Issued on' />
                                                )}
                                            />
                                            <FormField
                                                control={control}
                                                name='affidavitForDelayed.a.a.placeOfMarriage'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='text-foreground'>
                                                            Place of Marriage
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value || ''}
                                                                className='h-10'
                                                                placeholder='Enter officer name'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='pt-6 space-y-6'>
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.a.b.agreement'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className='text-sm font-normal'>
                                                a. (the affiant is not the husband or wife)
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {agreementB && (
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfHusband.first'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Husband (first)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfHusband.middle'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Husband (middle)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfHusband.last'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Husband (last)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfWife.first'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Wife (first)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfWife.middle'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Wife (middle)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='affidavitForDelayed.a.b.nameOfWife.last'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-foreground'>
                                                        Wife (last)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ''}
                                                            className='h-10'
                                                            placeholder='Enter officer name'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='col-span-3'>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                                <FormField
                                                    control={control}
                                                    name='affidavitForDelayed.a.b.dateOfMarriage'
                                                    render={({ field }) => (
                                                        <DatePickerField field={{
                                                            value: field.value || '',
                                                            onChange: field.onChange,
                                                        }} label='Issued on' />
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name='affidavitForDelayed.a.b.placeOfMarriage'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='text-foreground'>
                                                                Place of Marriage
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ''}
                                                                    className='h-10'
                                                                    placeholder='Enter officer name'
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Marriage was solemnized by</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.b.solemnizedBy' // ✅ Correct path
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Solemnizing officer/Administrator
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    className='h-10'
                                                    placeholder='Enter officer&apos;s name'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.b.sector'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sector </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        ref={field.ref}
                                                        className='h-10 px-3 text-base md:text-sm'
                                                    >
                                                        <SelectValue placeholder='Select sector' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='religious-ceremony'>Religious ceremony</SelectItem>
                                                    <SelectItem value='civil-ceremony'>Civil ceremony</SelectItem>
                                                    <SelectItem value='Muslim-rites'>Muslim rites</SelectItem>
                                                    <SelectItem value='tribal-rites'>Tribal rites</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Marriage Information</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                {/* License No */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.c.a.licenseNo'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Marriage License No.
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className='h-10'
                                                    placeholder='Enter license number'
                                                    maxLength={15}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Issued on */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.c.a.dateIssued'
                                    render={({ field }) => (
                                        <DatePickerField field={{
                                            value: field.value || '',
                                            onChange: field.onChange,
                                        }}
                                            placeholder='Select date issued'
                                            label='Issued on'
                                            ref={field.ref}
                                        />
                                    )}
                                />
                                {/* Place Issued */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.c.a.placeOfSolemnizedMarriage'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Civil Registry Office
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className='h-10'
                                                    placeholder='Enter place issued'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Article No. */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.c.b.underArticle'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Article
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className='h-10'
                                                    placeholder='Enter article number'
                                                    maxLength={6}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Husband and Wife's citizenship</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                {/* License No */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.d.husbandCitizenship'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Husband's Citizenship
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className='h-10'
                                                    placeholder='Enter license number'

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.d.wifeCitizenship'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-foreground'>
                                                Wife's Citizenship
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    className='h-10'
                                                    placeholder='Enter license number'

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reason for the delayed marriage registration</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                            <div className='grid grid-cols-1 '>
                                {/* License No */}
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.e'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='Enter reason for the delayed marriage registration'
                                                    className='min-h-[100px] resize-none'

                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Affidavit Execution (affiant address and issued date)</CardTitle>
                        </CardHeader>
                        <CardContent className='p-6 space-y-6'>
                        <NCRModeSwitch
                                isNCRMode={execution}
                                setIsNCRMode={setExecution}
                            />
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.f.date'
                                    render={({ field }) => (
                                        <DatePickerField field={{
                                            value: field.value || '',
                                            onChange: field.onChange,
                                        }} label='Issued on' />
                                    )}
                                />
                                <LocationSelector
                                    provinceFieldName='affidavitForDelayed.f.place.province'
                                    municipalityFieldName='affidavitForDelayed.f.place.cityMunicipality'
                                    barangayFieldName='affidavitForDelayed.f.place.barangay'
                                    provinceLabel='Province'
                                    municipalityLabel='City/Municipality'
                                    barangayLabel='Barangay'
                                    isNCRMode={execution}
                                    showBarangay={true}
                                    provincePlaceholder='Select province'
                                    municipalityPlaceholder='Select city/municipality'
                                    barangayPlaceholder='Select barangay'
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.f.place.st'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street</FormLabel>
                                            <FormControl>
                                                <Input type='text' className='h-10' placeholder='Enter complete address' {...field}
                                                    value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.f.place.country'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input type='text' className='h-10' placeholder='Enter complete address' {...field}
                                                    value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Officer Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscribe and Sworn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <NCRModeSwitch
                                    isNCRMode={ncrModeSwornOfficer}
                                    setIsNCRMode={setNcrModeSwornOfficer}
                                />
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {/* Date sworn on */}
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.dateSworn.dayOf'
                                        render={({ field }) => (
                                            <DatePickerField field={{
                                                value: field.value || '',
                                                onChange: field.onChange,
                                            }} label='Issued on' />
                                        )}
                                    />
                                    <LocationSelector
                                        provinceFieldName='affidavitForDelayed.dateSworn.atPlaceOfSworn.province'
                                        municipalityFieldName='affidavitForDelayed.dateSworn.atPlaceOfSworn.cityMunicipality'
                                        barangayFieldName='affidavitForDelayed.dateSworn.atPlaceOfSworn.barangay'
                                        provinceLabel='Province'
                                        municipalityLabel='City/Municipality'
                                        selectTriggerClassName='h-10 px-3 text-base md:text-sm'
                                        provincePlaceholder='Select province'
                                        municipalityPlaceholder='Select city/municipality'
                                        className='grid grid-cols-2 gap-4'
                                        isNCRMode={ncrModeSwornOfficer}
                                        showBarangay={true}
                                        barangayLabel='Barangay'
                                        barangayPlaceholder='Select barangay'
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.dateSworn.atPlaceOfSworn.st'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='h-10'
                                                        value={field.value || ''}
                                                        placeholder='Enter Office street'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.dateSworn.atPlaceOfSworn.country'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='h-10'
                                                        value={field.value || ''}
                                                        placeholder='Entry Country'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTC Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>CTC Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.dateSworn.ctcInfo.number'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CTC Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''}
                                                    placeholder='Enter CTC/Valid ID no.'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.dateSworn.ctcInfo.dateIssued'
                                    render={({ field }) => (
                                        <FormItem>
                                            <DatePickerField
                                                field={{
                                                    value: field.value ?? null,
                                                    onChange: field.onChange,
                                                }}
                                                label='Date Issued'
                                                placeholder='Select date issued'
                                                ref={field.ref}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='affidavitForDelayed.dateSworn.ctcInfo.placeIssued'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Place Issued</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''}
                                                    placeholder='Enter place/office address'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Signature of administrator */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Administering Officer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <NCRModeSwitch
                                    isNCRMode={ncrModeAdminOfficer}
                                    setIsNCRMode={setNcrModeAdminOfficer}
                                />
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.administeringInformation.nameOfOfficer'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-foreground'>
                                                    Administering Officer Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='h-10'
                                                        placeholder='Enter officer name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.administeringInformation.position'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-foreground'>
                                                    Position/Title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='h-10'
                                                        placeholder='Enter officer name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <LocationSelector
                                        provinceFieldName='affidavitForDelayed.administeringInformation.addressOfOfficer.province'
                                        municipalityFieldName='affidavitForDelayed.administeringInformation.addressOfOfficer.cityMunicipality'
                                        barangayFieldName='affidavitForDelayed.administeringInformation.addressOfOfficer.barangay'
                                        provinceLabel='Province'
                                        municipalityLabel='City/Municipality'
                                        selectTriggerClassName='h-10 px-3 text-base md:text-sm'
                                        provincePlaceholder='Select province'
                                        municipalityPlaceholder='Select city/municipality'
                                        className='grid grid-cols-2 gap-4'
                                        isNCRMode={ncrModeAdminOfficer}
                                        showBarangay={true}
                                        barangayLabel='Barangay'
                                        barangayPlaceholder='Select barangay'
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.administeringInformation.addressOfOfficer.st'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='h-10'
                                                        value={field.value || ''}
                                                        placeholder='Enter Office street'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.administeringInformation.addressOfOfficer.country'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='h-10'
                                                        value={field.value || ''}
                                                        placeholder='Entry Country'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='affidavitForDelayed.administeringInformation.signatureOfAdmin'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Signature (optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='text' className='h-10' placeholder='This is optional'
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        disabled
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </CardContent>
        </Card>
    );
};

export default AffidavitForDelayedMarriageRegistration;