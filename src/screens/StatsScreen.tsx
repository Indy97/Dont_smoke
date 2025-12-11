import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUserData } from '../contexts/UserDataContext';
import { usePremium } from '../contexts/PremiumContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const {
    currentStreak,
    longestStreak,
    moneySaved,
    cigarettesNotSmoked,
    smokingData,
  } = useUserData();
  const { isPremium, features } = usePremium();

  const cigarettesPerDay = smokingData?.cigarettesPerDay || 20;
  const pricePerPack = smokingData?.pricePerPack || 20;
  const cigarettesPerPack = smokingData?.cigarettesPerPack || 20;

  // Calculations
  const daysSmokeFree = currentStreak;
  const hoursSmokeFree = daysSmokeFree * 24;
  const minutesSmokeFree = hoursSmokeFree * 60;

  // Health calculations
  const lifeRegained = daysSmokeFree * 11; // 11 minutes per cigarette not smoked, simplified
  const lifeRegainedHours = Math.floor(lifeRegained / 60);
  const lifeRegainedDays = Math.floor(lifeRegainedHours / 24);

  // Tar and chemicals
  const tarNotInhaled = cigarettesNotSmoked * 12; // mg per cigarette
  const chemicalsAvoided = cigarettesNotSmoked * 7000; // 7000 chemicals per cigarette

  // Projections
  const moneySavedPerMonth = (30 * cigarettesPerDay / cigarettesPerPack) * pricePerPack;
  const moneySavedPerYear = moneySavedPerMonth * 12;

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pl-PL').format(Math.round(num));
  };

  const StatCard = ({
    icon,
    iconColor,
    title,
    value,
    subtitle,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statystyki</Text>
        <Text style={styles.subtitle}>Twoje postępy w liczbach</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Czas bez palenia</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="calendar-outline"
              iconColor="#3498db"
              title="Dni"
              value={daysSmokeFree.toString()}
            />
            <StatCard
              icon="time-outline"
              iconColor="#9b59b6"
              title="Godziny"
              value={formatNumber(hoursSmokeFree)}
            />
            <StatCard
              icon="trophy-outline"
              iconColor="#f1c40f"
              title="Rekord"
              value={`${longestStreak} dni`}
            />
            <StatCard
              icon="trending-up-outline"
              iconColor="#27ae60"
              title="Skuteczność"
              value={`${longestStreak > 0 ? Math.round((currentStreak / longestStreak) * 100) : 0}%`}
            />
          </View>
        </View>

        {/* Health Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zdrowie</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="fitness-outline"
              iconColor="#e74c3c"
              title="Życie odzyskane"
              value={lifeRegainedDays > 0 ? `${lifeRegainedDays} dni` : `${lifeRegainedHours}h`}
            />
            <StatCard
              icon="close-circle-outline"
              iconColor="#95a5a6"
              title="Smoła uniknięta"
              value={`${formatNumber(tarNotInhaled / 1000)} g`}
            />
            <StatCard
              icon="flask-outline"
              iconColor="#e67e22"
              title="Chemikalia"
              value={formatNumber(chemicalsAvoided)}
              subtitle="unikniętych"
            />
            <StatCard
              icon="ban-outline"
              iconColor="#1abc9c"
              title="Papierosy"
              value={formatNumber(cigarettesNotSmoked)}
              subtitle="nie wypalonych"
            />
          </View>
        </View>

        {/* Money Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finanse</Text>
          <View style={styles.moneyCard}>
            <View style={styles.moneyMain}>
              <Ionicons name="wallet-outline" size={40} color="#27ae60" />
              <View style={styles.moneyMainContent}>
                <Text style={styles.moneyLabel}>Zaoszczędzone do tej pory</Text>
                <Text style={styles.moneyValue}>{formatMoney(moneySaved)}</Text>
              </View>
            </View>

            <View style={styles.moneyDivider} />

            <View style={styles.moneyProjections}>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Miesięcznie</Text>
                <Text style={styles.projectionValue}>{formatMoney(moneySavedPerMonth)}</Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Rocznie</Text>
                <Text style={styles.projectionValue}>{formatMoney(moneySavedPerYear)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Advanced Stats (Premium) */}
        {isPremium && features.advancedStats ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zaawansowane</Text>
            <View style={styles.advancedCard}>
              <View style={styles.advancedRow}>
                <Text style={styles.advancedLabel}>Średnia dzienna oszczędność</Text>
                <Text style={styles.advancedValue}>
                  {formatMoney(moneySaved / Math.max(currentStreak, 1))}
                </Text>
              </View>
              <View style={styles.advancedRow}>
                <Text style={styles.advancedLabel}>Papierosy dziennie (dawniej)</Text>
                <Text style={styles.advancedValue}>{cigarettesPerDay}</Text>
              </View>
              <View style={styles.advancedRow}>
                <Text style={styles.advancedLabel}>Cena paczki</Text>
                <Text style={styles.advancedValue}>{formatMoney(pricePerPack)}</Text>
              </View>
              <View style={styles.advancedRow}>
                <Text style={styles.advancedLabel}>Ryzyko choroby serca</Text>
                <Text style={[styles.advancedValue, { color: '#27ae60' }]}>
                  -{Math.min(currentStreak * 0.1, 50).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.advancedRow}>
                <Text style={styles.advancedLabel}>Funkcja płuc</Text>
                <Text style={[styles.advancedValue, { color: '#27ae60' }]}>
                  +{Math.min(currentStreak * 0.5, 30).toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.premiumBanner}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.premiumBannerText}>
              Odblokuj zaawansowane statystyki z Premium
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  statTitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#888',
  },
  moneyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moneyMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyMainContent: {
    marginLeft: 15,
  },
  moneyLabel: {
    fontSize: 14,
    color: '#888',
  },
  moneyValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  moneyDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  moneyProjections: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  projectionItem: {
    alignItems: 'center',
  },
  projectionLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  projectionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  advancedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  advancedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  advancedLabel: {
    fontSize: 14,
    color: '#666',
  },
  advancedValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  premiumBannerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
