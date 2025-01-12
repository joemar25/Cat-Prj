// components/custom/confirmation-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  localStorageKey: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  title = 'Confirm Registration',
  description = 'Are you sure all the details are filled up correctly? This action cannot be undone.',
  localStorageKey,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}: ConfirmationDialogProps) {
  const [skipAlert, setSkipAlert] = useState(false);

  useEffect(() => {
    // Check if user has previously chosen to skip the alert
    const savedPreference = localStorage.getItem(localStorageKey);
    if (savedPreference === 'true') {
      setSkipAlert(true);
    }
  }, [localStorageKey]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className='flex items-center space-x-2 py-4'>
          <Checkbox
            id='skip-alert'
            checked={skipAlert}
            onCheckedChange={(checked) => {
              setSkipAlert(checked as boolean);
              if (checked) {
                localStorage.setItem(localStorageKey, 'true');
              } else {
                localStorage.removeItem(localStorageKey);
              }
            }}
          />
          <label
            htmlFor='skip-alert'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Don&apos;t show this message again
          </label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                <Check className='mr-2 h-4 w-4' />
                {confirmButtonText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Function to check if alerts should be skipped
export function shouldSkipAlert(key: string): boolean {
  return localStorage.getItem(key) === 'true';
}
