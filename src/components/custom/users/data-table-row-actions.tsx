'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { deactivateUser } from '@/hooks/users-action';
import { hasPermission } from '@/types/auth';
import { User } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditUserDialog } from './actions/edit-user-dialog';

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

interface DataTableRowActionsProps {
  row: Row<User>;
  onUpdateAction?: (updatedUser: User) => void; // Use a serializable action
}

export function DataTableRowActions({
  row,
  onUpdateAction,
}: DataTableRowActionsProps) {
  const { data: session } = useSession();
  const user = row.original;
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Check permissions
  const canManageUsers = hasPermission(
    session?.user?.permissions ?? [],
    'USERS_MANAGE'
  );
  if (!canManageUsers) return null;

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      const result = await deactivateUser(user.id);
      if (result.success) {
        toast.success(result.message);
        onUpdateAction?.({ ...user, emailVerified: false }); // Update user in parent component
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleActivate = async () => {
  //     setIsLoading(true)
  //     try {
  //       const result = await activateUser(user.id)
  //       if (result.success) {
  //         toast.success(result.message)
  //         onUpdateAction?.({ ...user, emailVerified: true }) // Update user in parent component
  //       } else {
  //         toast.error(result.message)
  //       }
  //     } catch (error) {
  //       console.error('Error activating user:', error)
  //       toast.error('An unexpected error occurred')
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  const handleSave = (updatedUser: User) => {
    toast.success(`User ${updatedUser.name} has been updated successfully!`);
    onUpdateAction?.(updatedUser); // Notify parent of the updated user data
    setEditDialogOpen(false); // Close the dialog
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
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>

          {user.emailVerified ? (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={handleDeactivate}
              disabled={isLoading}
              className='text-destructive focus:text-destructive'
            >
              <Icons.trash className='mr-2 h-4 w-4' />
              {isLoading ? 'Deactivating...' : 'Deactivate'}
            </DropdownMenuItem>
          ) : (
            <>
              {/* <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setCertifiedCopyOpen(true)}
                disabled={isLoading}
              > 
                <Icons.check className='mr-2 h-4 w-4' />
                {isLoading ? 'Activating...' : 'Activate'}
              </DropdownMenuItem> */}
              {/* <AddCertifiedCopyDialog
                open={certifiedCopyOpen}
                onOpenChange={setCertifiedCopyOpen}
                user={user}
                onUpdateAction={onUpdateAction}
              /> */}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={user}
        open={editDialogOpen}
        onOpenChangeAction={(open) => setEditDialogOpen(open)}
        onSave={handleSave}
      />

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Name</span>
              <span className='col-span-3'>{user.name}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Email</span>
              <span className='col-span-3'>{user.email}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Role</span>
              <span className='col-span-3'>{user.role}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Status</span>
              <span className='col-span-3'>
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
