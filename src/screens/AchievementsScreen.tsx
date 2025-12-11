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
import { achievements, getAchievementProgress } from '../data/achievements';
import { Achievement } from '../services/firebase';

const { width } = Dimensions.get('window');

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
  currentValue: number;
}

function AchievementCard({ achievement, isUnlocked, progress, currentValue }: AchievementCardProps) {
  return (
    <View style={[styles.card, !isUnlocked && styles.cardLocked]}>
      <View style={[styles.iconContainer, isUnlocked && styles.iconUnlocked]}>
        <Text style={styles.icon}>{achievement.icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, !isUnlocked && styles.textLocked]}>
          {achievement.name}
        </Text>
        <Text style={[styles.cardDescription, !isUnlocked && styles.textLocked]}>
          {achievement.description}
        </Text>
        {!isUnlocked && (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(currentValue)} / {achievement.requirement}
              {achievement.type === 'streak' || achievement.type === 'health'
                ? ' dni'
                : achievement.type === 'money'
                ? ' zł'
                : ' szt.'}
            </Text>
          </>
        )}
      </View>
      {isUnlocked && (
        <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
      )}
    </View>
  );
}

export default function AchievementsScreen() {
  const { currentStreak, moneySaved, cigarettesNotSmoked, unlockedAchievements } = useUserData();

  const isAchievementUnlocked = (achievement: Achievement): boolean => {
    return unlockedAchievements.some((a) => a.id === achievement.id);
  };

  const getCurrentValue = (achievement: Achievement): number => {
    switch (achievement.type) {
      case 'streak':
      case 'health':
        return currentStreak;
      case 'money':
        return moneySaved;
      case 'cigarettes':
        return cigarettesNotSmoked;
      default:
        return 0;
    }
  };

  const streakAchievements = achievements.filter((a) => a.type === 'streak');
  const moneyAchievements = achievements.filter((a) => a.type === 'money');
  const cigarettesAchievements = achievements.filter((a) => a.type === 'cigarettes');
  const healthAchievements = achievements.filter((a) => a.type === 'health');

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  const renderCategory = (title: string, icon: string, categoryAchievements: Achievement[]) => (
    <View style={styles.category}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{icon}</Text>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.categoryCount}>
          {categoryAchievements.filter((a) => isAchievementUnlocked(a)).length}/
          {categoryAchievements.length}
        </Text>
      </View>
      {categoryAchievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          isUnlocked={isAchievementUnlocked(achievement)}
          progress={getAchievementProgress(
            achievement,
            currentStreak,
            moneySaved,
            cigarettesNotSmoked
          )}
          currentValue={getCurrentValue(achievement)}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Osiągnięcia</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            {unlockedCount} / {totalCount} odblokowanych
          </Text>
          <View style={styles.headerProgressBar}>
            <View
              style={[
                styles.headerProgressFill,
                { width: `${(unlockedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCategory('Passa dni', '🔥', streakAchievements)}
        {renderCategory('Zdrowie', '💚', healthAchievements)}
        {renderCategory('Oszczędności', '💰', moneyAchievements)}
        {renderCategory('Papierosy', '🚭', cigarettesAchievements)}
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
    marginBottom: 15,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  headerProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  headerProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
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
  category: {
    marginBottom: 25,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLocked: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconUnlocked: {
    backgroundColor: '#e8f5e9',
  },
  icon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  textLocked: {
    color: '#888',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a5f2a',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
});
