'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationItem } from './notification-item'
import { NotificationModal } from './notification-modal'
import { notifications, notificationStats } from '@/dummyData/notifications'
import { Notification } from '@/lib/types/notification'

export function NotificationList() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
  }

  const handleCloseModal = () => {
    setSelectedNotification(null)
  }

  return (
    <div className="w-full mx-auto bg-background rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">List Notification</h2>
          {notificationStats.unread > 0 && (
            <div className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
              {notificationStats.unread} unread
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Name Product"
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="p-4">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">
            All ({notificationStats.all})
          </TabsTrigger>
          <TabsTrigger value="archive">
            Archive ({notificationStats.archive})
          </TabsTrigger>
          <TabsTrigger value="favorite">
            Favorite ({notificationStats.favorite})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))}
        </TabsContent>
        <TabsContent value="archive">
          <p className="text-center text-muted-foreground py-8">No archived notifications</p>
        </TabsContent>
        <TabsContent value="favorite">
          <p className="text-center text-muted-foreground py-8">No favorite notifications</p>
        </TabsContent>
      </Tabs>

      <NotificationModal 
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={handleCloseModal}
      />
    </div>
  )
}

