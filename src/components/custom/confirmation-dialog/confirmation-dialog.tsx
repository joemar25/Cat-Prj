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
  formType: 'BIRTH' | 'MARRIAGE' | 'DEATH'; // Accept formType prop
  localStorageKey?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  title?: string; // Optional title override
  description?: string; // Optional description override
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  formType,
  localStorageKey = `skip${formType}Alert`,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  title = `Confirm ${
    formType.charAt(0) + formType.slice(1).toLowerCase()
  } Registration`,
  description = `Are you sure all the details for this ${formType.toLowerCase()} certificate are filled up correctly? This action cannot be undone.`,
}: ConfirmationDialogProps) {
  // Always call hooks at the top level.
  const [skipAlert, setSkipAlert] = useState(false);

  // On mount, check localStorage for the user's preference.
  useEffect(() => {
    const savedPreference = localStorage.getItem(localStorageKey);
    if (savedPreference === 'true') {
      setSkipAlert(true);
    }
  }, [localStorageKey]);

  // If the user has chosen to skip the alert and the dialog is open,
  // immediately call onConfirm. (We do not return early, so hooks order stays the same.)
  useEffect(() => {
    if (skipAlert && open) {
      onConfirm();
    }
  }, [skipAlert, open, onConfirm]);

  // We compute the "actual" open value. Even if `open` is true,
  // if skipAlert is true we want the AlertDialog to be hidden.
  const computedOpen = open && !skipAlert;

  return (
    <AlertDialog open={computedOpen} onOpenChange={onOpenChange}>
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
              const value = checked as boolean;
              setSkipAlert(value);
              if (value) {
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

// Optional helper function to check if alerts should be skipped.
export function shouldSkipAlert(key: string): boolean {
  return localStorage.getItem(key) === 'true';
}
