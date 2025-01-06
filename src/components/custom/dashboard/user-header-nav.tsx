'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { handleSignOut } from '@/hooks/auth-actions'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserHeaderNavProps } from '@/types/dashboard'

export function UserHeaderNav({ user }: UserHeaderNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const getInitials = () => {
    const nameParts = user?.name?.split(' ') || []
    return `${nameParts[0]?.[0] ?? ''}${nameParts[nameParts.length - 1]?.[0] ?? ''}`.toUpperCase()
  }

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success('Successfully logged out', { duration: 3000 })
    setIsLoggingOut(false)
    closeLogout()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full border border-primary">
            <Avatar className="h-8 w-8">
              <AvatarImage
                className="object-cover"
                src={user?.image ?? undefined}
                alt={user?.name || ''}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-base font-semibold leading-tight">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs leading-normal text-gray-600">
                <span className="font-medium">{user?.role || 'Guest'}</span> | {user?.email || 'No email'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => {
              e.preventDefault()
              setIsLogoutOpen(true)
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="flex flex-col items-center justify-center text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-lg font-semibold">Confirm Logout</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={closeLogout}
              variant="outline"
              className="px-4 py-2 text-sm rounded-md"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}