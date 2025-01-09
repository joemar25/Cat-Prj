'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CivilRegistryForm, FormType } from '@prisma/client';
import { useState } from 'react';

interface AddCivilRegistryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddCivilRegistryFormDialog({
    open,
    onOpenChange,
    onSuccess,
}: AddCivilRegistryFormDialogProps) {
    const [formData, setFormData] = useState<Partial<CivilRegistryForm>>({
        formType: FormType.MARRIAGE,
    });

    const handleSave = async () => {
        try {
            // Replace with your API call to add a new form
            const result = await addCivilRegistryForm(formData);
            if (result.success) {
                toast.success('Form added successfully!');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error adding form:', error);
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Add Civil Registry Form</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new civil registry form.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='formType'>Form Type</Label>
                        <Input
                            id='formType'
                            value={formData.formType}
                            onChange={(e) =>
                                setFormData({ ...formData, formType: e.target.value as FormType })
                            }
                            className='col-span-3'
                        />
                    </div>
                    {/* Add more fields as needed */}
                </div>
                <Button onClick={handleSave}>Save</Button>
            </DialogContent>
        </Dialog>
    );
}