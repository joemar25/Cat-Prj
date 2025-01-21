'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { hasPermission } from '@/types/auth';
import { FormType } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditCivilRegistryFormDialog } from './actions/edit-civil-registry-form-dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BaseRegistryFormWithRelations,
  deleteBaseRegistryForm,
} from '@/hooks/civil-registry-action';
import { JsonValue } from '@prisma/client/runtime/library';
import { Eye, Plus, Printer } from 'lucide-react';

import BirthAnnotationForm from '../forms/annotations/birthcert';
import DeathAnnotationForm from '../forms/annotations/death-annotation-form';
import MarriageAnnotationForm from '../forms/annotations/marriage-annotation-form';
import { ScanFormDialog } from './actions/scan-form-dialog';

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>;
  onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void;
}

const formTypeLabels: Record<FormType, string> = {
  MARRIAGE: 'Marriage (Form 97)',
  BIRTH: 'Birth (Form 102)',
  DEATH: 'Death (Form 103)',
};

const statusVariants: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  VERIFIED: { label: 'Verified', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  EXPIRED: { label: 'Expired', variant: 'outline' },
};

export function DataTableRowActions({
  row,
  onUpdateAction,
}: DataTableRowActionsProps) {
  console.log('Row data:', row); // Log the row data
  const { data: session } = useSession();
  const form = row.original;
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // -----------------

  const [birthFormOpen, setBirthFormOpen] = useState(false);
  const [deathFormOpen, setDeathFormOpen] = useState(false);
  const [marriageFormOpen, setMarriageFormOpen] = useState(false);

  const handleOpenForm = () => {
    switch (form.formType) {
      case 'BIRTH':
        setBirthFormOpen(true);
        break;
      case 'DEATH':
        setDeathFormOpen(true);
        break;
      case 'MARRIAGE':
        setMarriageFormOpen(true);
        break;
      default:
        toast.error('Unknown form type');
    }
  };

  // Check permissions
  const canManageForms = hasPermission(
    session?.user?.permissions ?? [],
    'DOCUMENTS_MANAGE'
  );
  if (!canManageForms) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteBaseRegistryForm(form.id);
      if (result.success) {
        toast.success(result.message);
        onUpdateAction?.(form); // Notify parent of the deleted form
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (updatedForm: BaseRegistryFormWithRelations) => {
    toast.success(`Form ${updatedForm.id} has been updated successfully!`);
    onUpdateAction?.(updatedForm); // Notify parent of the updated form data
    setEditDialogOpen(false); // Close the dialog
  };

  interface FullNameFormat {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }

  interface ShortNameFormat {
    first?: string;
    middle?: string;
    last?: string;
  }

  type NameObject = FullNameFormat | ShortNameFormat;

  const isNameObject = (value: unknown): value is NameObject => {
    if (!value || typeof value !== 'object') return false;
    const obj = value as Record<string, unknown>;
    return (
      (('firstName' in obj || 'first' in obj) &&
        ('lastName' in obj || 'last' in obj)) ||
      'middleName' in obj ||
      'middle' in obj
    );
  };

  const formatName = (nameObj: JsonValue | null): string => {
    if (!nameObj) return '';

    if (typeof nameObj === 'string') {
      try {
        const parsed = JSON.parse(nameObj);
        if (!isNameObject(parsed)) return nameObj;

        const firstName =
          (parsed as FullNameFormat).firstName ||
          (parsed as ShortNameFormat).first ||
          '';
        const middleName =
          (parsed as FullNameFormat).middleName ||
          (parsed as ShortNameFormat).middle ||
          '';
        const lastName =
          (parsed as FullNameFormat).lastName ||
          (parsed as ShortNameFormat).last ||
          '';

        return `${firstName} ${middleName ? middleName + ' ' : ''
          }${lastName}`.trim();
      } catch {
        return nameObj;
      }
    }

    if (isNameObject(nameObj)) {
      const firstName =
        (nameObj as FullNameFormat).firstName ||
        (nameObj as ShortNameFormat).first ||
        '';
      const middleName =
        (nameObj as FullNameFormat).middleName ||
        (nameObj as ShortNameFormat).middle ||
        '';
      const lastName =
        (nameObj as FullNameFormat).lastName ||
        (nameObj as ShortNameFormat).last ||
        '';

      return `${firstName} ${middleName ? middleName + ' ' : ''
        }${lastName}`.trim();
    }

    return String(nameObj);
  };

  const getSpecificFormDetails = () => {
    if (form.marriageCertificateForm) {
      return (
        <>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Husband</span>
            <span className='col-span-3'>
              {`${form.marriageCertificateForm.husbandFirstName} ${form.marriageCertificateForm.husbandLastName}`}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Wife</span>
            <span className='col-span-3'>
              {`${form.marriageCertificateForm.wifeFirstName} ${form.marriageCertificateForm.wifeLastName}`}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Date of Marriage</span>
            <span className='col-span-3'>
              {new Date(
                form.marriageCertificateForm.dateOfMarriage
              ).toLocaleDateString()}
            </span>
          </div>
        </>
      );
    } else if (form.birthCertificateForm) {
      return (
        <>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Child Name</span>
            <span className='col-span-3'>
              {formatName(form.birthCertificateForm.childName)}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Date of Birth</span>
            <span className='col-span-3'>
              {new Date(
                form.birthCertificateForm.dateOfBirth
              ).toLocaleDateString()}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Sex</span>
            <span className='col-span-3'>{form.birthCertificateForm.sex}</span>
          </div>
        </>
      );
    } else if (form.deathCertificateForm) {
      return (
        <>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Deceased Name</span>
            <span className='col-span-3'>
              {formatName(form.deathCertificateForm.deceasedName)}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Date of Death</span>
            <span className='col-span-3'>
              {new Date(
                form.deathCertificateForm.dateOfDeath
              ).toLocaleDateString()}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-medium'>Sex</span>
            <span className='col-span-3'>{form.deathCertificateForm.sex}</span>
          </div>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <Icons.moreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("hello")}>
            <Eye className='mr-2 h-4 w-4' />
            Import Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("hello")}>
            <Printer className='mr-2 h-4 w-4' />
            Print Document
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem> */}
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ScanFormDialog />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenForm}>
            <Plus className='mr-2 h-4 w-4' />
            Issue Certificate
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleDelete}
            disabled={isLoading}
            className='text-destructive focus:text-destructive'
          >
            <Icons.trash className='mr-2 h-4 w-4' />
            {isLoading ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >

      {/* Edit Form Dialog */}
      < EditCivilRegistryFormDialog
        form={form}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen} >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
            <DialogDescription>
              Detailed information about the civil registry form.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Form Type</span>
              <span className='col-span-3'>
                {formTypeLabels[form.formType]}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Registry No.</span>
              <span className='col-span-3'>{form.registryNumber}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Status</span>
              <span className='col-span-3'>
                <Badge variant={statusVariants[form.status].variant}>
                  {statusVariants[form.status].label}
                </Badge>
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Location</span>
              <span className='col-span-3'>
                {form.cityMunicipality}, {form.province}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Filing Info</span>
              <span className='col-span-3'>
                Book {form.bookNumber}, Page {form.pageNumber}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Prepared By</span>
              <span className='col-span-3'>
                {form.preparedBy?.name || 'N/A'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Verified By</span>
              <span className='col-span-3'>
                {form.verifiedBy?.name || 'N/A'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Registration</span>
              <span className='col-span-3'>
                {new Date(form.dateOfRegistration).toLocaleDateString()}
              </span>
            </div>

            {/* Form-specific details */}
            {getSpecificFormDetails()}

            {form.remarks && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <span className='font-medium'>Remarks</span>
                <span className='col-span-3'>{form.remarks}</span>
              </div>
            )}
            {form.lcroNotations && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <span className='font-medium'>LCRO Notations</span>
                <span className='col-span-3'>{form.lcroNotations}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog >

      <BirthAnnotationForm
        open={birthFormOpen}
        onOpenChange={setBirthFormOpen}
        onCancel={() => setBirthFormOpen(false)}
      />
      <DeathAnnotationForm
        open={deathFormOpen}
        onOpenChange={setDeathFormOpen}
        onCancel={() => setDeathFormOpen(false)}
      />
      <MarriageAnnotationForm
        open={marriageFormOpen}
        onOpenChange={setMarriageFormOpen}
        onCancel={() => setMarriageFormOpen(false)}
      />
    </>
  );
}
