// 'use client';

// import * as React from 'react';
// import { useFormContext } from 'react-hook-form';

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

// import { cn } from '@/lib/utils';
// import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';

// interface ReceivedByCardProps {
//   className?: string;
// }

// export const ReceivedByCard: React.FC<ReceivedByCardProps> = ({
//   className,
// }) => {
//   const { control } = useFormContext<MarriageCertificateFormValues>();
//   return (
//     <Card className={cn('border dark:border-border', className)}>
//       <CardHeader>
//         <CardTitle>Received By</CardTitle>
//       </CardHeader>
//       <CardContent className='space-y-4'>
//         <FormField
//           control={control}
//           name='receivedBy.signature'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Signature</FormLabel>
//               <FormControl>
//                 <Input {...field} className='h-10' placeholder='Signature' />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           <FormField
//             control={control}
//             name='receivedBy.name'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name in Print</FormLabel>
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <FormControl>
//                     <SelectTrigger className='h-10'>
//                       <SelectValue placeholder='Select staff name' />
//                     </SelectTrigger>
//                   </FormControl>
//                   {/* <SelectContent>
//                     {CIVIL_REGISTRAR_STAFF.map((staff) => (
//                       <SelectItem key={staff.id} value={staff.name}>
//                         {staff.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent> */}
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={control}
//             name='receivedBy.title'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     className='h-10'
//                     placeholder='Title'
//                     disabled
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <DatePickerField
//           field={{
//             value: watch('receivedBy.date') || new Date(),
//             onChange: (date) => setValue('receivedBy.date', date || new Date()),
//           }}
//           label='Date'
//           placeholder='Select date'
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default ReceivedByCard;
