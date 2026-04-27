export interface Notification {
  id: string;
  type: 'deadline' | 'reminder' | 'achievement' | 'suggestion';
  title: string;
  message: string;
  taskId?: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationPreferences {
  enableDeadlineAlerts: boolean;
  enableReminderNotifications: boolean;
  enableSuggestions: boolean;
  notificationTime: string; // HH:MM format
}