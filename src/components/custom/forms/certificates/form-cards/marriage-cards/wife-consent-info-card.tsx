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

// const WifeConsentInfoCard: React.FC = () => {
//   const { control } = useFormContext<MarriageCertificateFormValues>();

//   return (
//     <Card className='border dark:border-border'>
//       <CardHeader>
//         <CardTitle>Wife Consent Information</CardTitle>
//       </CardHeader>
//       <CardContent className='p-6'>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//           {/* First Name */}
//           <FormField
//             control={control}
//             name='wifeConsentGivenBy.first'
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
//             name='wifeConsentGivenBy.middle'
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
//             name='wifeConsentGivenBy.last'
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
//           {/* Relationship to Wife */}
//           <FormField
//             control={control}
//             name='wifeConsentRelationship'
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Relationship to Wife</FormLabel>
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
//             name='wifeConsentResidence'
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

// export default WifeConsentInfoCard;
