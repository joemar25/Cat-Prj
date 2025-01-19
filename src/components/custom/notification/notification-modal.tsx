import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Notification } from "@/lib/types/notification"

interface EmailModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

export function NotificationModal({ notification, isOpen, onClose }: EmailModalProps) {
    if (!notification || !notification.email) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{notification.email.subject}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">From:</span>
              <span className="col-span-3 text-sm">{notification.email.from}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Date:</span>
              <span className="col-span-3 text-sm">{notification.timestamp}</span>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap">{notification.email.body}</pre>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

