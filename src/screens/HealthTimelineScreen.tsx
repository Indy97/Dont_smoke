import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useUserData } from '../contexts/UserDataContext';
import { healthTimeline } from '../data/facts';

const { width } = Dimensions.get('window');

export default function HealthTimelineScreen() {
  const navigation = useNavigation();
  const { currentStreak } = useUserData();

  const timeToMinutes = (timeStr: string): number => {
    if (timeStr.includes('minut')) {
      return parseInt(timeStr);
    }
    if (timeStr.includes('godzin')) {
      return parseInt(timeStr) * 60;
    }
    if (timeStr.includes('dzień') || timeStr.includes('dni')) {
      return parseInt(timeStr) * 60 * 24;
    }
    if (timeStr.includes('tydzień') || timeStr.includes('tygodni')) {
      return parseInt(timeStr) * 60 * 24 * 7;
    }
    if (timeStr.includes('miesiąc') || timeStr.includes('miesięcy')) {
      return parseInt(timeStr) * 60 * 24 * 30;
    }
    if (timeStr.includes('rok') || timeStr.includes('lat')) {
      return parseInt(timeStr) * 60 * 24 * 365;
    }
    return 0;
  };

  const currentMinutes = currentStreak * 24 * 60;

  const getProgress = (timeStr: string): number => {
    const targetMinutes = timeToMinutes(timeStr);
    if (targetMinutes === 0) return 100;
    return Math.min((currentMinutes / targetMinutes) * 100, 100);
  };

  const isAchieved = (timeStr: string): boolean => {
    return getProgress(timeStr) >= 100;
  };

  const TimelineItem = ({
    item,
    isLast,
    index,
  }: {
    item: (typeof healthTimeline)[0];
    isLast: boolean;
    index: number;
  }) => {
    const achieved = isAchieved(item.time);
    const progress = getProgress(item.time);

    return (
      <View style={styles.timelineItem}>
        {/* Timeline Line */}
        {!isLast && (
          <View style={styles.timelineLine}>
            <View
              style={[
                styles.timelineLineFill,
                { height: achieved ? '100%' : `${progress}%` },
              ]}
            />
          </View>
        )}

        {/* Dot */}
        <View
          style={[
            styles.timelineDot,
            achieved && styles.timelineDotAchieved,
          ]}
        >
          <Text style={styles.timelineDotIcon}>{item.icon}</Text>
        </View>

        {/* Content */}
        <View
          style={[
            styles.timelineContent,
            achieved && styles.timelineContentAchieved,
          ]}
        >
          <View style={styles.timelineHeader}>
            <Text
              style={[
                styles.timelineTime,
                achieved && styles.timelineTimeAchieved,
              ]}
            >
              {item.time}
            </Text>
            {achieved && (
              <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
            )}
          </View>
          <Text
            style={[
              styles.timelineTitle,
              achieved && styles.timelineTitleAchieved,
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.timelineDescription}>{item.description}</Text>

          {!achieved && progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const achievedCount = healthTimeline.filter((item) => isAchieved(item.time)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oś zdrowia</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{achievedCount}</Text>
          <Text style={styles.statLabel}>osiągnięte</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{healthTimeline.length - achievedCount}</Text>
          <Text style={styles.statLabel}>do odblokowania</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>dni bez palenia</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>
            Zobacz jak Twoje ciało się regeneruje
          </Text>
          <Text style={styles.introText}>
            Od pierwszych 20 minut do 15 lat - każdy moment bez papierosa to krok ku zdrowiu.
          </Text>
        </View>

        <View style={styles.timeline}>
          {healthTimeline.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              isLast={index === healthTimeline.length - 1}
              index={index}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dane oparte na badaniach medycznych WHO i American Heart Association
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5f2a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
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
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  intro: {
    marginBottom: 25,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  timeline: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 22,
    top: 50,
    bottom: -15,
    width: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 1.5,
  },
  timelineLineFill: {
    width: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 1.5,
  },
  timelineDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#e0e0e0',
    zIndex: 1,
  },
  timelineDotAchieved: {
    borderColor: '#27ae60',
    backgroundColor: '#e8f5e9',
  },
  timelineDotIcon: {
    fontSize: 20,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineContentAchieved: {
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
  timelineTimeAchieved: {
    color: '#27ae60',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  timelineTitleAchieved: {
    color: '#1a5f2a',
  },
  timelineDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a5f2a',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    width: 40,
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
