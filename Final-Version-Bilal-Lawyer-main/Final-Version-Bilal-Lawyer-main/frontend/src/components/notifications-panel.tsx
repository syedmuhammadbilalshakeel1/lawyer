import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Mock data for notifications
const notifications = [
  { id: 1, message: "New comment on your post", time: "5 min ago" },
  { id: 2, message: "You have a new follower", time: "1 hour ago" },
  {
    id: 3,
    message: "Your task 'Create wireframes' is due soon",
    time: "3 hours ago",
  },
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <div className="mt-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="mb-4 p-3 bg-secondary rounded-md"
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.time}
              </p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
