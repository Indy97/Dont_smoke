import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { usePremium } from '../contexts/PremiumContext';
import { MainStackParamList } from '../navigation/MainNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { smokingData, updateSmokingProfile, currentStreak, unlockedAchievements } = useUserData();
  const { isPremium, premiumPlan } = usePremium();

  const [showEditModal, setShowEditModal] = useState(false);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(
    smokingData?.cigarettesPerDay?.toString() || '20'
  );
  const [pricePerPack, setPricePerPack] = useState(
    smokingData?.pricePerPack?.toString() || '20'
  );
  const [cigarettesPerPack, setCigarettesPerPack] = useState(
    smokingData?.cigarettesPerPack?.toString() || '20'
  );

  const handleSignOut = () => {
    Alert.alert(
      'Wylogowanie',
      'Czy na pewno chcesz się wylogować?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyloguj',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się wylogować');
            }
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    const cigs = parseInt(cigarettesPerDay, 10);
    const price = parseFloat(pricePerPack);
    const pack = parseInt(cigarettesPerPack, 10);

    if (isNaN(cigs) || isNaN(price) || isNaN(pack)) {
      Alert.alert('Błąd', 'Wprowadź poprawne wartości');
      return;
    }

    try {
      await updateSmokingProfile(cigs, price, pack);
      setShowEditModal(false);
      Alert.alert('Sukces', 'Profil został zaktualizowany');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zapisać zmian');
    }
  };

  const quitDate = smokingData?.quitDate
    ? new Date(smokingData.quitDate).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Nie ustawiono';

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#1a5f2a" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (showArrow && onPress && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      ))}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          {isPremium && (
            <View style={styles.premiumBadgeSmall}>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.displayName || 'Użytkownik'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Dni</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unlockedAchievements.length}</Text>
            <Text style={styles.statLabel}>Osiągnięcia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{quitDate.split(' ')[0]}</Text>
            <Text style={styles.statLabel}>{quitDate.split(' ').slice(1).join(' ')}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Section */}
        {!isPremium ? (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => navigation.navigate('Premium')}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumGradient}
            >
              <Ionicons name="star" size={24} color="#fff" />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Przejdź na Premium</Text>
                <Text style={styles.premiumDescription}>
                  Odblokuj wszystkie funkcje i usń reklamy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.premiumActiveCard}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <View style={styles.premiumActiveContent}>
              <Text style={styles.premiumActiveTitle}>
                {premiumPlan?.name || 'Premium'}
              </Text>
              <Text style={styles.premiumActiveSubtitle}>Aktywna subskrypcja</Text>
            </View>
          </View>
        )}

        {/* Smoking Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil palenia</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="calendar-outline"
              title="Data rzucenia"
              subtitle={quitDate}
              showArrow={false}
            />
            <MenuItem
              icon="flame-outline"
              title="Papierosy dziennie"
              subtitle={`${smokingData?.cigarettesPerDay || 20} sztuk`}
              onPress={() => setShowEditModal(true)}
            />
            <MenuItem
              icon="cash-outline"
              title="Cena paczki"
              subtitle={`${smokingData?.pricePerPack || 20} zł`}
              onPress={() => setShowEditModal(true)}
            />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ustawienia</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="notifications-outline"
              title="Powiadomienia"
              subtitle="Przypomnienia i motywacje"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="color-palette-outline"
              title="Wygląd"
              subtitle="Motyw i personalizacja"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Prywatność"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wsparcie</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              title="Pomoc"
              onPress={() => {}}
            />
            <MenuItem
              icon="chatbubble-outline"
              title="Kontakt"
              onPress={() => {}}
            />
            <MenuItem
              icon="star-outline"
              title="Oceń aplikację"
              onPress={() => {}}
            />
            <MenuItem
              icon="share-social-outline"
              title="Poleć znajomym"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="log-out-outline"
              title="Wyloguj się"
              onPress={handleSignOut}
              showArrow={false}
            />
          </View>
        </View>

        <Text style={styles.version}>Wersja 1.0.0</Text>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edytuj profil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Papierosy dziennie</Text>
              <TextInput
                style={styles.input}
                value={cigarettesPerDay}
                onChangeText={setCigarettesPerDay}
                keyboardType="number-pad"
                placeholder="np. 20"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cena paczki (PLN)</Text>
              <TextInput
                style={styles.input}
                value={pricePerPack}
                onChangeText={setPricePerPack}
                keyboardType="decimal-pad"
                placeholder="np. 20"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Papierosów w paczce</Text>
              <TextInput
                style={styles.input}
                value={cigarettesPerPack}
                onChangeText={setCigarettesPerPack}
                keyboardType="number-pad"
                placeholder="np. 20"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a5f2a',
  },
  premiumBadgeSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
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
  premiumBanner: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  premiumActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumActiveContent: {
    marginLeft: 12,
  },
  premiumActiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumActiveSubtitle: {
    fontSize: 12,
    color: '#27ae60',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1a5f2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
