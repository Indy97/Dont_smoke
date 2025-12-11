import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dailyFacts } from '../data/facts';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initializeNotifications(): Promise<void> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Codzienne przypomnienia',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1a5f2a',
    });

    await Notifications.setNotificationChannelAsync('motivation', {
      name: 'Motywacja',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Osiągnięcia',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0): Promise<void> {
  // Cancel existing reminder
  await cancelDailyReminder();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚭 Jak minął Twój dzień?',
      body: 'Nie zapomnij zaznaczyć, że dziś nie paliłeś! Każdy dzień się liczy.',
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });

  await AsyncStorage.setItem('reminderTime', JSON.stringify({ hour, minute }));
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleMotivationalNotification(daysSmokeFree: number): Promise<void> {
  const fact = dailyFacts[daysSmokeFree % dailyFacts.length];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💪 Twoja codzienna dawka motywacji',
      body: fact.fact,
      sound: true,
    },
    trigger: {
      seconds: 5, // Show after 5 seconds (for testing) or use hour/minute for production
    },
  });
}

export async function sendAchievementNotification(
  achievementName: string,
  achievementDescription: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏆 Nowe osiągnięcie odblokowane!',
      body: `${achievementName}: ${achievementDescription}`,
      sound: true,
    },
    trigger: null, // Send immediately
  });
}

export async function sendStreakReminderNotification(streak: number): Promise<void> {
  const messages = [
    `Masz już ${streak} dni bez papierosa! Kontynuuj świetną passę!`,
    `Niesamowite! ${streak} dni wolności od nikotyny!`,
    `${streak} dni sukcesu! Twoje płuca Ci dziękują!`,
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Twoja passa rośnie!',
      body: randomMessage,
      sound: true,
    },
    trigger: null,
  });
}

export async function getReminderSettings(): Promise<{ hour: number; minute: number } | null> {
  const settings = await AsyncStorage.getItem('reminderTime');
  return settings ? JSON.parse(settings) : null;
}
