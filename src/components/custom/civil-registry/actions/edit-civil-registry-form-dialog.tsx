// src/components/custom/civil-registry/actions/edit-civil-registry-form-dialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  BaseRegistryFormWithRelations,
  updateBaseRegistryForm,
} from '@/hooks/civil-registry-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentStatus } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  registryNumber: z.string().min(1, 'Registry number is required'),
  province: z.string().min(1, 'Province is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  dateOfRegistration: z.string().min(1, 'Registration date is required'),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']),
  remarks: z.string().optional(),
  lcroNotations: z.string().optional(),
});

interface EditCivilRegistryFormDialogProps {
  form: BaseRegistryFormWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedForm: BaseRegistryFormWithRelations) => void;
}

export function EditCivilRegistryFormDialog({
  form,
  open,
  onOpenChange,
  onSave,
}: EditCivilRegistryFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registryNumber: form.registryNumber,
      province: form.province,
      cityMunicipality: form.cityMunicipality,
      pageNumber: form.pageNumber,
      bookNumber: form.bookNumber,
      dateOfRegistration: new Date(form.dateOfRegistration)
        .toISOString()
        .split('T')[0],
      status: form.status,
      remarks: form.remarks || '',
      lcroNotations: form.lcroNotations || '',
    },
  });

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateBaseRegistryForm(form.id, {
        ...values,
        dateOfRegistration: new Date(values.dateOfRegistration),
      });

      if (result.success && result.data) {
        toast.success('Form updated successfully');
        onSave(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Civil Registry Form</DialogTitle>
          <DialogDescription>
            Make changes to the civil registry form here.
          </DialogDescription>
        </DialogHeader>

        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(handleSave)}
            className='space-y-4'
          >
            <FormField
              control={editForm.control}
              name='registryNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registry Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name='province'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name='cityMunicipality'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={editForm.control}
                name='pageNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name='bookNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={editForm.control}
              name='dateOfRegistration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(DocumentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name='lcroNotations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LCRO Notations</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
