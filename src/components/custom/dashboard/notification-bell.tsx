'use client'

import { formatDateTime } from '@/utils/date'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BellIcon, Circle, CircleDot, X } from 'lucide-react'
import { useNotificationActions } from '@/hooks/notification-actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type NotificationType = 'EMAIL' | 'SYSTEM' | 'SMS'

interface Notification {
  id: string
  userId: string | null
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date | string
  readAt: Date | string | null
}

export function NotificationBell({ userId }: { userId: string }) {
  const { notifications, isLoading, error, markAsRead } = useNotificationActions(userId)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { t } = useTranslation()

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      setSelectedNotification(notification)
      setIsDialogOpen(true)

      if (!notification.read) {
        try {
          // Update server state without awaiting
          markAsRead({ id: notification.id, read: true }).catch((error) => {
            console.error('Failed to mark notification as read:', error)
          })
        } catch (error) {
          console.error('Failed to handle notification click:', error)
        }
      }
    },
    [markAsRead]
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatDate = (dateInput: Date | string) => {
    try {
      const date = new Date(dateInput)
      const now = new Date()

      if (isNaN(date.getTime())) {
        return ''
      }

      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

      if (diffInMinutes < 1) return t('just_now') // "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes} ${t('minutes_ago')}`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t('hours_ago')}`
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ${t('days_ago')}`

      return formatDateTime(date)
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9 relative'
                >
                  <BellIcon className='h-[1.2rem] w-[1.2rem]' />
                  {unreadCount > 0 && (
                    <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center'>
                      {unreadCount}
                    </span>
                  )}
                  <span className='sr-only'>{t('notifications')}</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side='bottom'>{t('notifications')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align='end' className='w-80'>
          <DropdownMenuLabel className='flex justify-between items-center'>
            <span>{t('notifications')}</span>
            {unreadCount > 0 && (
              <span className='text-xs text-muted-foreground'>
                {unreadCount} {t('unread')}
              </span>
            )}
          </DropdownMenuLabel>
          {isLoading ? (
            <div className='p-4 text-sm text-center text-muted-foreground'>
              {t('loading')}...
            </div>
          ) : error ? (
            <div className='p-4 text-sm text-center text-destructive'>
              {error}
            </div>
          ) : notifications.filter((notification) => !notification.read).length === 0 ? (
            <div className='p-4 text-sm text-center text-muted-foreground'>
              {t('no_notifications')}
            </div>
          ) : (
            <ScrollArea className='h-[300px]'>
              {notifications
                .filter((notification) => !notification.read)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 hover:bg-accent cursor-pointer flex gap-2 items-start ${notification.read ? 'opacity-70' : ''
                      }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className='mt-1.5'>
                      {notification.read ? (
                        <Circle className='h-2 w-2 text-muted-foreground' />
                      ) : (
                        <CircleDot className='h-2 w-2 text-blue-500' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div
                        className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}
                      >
                        {notification.title}
                      </div>
                      <div className='text-xs text-muted-foreground line-clamp-2'>
                        {notification.message}
                      </div>
                      <div className='text-[10px] text-muted-foreground mt-1'>
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <div className="flex items-start gap-4 max-w-[540px]">
              <BellIcon size={24} />
              <DialogTitle>{selectedNotification?.title}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="grid py-4">
            {selectedNotification?.createdAt && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 text-sm">{t(selectedNotification.type)}</span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4 pb-4">
              <span className="col-span-3 text-sm">
                {selectedNotification?.createdAt ? formatDate(selectedNotification.createdAt) : ""}
              </span>
            </div>
            <ScrollArea className="w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap">{selectedNotification?.message}</pre>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
