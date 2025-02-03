type NotificationType = 'EMAIL' | 'SYSTEM' | 'SMS';

export interface Notification {
  status: string[];
  id: string;
  userId: string;
  type: NotificationType;
  readonly title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
  readAt: Date | string | null;
}

