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

  const getInitials = () => {
    if (!user?.name) return 'U'
    const nameParts = user.name.split(' ')
    return (nameParts[0]?.[0] + (nameParts[1]?.[0] || '')).toUpperCase()
  }

  const getImageSrc = (): string | undefined => {
    if (imageError || !user?.image) return undefined
    return user.image
  }

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success('Logging out...', { duration: 3000 })
    setIsLoggingOut(false)
  }

  return (
    <>
      {/* User Dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full border border-primary">
            <Avatar className="h-8 w-8">
              <AvatarImage
                className="object-cover"
                src={getImageSrc()}
                alt={user?.name || 'User'}
                onError={() => setImageError(true)}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-base font-semibold leading-tight">
                {user?.name || t('guest_user')}
              </p>
              <p className="text-xs leading-normal text-gray-600">
                {user?.email || t('no_email')}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">{t('profile')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications">{t('notifications')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => {
              e.preventDefault()
              setIsLogoutOpen(true)
            }}
          >
            {t('sign_out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{t('confirm_logout')}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t('confirm_logout_message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={closeLogout}
              variant="outline"
              className="px-4 py-2 text-sm rounded-md"
              disabled={isLoggingOut}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
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