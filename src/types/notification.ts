// src/types/notification.ts
import { Notification as PrismaNotification } from "@prisma/client";

export type Notification = PrismaNotification & {
    route?: string;
};

export type MarkAsReadInput = {
    id: string;
    read: boolean;
};

export type NotificationStatus = string | null;;

export type MarkAsStatusInput = {
    id: string;
    status: NotificationStatus;
};
