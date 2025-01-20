import { Star, Mail, Bell, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/lib/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  // Map notification types to corresponding icons
  const icons = {
    EMAIL: Mail,
    SYSTEM: Bell,
    SMS: MessageCircle,
  };

  // Get the appropriate icon based on the notification type
  const Icon = icons[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer",
        !notification.read && "bg-accent/30"
      )}
      onClick={() => onClick(notification)}
    >
      <div className="mt-1">
        {/* Render the icon */}
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        {/* Render the notification message */}
        <p className="text-sm leading-tight">{notification.message}</p>
        {/* Render the notification creation date */}
        <p className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {/* Optional: Add a button for additional actions (e.g., marking as favorite) */}
      <button className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent">
        <Star className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}