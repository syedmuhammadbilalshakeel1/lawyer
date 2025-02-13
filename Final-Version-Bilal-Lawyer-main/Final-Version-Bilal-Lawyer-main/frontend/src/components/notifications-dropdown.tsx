import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router"; // Import useRouter

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<
    { id: string; senderName: string; time: string; read: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  // Function to fetch notifications from the API
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous error
    try {
      const id = localStorage.getItem("userId");
      const response = await axios.get(`/api/api/getNotifications/${id}`);
      if (response.status === 200) {
        const formattedNotifications = response.data.notifications.map(
          (notification: any) => ({
            id: notification._id,
            senderName: notification.senderName,
            time: new Date(notification.date).toLocaleString(),
            read: notification.read, // Add the 'read' status from the backend
          })
        );
        setNotifications(formattedNotifications);
      }
    } catch (err: any) {
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      console.log("🚀 ~ markAsRead ~ notificationId:", notificationId);
      await axios.put(
        `/api/api/updateNotificationReadStatus/${notificationId}`,
        { read: true }
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card className="absolute right-0 mt-2 w-80 z-50 bg-white">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new notifications</p>
        ) : (
          <div
            className="max-h-36 overflow-y-auto" // Scrollable area
          >
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`text-sm p-2 rounded-lg cursor-pointer ${
                  notification.read
                    ? "bg-gray-100 text-gray-500" // Style for read notifications
                    : "bg-blue-100 text-blue-800" // Style for unread notifications
                } hover:bg-gray-200`}
              >
                <p>{notification.senderName}</p>
                <p className="text-xs mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
