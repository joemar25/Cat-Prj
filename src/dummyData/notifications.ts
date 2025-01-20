import { Notification, NotificationStats } from "@/lib/types/notification";

export const notificationStats: NotificationStats = {
  all: 6, // Total notifications
  archive: 2, // Archived notifications
  favorite: 1, // Favorite notifications
  unread: 3, // Unread notifications
};

export const notifications: Notification[] = [
  {
    id: "1",
    userId: "user-123",
    type: "EMAIL", // Keep the type as "EMAIL"
    title: "Birth Certificate Request Received",
    message:
      "Your request for a birth certificate has been received. It will be processed within 5 business days.",
    read: false,
    createdAt: new Date().toISOString(), // Current time
    readAt: null,
  },
  {
    id: "2",
    userId: "user-123",
    type: "EMAIL", // Keep the type as "EMAIL"
    title: "Death Certificate Request Approved",
    message:
      "Your request for a death certificate has been approved. You can download it from your dashboard.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    userId: "user-123",
    type: "EMAIL", // Keep the type as "EMAIL"
    title: "Marriage Certificate Request Rejected",
    message:
      "Your request for a marriage certificate has been rejected due to incomplete documentation. Please resubmit.",
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    readAt: null,
  },
  {
    id: "4",
    userId: "user-123",
    type: "EMAIL", // Keep the type as "EMAIL"
    title: "Birth Certificate Ready for Pickup",
    message:
      "Your birth certificate is ready for pickup at the nearest government office. Bring your ID for verification.",
    read: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    readAt: null,
  },
  {
    id: "5",
    userId: "user-123",
    type: "SYSTEM", // Keep the type as "EMAIL"
    title: "Death Certificate Request Under Review",
    message:
      "Your request for a death certificate is under review. You will be notified once it is processed.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "6",
    userId: "user-123",
    type: "SYSTEM", // Keep the type as "EMAIL"
    title: "Marriage Certificate Request Received",
    message:
      "Your request for a marriage certificate has been received. It will be processed within 7 business days.",
    read: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    readAt: null,
  },
];