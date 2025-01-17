// src/hooks/notification-actions.ts
'use client';

import { MarkAsReadInput, Notification } from '@/types/notification';
import { useCallback, useEffect, useState } from 'react';

export function useNotificationActions(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unread notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch notifications'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Mark a notification as read with optimistic updates
  const markAsRead = async (input: MarkAsReadInput) => {
    try {
      // Optimistically update the local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === input.id
            ? { ...notification, read: input.read }
            : notification
        )
      );

      // Make the API call
      const response = await fetch(`/api/notifications/${input.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: input.read }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If the API call fails, revert the optimistic update
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === input.id
              ? { ...notification, read: !input.read }
              : notification
          )
        );
        throw new Error(
          errorData.error || 'Failed to mark notification as read'
        );
      }

      // No need to refetch here since we've already updated the local state
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to mark notification as read'
      );
      console.error(err);
    }
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
  };
}
