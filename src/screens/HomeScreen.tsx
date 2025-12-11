import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { usePremium } from '../contexts/PremiumContext';
import { getTodaysFact, getRandomMotivationalQuote } from '../data/facts';
import { MainStackParamList } from '../navigation/MainNavigator';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const {
    currentStreak,
    longestStreak,
    moneySaved,
    cigarettesNotSmoked,
    hasCheckedInToday,
    checkInToday,
    smokingData,
  } = useUserData();
  const { isPremium } = usePremium();

  const [quote, setQuote] = useState('');
  const [todaysFact, setTodaysFact] = useState<any>(null);

  useEffect(() => {
    setQuote(getRandomMotivationalQuote());
    setTodaysFact(getTodaysFact(currentStreak));
  }, [currentStreak]);

  const handleCheckIn = async () => {
    if (hasCheckedInToday) {
      Alert.alert('Już zaznaczone!', 'Dzisiaj już potwierdziłeś, że nie palisz. Wróć jutro!');
      return;
    }

    try {
      await checkInToday();
      Alert.alert(
        'Gratulacje! 🎉',
        `Świetnie! To już ${currentStreak + 1} dzień bez papierosa!`,
        [{ text: 'Super!' }]
      );
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zapisać. Spróbuj ponownie.');
    }
  };

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const formatTime = (days: number): string => {
    if (days === 0) return 'Rozpocznij dzisiaj!';
    if (days === 1) return '1 dzień';
    if (days < 7) return `${days} dni`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      if (remainingDays === 0) return `${weeks} ${weeks === 1 ? 'tydzień' : 'tygodnie'}`;
      return `${weeks} tyg. ${remainingDays} dni`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) return `${months} ${months === 1 ? 'miesiąc' : 'miesięcy'}`;
      return `${months} mies. ${remainingDays} dni`;
    }
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    if (remainingDays === 0) return `${years} ${years === 1 ? 'rok' : 'lat'}`;
    return `${years} ${years === 1 ? 'rok' : 'lat'} ${remainingDays} dni`;
  };

  return (
    <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Cześć, {user?.displayName || 'Wojowniku'}!</Text>
            <Text style={styles.subGreeting}>
              {hasCheckedInToday
                ? 'Dziś już potwierdziłeś - świetna robota!'
                : 'Potwierdź swój dzień bez palenia'}
            </Text>
          </View>
          {!isPremium && (
            <TouchableOpacity
              style={styles.premiumBadge}
              onPress={() => navigation.navigate('Premium')}
            >
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>PRO</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Streak Counter */}
        <View style={styles.mainCard}>
          <View style={styles.streakCircle}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>dni</Text>
          </View>
          <Text style={styles.streakTitle}>Bez papierosa</Text>
          <Text style={styles.streakSubtitle}>{formatTime(currentStreak)}</Text>

          {/* Check-in Button */}
          <TouchableOpacity
            style={[styles.checkInButton, hasCheckedInToday && styles.checkInButtonDone]}
            onPress={handleCheckIn}
            disabled={hasCheckedInToday}
          >
            <Ionicons
              name={hasCheckedInToday ? 'checkmark-circle' : 'add-circle-outline'}
              size={24}
              color="#fff"
            />
            <Text style={styles.checkInButtonText}>
              {hasCheckedInToday ? 'Zaznaczone na dziś!' : 'Dziś nie paliłem!'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={28} color="#2ecc71" />
            <Text style={styles.statValue}>{formatMoney(moneySaved)}</Text>
            <Text style={styles.statLabel}>Zaoszczędzone</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={28} color="#e74c3c" />
            <Text style={styles.statValue}>{cigarettesNotSmoked}</Text>
            <Text style={styles.statLabel}>Nie wypalonych</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={28} color="#f1c40f" />
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Rekord dni</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={28} color="#e91e63" />
            <Text style={styles.statValue}>{Math.floor(currentStreak * 0.5)}h</Text>
            <Text style={styles.statLabel}>Życia odzyskane</Text>
          </View>
        </View>

        {/* Today's Fact */}
        {todaysFact && (
          <TouchableOpacity
            style={styles.factCard}
            onPress={() => navigation.navigate('HealthTimeline')}
          >
            <View style={styles.factHeader}>
              <Text style={styles.factIcon}>{todaysFact.icon}</Text>
              <Text style={styles.factTitle}>Dzisiejsza ciekawostka</Text>
            </View>
            <Text style={styles.factText}>{todaysFact.fact}</Text>
            <View style={styles.factFooter}>
              <Text style={styles.factCategory}>
                {todaysFact.category === 'health' && '💚 Zdrowie'}
                {todaysFact.category === 'money' && '💰 Pieniądze'}
                {todaysFact.category === 'motivation' && '💪 Motywacja'}
                {todaysFact.category === 'science' && '🔬 Nauka'}
                {todaysFact.category === 'social' && '👥 Społeczeństwo'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </View>
          </TouchableOpacity>
        )}

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1a5f2a" />
          <Text style={styles.quoteText}>"{quote}"</Text>
          <TouchableOpacity onPress={() => setQuote(getRandomMotivationalQuote())}>
            <Text style={styles.quoteRefresh}>Losuj nowy cytat</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('HealthTimeline')}
          >
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.actionGradient}
            >
              <Ionicons name="body-outline" size={24} color="#fff" />
              <Text style={styles.actionText}>Oś zdrowia</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Community')}
          >
            <LinearGradient
              colors={['#9b59b6', '#8e44ad']}
              style={styles.actionGradient}
            >
              <Ionicons name="people-outline" size={24} color="#fff" />
              <Text style={styles.actionText}>Społeczność</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  streakCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1a5f2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1a5f2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -5,
  },
  streakTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a5f2a',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#1a5f2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkInButtonDone: {
    backgroundColor: '#27ae60',
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  factCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  factText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  factFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  factCategory: {
    fontSize: 12,
    color: '#888',
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1a5f2a',
  },
  quoteText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 22,
  },
  quoteRefresh: {
    fontSize: 12,
    color: '#1a5f2a',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
