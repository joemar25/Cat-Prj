'use client';

import { MarkAsReadInput, Notification, MarkAsStatusInput, NotificationStatus } from '@/types/notification';
import { useCallback, useEffect, useState } from 'react';

export function useNotificationPageActions(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notifications for the given userId
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notifications/page?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch notifications');
      }

      if (response.status === 204) {
        setNotifications([]);
        return;
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setNotifications(data);
      } else {
        throw new Error('Expected JSON response but got something else');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Mark a notification as read with optimistic updates
  const markAsRead = async (input: MarkAsReadInput) => {
    try {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === input.id ? { ...notification, read: input.read } : notification
        )
      );

      const response = await fetch(`/api/notifications/${input.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: input.read }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === input.id
              ? { ...notification, read: !input.read }
              : notification
          )
        );
        throw new Error(errorData.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      console.error(err);
    }
  };

  // Update the notification status (archive or favorite)
  const updateNotificationStatus = async (input: MarkAsStatusInput) => {
    try {
      // Optimistically update the status locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === input.id ? { ...notification, status: input.status } : notification
        )
      );

      const response = await fetch(`/api/notifications/page/${input.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: input.status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If the API call fails, revert the optimistic update
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === input.id
              ? { ...notification, status: notification.status } // Revert status
              : notification
          )
        );
        throw new Error(errorData.error || 'Failed to update notification status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification status');
      console.error(err);
    }
  };

  // Function to archive the notification or remove the archive status
  const archiveNotification = (id: string) => {
    const notification = notifications.find((notif) => notif.id === id);
    if (notification?.status === 'archive') {
      removearchiveNotification(id); // If it's already archived, remove the archive status
    } else {
      updateNotificationStatus({ id, status: 'archive' }); // Archive the notification
    }
  };

  // Function to favorite the notification
  const favoriteNotification = (id: string) => {
    const notification = notifications.find((notif) => notif.id === id);
    if (notification?.status === 'favorite') {
      removefavoriteNotification(id); // If it's already favorite, remove the favorite status
    } else {
      updateNotificationStatus({ id, status: 'favorite' }); // Favorite the notification
    }
  };

  // Function to remove the archive status
  const removearchiveNotification = (id: string) => {
    updateNotificationStatus({ id, status: null });
  };

  // Function to remove the favorite status
  const removefavoriteNotification = (id: string) => {
    updateNotificationStatus({ id, status: null });
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    fetchNotifications,
    archiveNotification,
    favoriteNotification,
  };
}
