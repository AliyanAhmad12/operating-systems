import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // Handled separately by our audio service
    shouldSetBadge: false,
    shouldShowBanner: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

const CHANNEL_ID = 'os-notice-alert-channel';
let currentNotificationId = null;

export const NotificationService = {
  async initChannel() {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'Operating System Notice Channel',
          description: 'High-priority emergency alerts and continuous background notice playback.',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 250, 500],
          lightColor: '#ef4444',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
          sound: null, // Audio stream handled by dedicated audio service
        });
      } catch (err) {
        console.warn('Failed to configure Android notification channel:', err);
      }
    }
  },

  async requestPermissions() {
    try {
      const existingStatus = await Notifications.getPermissionsAsync();
      if (existingStatus.granted) {
        return { granted: true, status: existingStatus.status };
      }

      const requestResult = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });

      return {
        granted: requestResult.granted,
        status: requestResult.status,
      };
    } catch (err) {
      console.warn('Notification permission error:', err);
      return { granted: false, error: err.message };
    }
  },

  async checkPermissionStatus() {
    try {
      const perms = await Notifications.getPermissionsAsync();
      return perms.granted;
    } catch (e) {
      return false;
    }
  },

  async showActiveAlertNotification(customMessage) {
    try {
      await this.initChannel();

      // Dismiss any previously showing alert notification
      if (currentNotificationId) {
        await Notifications.dismissNotificationAsync(currentNotificationId).catch(() => {});
      }

      currentNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 OPERATING SYSTEM NOTICE: ACTIVE ALERT',
          body: customMessage ? customMessage.substring(0, 100) + '...' : 'Emergency alarm is running continuously in background.',
          data: { isAlertRunning: true },
          color: '#ef4444',
          sticky: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: false,
        },
        trigger: null, // deliver immediately
      });

      return currentNotificationId;
    } catch (err) {
      console.warn('Failed to schedule notification:', err);
      return null;
    }
  },

  async dismissAlertNotification() {
    try {
      if (currentNotificationId) {
        await Notifications.dismissNotificationAsync(currentNotificationId);
        currentNotificationId = null;
      }
      await Notifications.dismissAllNotificationsAsync().catch(() => {});
    } catch (err) {
      console.warn('Failed to dismiss notifications:', err);
    }
  },
};
