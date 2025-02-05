"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationItem } from './notification-item'
import { NotificationModal } from './notification-modal'
import { Notification } from '@/lib/types/notification'
import { useNotificationPageActions } from '@/hooks/notification-page-actions'
import { useTranslation } from 'react-i18next'  // Import useTranslation

export function NotificationList({ userId }: { userId: string }) {
  const { t } = useTranslation()  // Use the useTranslation hook
  const { notifications, isLoading, error, markAsRead, archiveNotification, favoriteNotification } = useNotificationPageActions(userId)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)

    // Mark the notification as read if it's not already
    if (!notification.read) {
      markAsRead({ id: notification.id, read: true }).catch((error) => {
        console.error('Failed to mark notification as read:', error)
      })
    }
  }

  const handleCloseModal = () => {
    setSelectedNotification(null)
  }

  const filteredNotifications = notifications.filter((notification) =>
    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) // Search by message
  )

  // Filter notifications by status
  const archivedNotifications = filteredNotifications.filter((notification) =>
    notification.status.includes('archive') // Use includes() to check if 'archive' is in the status array
  )
  const favoriteNotifications = filteredNotifications.filter((notification) =>
    notification.status.includes('favorite') // Use includes() to check if 'favorite' is in the status array
  )

  return (
    <div className="w-full mx-auto bg-background rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('notificationList.title')}</h2> {/* Replace hardcoded text with translation key */}
          {filteredNotifications.filter(n => !n.read).length > 0 && (
            <div className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
              {filteredNotifications.filter(n => !n.read).length} {t('notificationList.unread')} {/* Replace hardcoded text with translation key */}
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('notificationList.searchPlaceholder')}  // Replace hardcoded text with translation key
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="p-4">
        <TabsList className="grid w-96 h-9 grid-cols-3 mb-4">
          <TabsTrigger value="all">
            {t('notificationList.all')} ({filteredNotifications.filter(n => !n.status.includes('archive')).length})
          </TabsTrigger>
          <TabsTrigger value="archive">
            {t('notificationList.archive')} ({archivedNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="favorite">
            {t('notificationList.favorite')} ({favoriteNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2 max-h-[450px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-muted-foreground">{t('notificationList.loading')}</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : filteredNotifications.filter(n => !n.status.includes('archive')).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('notificationList.noNotifications')}</div>
          ) : (
            filteredNotifications
              .filter((notification) => !notification.status.includes('archive'))
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification as Notification}
                  onClick={handleNotificationClick}
                  onArchive={() => archiveNotification(notification.id)}
                  onFavorite={() => favoriteNotification(notification.id)}
                />
              ))
          )}
        </TabsContent>

        <TabsContent value="archive" className="space-y-2 max-h-[460px] overflow-y-auto">
          {archivedNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('notificationList.noArchived')}</p>
          ) : (
            archivedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification as Notification}
                onClick={handleNotificationClick}
                onArchive={() => archiveNotification(notification.id)}
                onFavorite={() => favoriteNotification(notification.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="favorite" className="space-y-2 max-h-[460px] overflow-y-auto">
          {favoriteNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('notificationList.noFavorite')}</p>
          ) : (
            favoriteNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification as Notification}
                onClick={handleNotificationClick}
                onArchive={() => archiveNotification(notification.id)}
                onFavorite={() => favoriteNotification(notification.id)}
              />
            ))
          )}
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
