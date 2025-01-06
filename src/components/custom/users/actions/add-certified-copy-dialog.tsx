// src/components/custom/users/actions/add-certified-copy-dialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { certifiedCopySchema, type CertifiedCopyFormData } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCertifiedCopyDialog({ open, onOpenChange }: Props) {
  const form = useForm<CertifiedCopyFormData>({
    resolver: zodResolver(certifiedCopySchema),
    defaultValues: {
      lcrNo: '',
      bookNo: '',
      pageNo: '',
      searchedBy: '',
      contactNo: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Certified Copy Details</DialogTitle>
          <DialogDescription>
            Please fill in the certified copy details before activation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='lcrNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LCR No</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter LCR number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bookNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book No</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter book number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='pageNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page No</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter page number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='searchedBy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Searched By</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter searcher name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contactNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact No</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter contact number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>
                <Icons.check className='mr-2 h-4 w-4' />
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
