'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { UserHeaderNavProps } from '@/types/dashboard'

export function UserHeaderNav({ user }: UserHeaderNavProps) {
  if (!user) return null

  const getInitials = () => {
    const nameParts = user.name?.split(' ') || []
    return `${nameParts[0]?.[0] ?? ''}${nameParts[nameParts.length - 1]?.[0] ?? ''}`.trim()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full border border-primary">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="object-cover"
              src={user.image ?? undefined}
              alt={user.name || ''}
            />
            <AvatarFallback>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-base font-semibold leading-tight">
              {user.name}
            </p>
            <p className="text-xs leading-normal text-gray-600">
              <span className="font-medium">{user.role}</span> | {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}