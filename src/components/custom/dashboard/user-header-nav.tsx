'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { handleSignOut } from '@/hooks/auth-actions'
import { UserHeaderNavProps } from '@/types/dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function UserHeaderNav({ user }: UserHeaderNavProps) {
  const { t } = useTranslation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get user display name with proper fallbacks
  const getDisplayName = () => {
    if (user?.name?.trim()) {
      // If full name exists, use it
      return user.name
    } else if (user?.username?.trim()) {
      // If username exists, format it
      return `@${user.username}`
    } else if (user?.email) {
      // If only email exists, use part before @
      return user.email.split('@')[0]
    }
    return t('guest_user')
  }

  // Get initials from name or username
  const getInitials = () => {
    if (user?.name?.trim()) {
      // Get initials from full name
      return user.name
        .trim()
        .split(/\s+/)
        .map(part => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    } else if (user?.username?.trim()) {
      // Get first two letters from username
      return user.username.slice(0, 2).toUpperCase()
    } else if (user?.email) {
      // Get first letter from email
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getImageSrc = (): string | undefined => {
    if (imageError || !user?.image) return undefined
    return user.image
  }

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success(t('logging_out'), { duration: 3000 })
    setIsLoggingOut(false)
  }

  const displayName = getDisplayName()
  const initials = getInitials()

  return (
    <>
      {/* User Dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full border border-primary/20 hover:bg-accent"
            aria-label={`${displayName}'s profile menu`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                className="object-cover"
                src={getImageSrc()}
                alt={displayName}
                onError={() => setImageError(true)}
              />
              <AvatarFallback className="font-medium bg-primary/5">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">
                {displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || t('no_email')}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <Icons.user className="h-2 w-2" />
              {t('profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Icons.settings className="h-2 w-2" />
              {t('settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="cursor-pointer">
              <Icons.bell className="h-4 w-4" />
              {t('notifications')}
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onSelect={(e) => {
              e.preventDefault()
              setIsLogoutOpen(true)
            }}
          >
            <Icons.logout className="mr-2 h-4 w-4" />
            {t('sign_out')}
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('confirm_logout')}</DialogTitle>
            <DialogDescription>
              {t('confirm_logout_message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeLogout}
              disabled={isLoggingOut}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t('logging_out')}
                </>
              ) : (
                t('log_out')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}