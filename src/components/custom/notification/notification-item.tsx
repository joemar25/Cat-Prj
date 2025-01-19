import { Star, Mail, Calendar, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Notification } from '@/lib/types/notification'

interface NotificationItemProps {
  notification: Notification
  onClick: (notification: Notification) => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const icons = {
    customer: Mail,
    sales: Star,
    meeting: Calendar,
    payment: CreditCard,
  }

  const Icon = icons[notification.type]

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer",
        !notification.isRead && "bg-accent/30"
      )}
      onClick={() => onClick(notification)}
    >
      <div className="mt-1">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-tight">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
      </div>
      <button className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent">
        <Star className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

