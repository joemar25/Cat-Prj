// 'use client';

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
// import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
// ;
// import { useFormContext } from 'react-hook-form';

// const HusbandConsentInfoCard: React.FC = () => {
//   const { control } = useFormContext<MarriageCertificateFormValues>();

//   return (
//     <Card className='border dark:border-border'>
//       <CardHeader>
//         <CardTitle>Husband Consent Information</CardTitle>
//       </CardHeader>
//       <CardContent className='p-6'>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//           {/* First Name */}
//           <FormField
//             control={control}
//             name='husbandConsentGivenBy.first'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>First Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     className='h-10'
//                     placeholder='Enter first name'
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Middle Name */}
//           <FormField
//             control={control}
//             name='husbandConsentGivenBy.middle'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Middle Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     className='h-10'
//                     placeholder='Enter middle name'
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Last Name */}
//           <FormField
//             control={control}
//             name='husbandConsentGivenBy.last'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Last Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     className='h-10'
//                     placeholder='Enter last name'
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Relationship to Husband */}
//           <FormField
//             control={control}
//             name='husbandConsentRelationship'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Relationship to Husband</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className='h-10'>
//                       <SelectValue placeholder='Select relationship' />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value='father'>Father</SelectItem>
//                     <SelectItem value='mother'>Mother</SelectItem>
//                     <SelectItem value='guardian'>Legal Guardian</SelectItem>
//                     <SelectItem value='other'>Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* Complete Address */}
//           <FormField
//             control={control}
//             name='husbandConsentResidence'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Complete Address</FormLabel>
//                 <FormControl>
//                   <Input
//                     className='h-10'
//                     placeholder='House No., St., Barangay, City/Municipality, Province'
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default HusbandConsentInfoCard;
