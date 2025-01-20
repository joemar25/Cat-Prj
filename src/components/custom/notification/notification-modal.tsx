import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/lib/types/notification";

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ notification, isOpen, onClose }: NotificationModalProps) {
  // If there's no notification, don't render the modal
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{notification.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Type:</span>
            <span className="col-span-3 text-sm">{notification.type}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Date:</span>
            <span className="col-span-3 text-sm">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <pre className="text-sm whitespace-pre-wrap">{notification.message}</pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}