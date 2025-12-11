import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  scheduleDailyReminder,
  cancelDailyReminder,
  getReminderSettings,
} from '../services/notifications';
import { usePremium } from '../contexts/PremiumContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { isPremium, features } = usePremium();

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    motivationalQuotes: true,
    achievements: true,
    weeklyReport: false,
  });

  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getReminderSettings();
    if (settings) {
      const date = new Date();
      date.setHours(settings.hour, settings.minute, 0, 0);
      setReminderTime(date);
    }
  };

  const handleNotificationToggle = async (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));

    if (key === 'dailyReminder') {
      if (value) {
        await scheduleDailyReminder(reminderTime.getHours(), reminderTime.getMinutes());
        Alert.alert('Włączono', 'Codzienne przypomnienie zostało włączone');
      } else {
        await cancelDailyReminder();
        Alert.alert('Wyłączono', 'Codzienne przypomnienie zostało wyłączone');
      }
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
      if (notifications.dailyReminder) {
        await scheduleDailyReminder(selectedDate.getHours(), selectedDate.getMinutes());
        Alert.alert(
          'Zaktualizowano',
          `Przypomnienie będzie wysyłane o ${selectedDate.getHours()}:${selectedDate.getMinutes().toString().padStart(2, '0')}`
        );
      }
    }
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    disabled = false,
    isPremiumFeature = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    isPremiumFeature?: boolean;
  }) => (
    <View style={[styles.settingRow, disabled && styles.settingRowDisabled]}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color={disabled ? '#ccc' : '#1a5f2a'} />
      </View>
      <View style={styles.settingContent}>
        <View style={styles.settingTitleRow}>
          <Text style={[styles.settingTitle, disabled && styles.settingTitleDisabled]}>
            {title}
          </Text>
          {isPremiumFeature && !isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text style={[styles.settingSubtitle, disabled && styles.settingSubtitleDisabled]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || (isPremiumFeature && !isPremium)}
        trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
        thumbColor={value ? '#1a5f2a' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ustawienia</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Powiadomienia</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              icon="notifications-outline"
              title="Codzienne przypomnienie"
              subtitle={`Codziennie o ${reminderTime.getHours()}:${reminderTime.getMinutes().toString().padStart(2, '0')}`}
              value={notifications.dailyReminder}
              onValueChange={(value) => handleNotificationToggle('dailyReminder', value)}
            />

            {notifications.dailyReminder && (
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#1a5f2a" />
                <Text style={styles.timePickerText}>Zmień godzinę przypomnienia</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            )}

            <SettingRow
              icon="chatbubble-outline"
              title="Motywacyjne cytaty"
              subtitle="Otrzymuj codzienne dawki motywacji"
              value={notifications.motivationalQuotes}
              onValueChange={(value) => handleNotificationToggle('motivationalQuotes', value)}
            />

            <SettingRow
              icon="trophy-outline"
              title="Powiadomienia o osiągnięciach"
              subtitle="Gdy odblokujesz nowe osiągnięcie"
              value={notifications.achievements}
              onValueChange={(value) => handleNotificationToggle('achievements', value)}
            />

            <SettingRow
              icon="document-text-outline"
              title="Tygodniowy raport"
              subtitle="Podsumowanie Twoich postępów"
              value={notifications.weeklyReport}
              onValueChange={(value) => handleNotificationToggle('weeklyReport', value)}
              isPremiumFeature={true}
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wygląd</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              icon="moon-outline"
              title="Tryb ciemny"
              subtitle="Dostosuj do Twoich preferencji"
              value={darkMode}
              onValueChange={setDarkMode}
              isPremiumFeature={true}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dane</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="download-outline" size={22} color="#1a5f2a" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Eksportuj dane</Text>
                <Text style={styles.settingSubtitle}>Pobierz swoje statystyki</Text>
              </View>
              {isPremium ? (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              ) : (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={10} color="#FFD700" />
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  'Wyczyść dane',
                  'Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.',
                  [
                    { text: 'Anuluj', style: 'cancel' },
                    { text: 'Usuń', style: 'destructive', onPress: () => {} },
                  ]
                )
              }
            >
              <View style={[styles.settingIconContainer, { backgroundColor: '#ffebee' }]}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: '#e74c3c' }]}>Wyczyść dane</Text>
                <Text style={styles.settingSubtitle}>Usuń wszystkie swoje dane</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O aplikacji</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="document-text-outline" size={22} color="#1a5f2a" />
              </View>
              <Text style={styles.settingTitle}>Regulamin</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#1a5f2a" />
              </View>
              <Text style={styles.settingTitle}>Polityka prywatności</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="information-circle-outline" size={22} color="#1a5f2a" />
              </View>
              <Text style={styles.settingTitle}>Wersja aplikacji</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingTitleDisabled: {
    color: '#999',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingSubtitleDisabled: {
    color: '#bbb',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 3,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timePickerText: {
    flex: 1,
    fontSize: 14,
    color: '#1a5f2a',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
});
