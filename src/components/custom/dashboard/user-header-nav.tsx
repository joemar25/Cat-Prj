// src/components/custom/dashboard/user-header-nav.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { UserHeaderNavProps } from '@/types/dashboard'

export function UserHeaderNav({ user }: UserHeaderNavProps) {
  const getInitials = () => {
    const nameParts = user?.name?.split(' ') || []
    return `${nameParts[0]?.[0] ?? ''}${nameParts[nameParts.length - 1]?.[0] ?? ''}`.toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full border border-primary">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="object-cover"
              src={user?.image ?? undefined}
              alt={user?.name || ''}
            />
            <AvatarFallback>
              {getInitials()}
            </AvatarFallback>
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
        <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}