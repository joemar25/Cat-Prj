export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'customer' | 'sales' | 'meeting' | 'payment';
    email?: {
      subject: string;
      body: string;
      from: string;
    };
  }
  
  export interface NotificationStats {
    all: number;
    archive: number;
    favorite: number;
    unread: number;
  }
  
  