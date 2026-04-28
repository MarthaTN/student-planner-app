export class NotificationService {
  // Methods to create, retrieve, and manage notifications
  createNotification(notification: Notification): void;
  getNotifications(): Notification[];
  markAsRead(notificationId: string): void;
  deleteNotification(notificationId: string): void;
  getUnreadCount(): number;
}