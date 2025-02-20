// 'use client';

// import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';

// import { cn } from '@/lib/utils';
// import * as React from 'react';
// import { useFormContext } from 'react-hook-form';

// interface RegisteredAtOfficeCardProps {
//   className?: string;
// }

// const RegisteredAtOfficeCard: React.FC<RegisteredAtOfficeCardProps> = ({
//   className,
// }) => {
//   const { control, watch, setValue } =
//     useFormContext<MarriageCertificateFormValues>();
//   const selectedName = watch('registeredAtCivilRegistrar.name');

//   // Auto-fill title when name is selected
//   React.useEffect(() => {
//     const staff = CIVIL_REGISTRAR_STAFF.find(
//       (staff) => staff.name === selectedName
//     );
//     if (staff) {
//       setValue('registeredAtCivilRegistrar.title', staff.title);
//     }
//   }, [selectedName, setValue]);

//   // Set default date to today when component mounts
//   React.useEffect(() => {
//     if (!watch('registeredAtCivilRegistrar.date')) {
//       setValue('registeredAtCivilRegistrar.date', new Date());
//     }
//   }, [setValue, watch]);

//   return (
//     <Card className={cn('border dark:border-border', className)}>
//       <CardHeader>
//         <CardTitle>Registered at the Office of Civil Registrar</CardTitle>
//       </CardHeader>
//       <CardContent className='space-y-4'>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//           {/* Name in Print */}
//           <FormField
//             control={control}
//             name='registeredAtCivilRegistrar.name'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name in Print</FormLabel>
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <FormControl>
//                     <SelectTrigger className='h-10'>
//                       <SelectValue placeholder='Select staff name' />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {CIVIL_REGISTRAR_STAFF.map((staff) => (
//                       <SelectItem key={staff.id} value={staff.name}>
//                         {staff.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Title or Position */}
//           <FormField
//             control={control}
//             name='registeredAtCivilRegistrar.title'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title or Position</FormLabel>
//                 <FormControl>
//                   <Input
//                     className='h-10'
//                     placeholder='Title will auto-fill'
//                     {...field}
//                     disabled
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Date */}
//           <FormField
//             control={control}
//             name='registeredAtCivilRegistrar.date'
//             render={({ field }) => (
//               <DatePickerField
//                 field={{
//                   value: field.value || new Date(),
//                   onChange: (date) => field.onChange(date || new Date()),
//                 }}
//                 label='Date'
//                 placeholder='Select date'
//               />
//             )}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default RegisteredAtOfficeCard;
