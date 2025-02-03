import { Star, Mail, Bell, MessageCircle, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Notification } from '@/lib/types/notification'

interface NotificationItemProps {
  notification: Notification
  onClick: (notification: Notification) => void
  onArchive: () => void
  onFavorite: () => void
}

export function NotificationItem({ notification, onClick, onArchive, onFavorite }: NotificationItemProps) {
  // Map notification types to corresponding icons
  const icons = {
    EMAIL: Mail,
    SYSTEM: Bell,
    SMS: MessageCircle,
  }

  // Get the appropriate icon based on the notification type
  const Icon = icons[notification.type]

  // Determine if the notification is archived or favorite
const isArchived = notification.status.includes('archive')
const isFavorite = notification.status.includes('favorite')

  const isRead = notification.read == false

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isArchived) {
      // If already archived, remove the archive
      onArchive() // Implement removal of archive in the parent function
    } else {
      // Otherwise, archive the notification
      onArchive() // This will handle the archiving process
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 dark:hover:bg-accent/65 hover:bg-black/20 rounded-lg transition-colors cursor-pointer',
        !notification.read && 'dark:bg-accent/60',
        !notification.read && 'bg-black/15'
      )}
      onClick={() => onClick(notification)}
    >
      <div className="mt-1">
        {/* Render the icon */}
        <Icon
          className={cn(
            'h-5 w-5',
            isRead ? 'text-primary fill-black dark:fill-white' : 'text-muted-foreground' // Change color when archived or favorite
          )}
        />
      </div>
      <div className="flex-1 space-y-1">
        {/* Render the notification message */}
        <p className="text-sm leading-tight">{notification.message}</p>
        {/* Render the notification creation date */}
        <p className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {/* Archive and Favorite buttons */}
      <div className="flex space-x-2">
        <button 
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent"
          onClick={handleArchiveClick}
        >
          <Archive
            className={cn(
              'h-4 w-4',
              isArchived ? 'text-primary fill-chart-1' : 'text-muted-foreground' // Change color when archived
            )}
          />
        </button>
        <button 
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
        >
          <Star
            className={cn(
              'h-4 w-4',
              isFavorite ? 'text-chart-3 fill-chart-3' : 'text-muted-foreground' // Change color when favorite
            )}
          />
        </button>
      </div>
    </div>
  )
}
