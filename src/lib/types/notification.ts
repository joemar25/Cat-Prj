type NotificationType = 'EMAIL' | 'SYSTEM' | 'SMS';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  readonly title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
  readAt: Date | string | null;
}


export interface NotificationStats {
  all: number;
  archive: number;
  favorite: number;
  unread: number;
}