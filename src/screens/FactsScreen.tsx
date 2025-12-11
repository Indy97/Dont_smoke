import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUserData } from '../contexts/UserDataContext';
import { dailyFacts, DailyFact } from '../data/facts';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.55;

const categoryColors: Record<string, string[]> = {
  health: ['#27ae60', '#1e8449'],
  money: ['#f1c40f', '#d68910'],
  motivation: ['#e74c3c', '#c0392b'],
  science: ['#3498db', '#2980b9'],
  social: ['#9b59b6', '#8e44ad'],
};

const categoryLabels: Record<string, string> = {
  health: 'Zdrowie',
  money: 'Pieniądze',
  motivation: 'Motywacja',
  science: 'Nauka',
  social: 'Społeczeństwo',
};

export default function FactsScreen() {
  const { currentStreak } = useUserData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const filteredFacts = selectedCategory
    ? dailyFacts.filter((fact) => fact.category === selectedCategory)
    : dailyFacts;

  const categories = ['health', 'money', 'motivation', 'science', 'social'];

  const renderFactCard = ({ item, index }: { item: DailyFact; index: number }) => {
    const isUnlocked = item.day <= currentStreak;

    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={
            isUnlocked
              ? categoryColors[item.category]
              : ['#95a5a6', '#7f8c8d']
          }
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Dzień {item.day}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {categoryLabels[item.category]}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.factIcon}>{item.icon}</Text>
            {isUnlocked ? (
              <Text style={styles.factText}>{item.fact}</Text>
            ) : (
              <View style={styles.lockedContent}>
                <Ionicons name="lock-closed" size={40} color="rgba(255,255,255,0.5)" />
                <Text style={styles.lockedText}>
                  Odblokuj za {item.day - currentStreak} dni
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>
              {index + 1} / {filteredFacts.length}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ciekawostki</Text>
        <Text style={styles.subtitle}>
          Odkryj korzyści płynące z niepalenia
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === item && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === item ? null : item)
              }
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === item && styles.filterButtonTextActive,
                ]}
              >
                {categoryLabels[item]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Facts Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={filteredFacts}
          renderItem={renderFactCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
        />
      </View>

      {/* Progress indicator */}
      <View style={styles.progressInfo}>
        <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
        <Text style={styles.progressInfoText}>
          Odblokowano {dailyFacts.filter((f) => f.day <= currentStreak).length} z{' '}
          {dailyFacts.length} ciekawostek
        </Text>
      </View>
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
    paddingBottom: 10,
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
  filterContainer: {
    paddingVertical: 15,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#fff',
  },
  filterButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#1a5f2a',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 20,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  factText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },
  lockedContent: {
    alignItems: 'center',
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  cardFooter: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  progressInfoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 8,
  },
});
