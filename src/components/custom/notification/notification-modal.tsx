import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/lib/types/notification";
import { Bell } from "lucide-react";

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ notification, isOpen, onClose }: NotificationModalProps) {
  // If there's no notification, don't render the modal
  if (!notification) return null;
  
  const date = new Date(notification.createdAt);
  const formattedDate = `${date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })} ${date.toLocaleTimeString()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <div className="flex items-start gap-4 max-w-[540px]">
            <Bell size={24} />
            <DialogTitle>{notification.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="col-span-3 text-sm">{notification.type}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 pb-4">
            <span className="col-span-3 text-sm">
              {formattedDate}
            </span>
          </div>
          <ScrollArea className="w-full rounded-md border p-4">
            <pre className="text-sm whitespace-pre-wrap">{notification.message}</pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}