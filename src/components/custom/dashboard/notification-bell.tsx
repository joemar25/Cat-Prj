// src/components/custom/dashboard/notification-bell.tsx
'use client'

import { BellIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Notification } from "@/types/notification"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotificationActions } from "@/hooks/notification-actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter()
  const { notifications, isLoading, error, markAsRead } = useNotificationActions(userId)

  console.log("NotificationBell userId:", userId) // Debugging

  const handleNotificationClick = async (notification: Notification) => {
    // Mark the notification as read
    await markAsRead({ id: notification.id, read: true })

    // Navigate to the relevant route
    if (notification.route) {
      router.push(notification.route)
    }
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 relative">
                <BellIcon className="h-[1.2rem] w-[1.2rem]" />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        {isLoading ? (
          <div className="p-4 text-sm text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-4 text-sm text-center text-destructive">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-sm text-center text-muted-foreground">No new notifications</div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="text-sm font-medium">{notification.title}</div>
                <div className="text-xs text-muted-foreground">{notification.message}</div>
              </div>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}