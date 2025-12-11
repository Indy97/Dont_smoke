import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { usePremium } from '../contexts/PremiumContext';
import { PremiumPlan } from '../services/purchases';

const { width } = Dimensions.get('window');

export default function PremiumScreen() {
  const navigation = useNavigation();
  const { availablePlans, purchasePremium, restorePurchases, isLoading } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('premium_yearly');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPlan) {
      Alert.alert('Błąd', 'Wybierz plan');
      return;
    }

    setIsPurchasing(true);
    try {
      const success = await purchasePremium(selectedPlan);
      if (success) {
        Alert.alert(
          'Gratulacje! 🎉',
          'Dziękujemy za zakup Premium! Teraz masz dostęp do wszystkich funkcji.',
          [{ text: 'Super!', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dokonać zakupu. Spróbuj ponownie.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Sukces', 'Twoje zakupy zostały przywrócone!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Informacja', 'Nie znaleziono aktywnych subskrypcji.');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się przywrócić zakupów.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const features = [
    { icon: 'ban-outline', title: 'Bez reklam', description: 'Korzystaj z aplikacji bez przerw' },
    { icon: 'stats-chart-outline', title: 'Zaawansowane statystyki', description: 'Szczegółowe analizy Twoich postępów' },
    { icon: 'bulb-outline', title: 'Spersonalizowane porady', description: 'Dostosowane do Twoich potrzeb' },
    { icon: 'people-outline', title: 'Społeczność', description: 'Dołącz do innych i wspierajcie się' },
    { icon: 'color-palette-outline', title: 'Własne motywy', description: 'Personalizuj wygląd aplikacji' },
    { icon: 'download-outline', title: 'Eksport danych', description: 'Pobierz swoje statystyki' },
    { icon: 'infinite-outline', title: 'Nieograniczona historia', description: 'Pełen dostęp do historii' },
  ];

  const proFeatures = [
    { icon: 'chatbubbles-outline', title: 'Coaching 1:1', description: 'Osobisty coach przez chat' },
    { icon: 'document-text-outline', title: 'Plan rzucania', description: 'Spersonalizowany plan dla Ciebie' },
    { icon: 'headset-outline', title: 'Wsparcie 24/7', description: 'Pomoc gdy jej potrzebujesz' },
    { icon: 'videocam-outline', title: 'Sesje video', description: 'Rozmowy z psychologiem' },
  ];

  const PlanCard = ({ plan, isPopular = false }: { plan: PremiumPlan; isPopular?: boolean }) => {
    const isSelected = selectedPlan === plan.id;
    const isPro = plan.id.includes('pro');

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
          isPopular && styles.planCardPopular,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>Najpopularniejszy</Text>
          </View>
        )}
        <View style={styles.planHeader}>
          <View>
            <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
              {plan.name}
            </Text>
            <Text style={styles.planPeriod}>
              {plan.period === 'month' ? '/miesiąc' : plan.period === 'year' ? '/rok' : ''}
            </Text>
          </View>
          <View style={styles.planPriceContainer}>
            <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
              {plan.price}
            </Text>
            {plan.period === 'year' && (
              <Text style={styles.planSavings}>Oszczędzasz 37%</Text>
            )}
          </View>
        </View>
        <View style={styles.planFeatures}>
          {plan.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.planFeature}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={isSelected ? '#1a5f2a' : '#888'}
              />
              <Text
                style={[
                  styles.planFeatureText,
                  isSelected && styles.planFeatureTextSelected,
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#1a5f2a" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f2a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a5f2a', '#0d3d16']} style={styles.headerGradient}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerIcon}>⭐</Text>
        <Text style={styles.headerTitle}>Przejdź na Premium</Text>
        <Text style={styles.headerSubtitle}>
          Odblokuj wszystkie funkcje i przyspiesz swoją drogę do wolności od nikotyny
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wybierz plan</Text>
          {availablePlans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={plan.id === 'premium_yearly'}
            />
          ))}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Co otrzymujesz z Premium</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons
                    name={feature.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color="#1a5f2a"
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dodatkowo w planie Pro</Text>
          <View style={styles.proFeaturesCard}>
            {proFeatures.map((feature, index) => (
              <View key={index} style={styles.proFeatureItem}>
                <Ionicons
                  name={feature.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color="#FFD700"
                />
                <View style={styles.proFeatureContent}>
                  <Text style={styles.proFeatureTitle}>{feature.title}</Text>
                  <Text style={styles.proFeatureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Co mówią użytkownicy</Text>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "Ta aplikacja zmieniła moje życie. 180 dni bez papierosa i czuję się świetnie!"
            </Text>
            <Text style={styles.testimonialAuthor}>— Marek, 180 dni bez palenia</Text>
          </View>
        </View>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Przywróć zakupy</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Subskrypcja odnawia się automatycznie. Możesz anulować w dowolnym momencie.{' '}
          <Text style={styles.termsLink}>Regulamin</Text> |{' '}
          <Text style={styles.termsLink}>Polityka prywatności</Text>
        </Text>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.purchaseContainer}>
        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPlan}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>Rozpocznij teraz</Text>
              <Text style={styles.purchaseButtonSubtext}>
                {availablePlans.find((p) => p.id === selectedPlan)?.price || ''}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
  headerIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
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
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#1a5f2a',
    backgroundColor: '#f0fff4',
  },
  planCardPopular: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 15,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planNameSelected: {
    color: '#1a5f2a',
  },
  planPeriod: {
    fontSize: 12,
    color: '#888',
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  planPriceSelected: {
    color: '#1a5f2a',
  },
  planSavings: {
    fontSize: 10,
    color: '#27ae60',
    fontWeight: '600',
  },
  planFeatures: {
    marginTop: 5,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planFeatureText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  planFeatureTextSelected: {
    color: '#333',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  proFeaturesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  proFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  proFeatureContent: {
    marginLeft: 12,
    flex: 1,
  },
  proFeatureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  proFeatureDescription: {
    fontSize: 12,
    color: '#888',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1a5f2a',
  },
  testimonialText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  testimonialAuthor: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 15,
  },
  restoreButtonText: {
    color: '#1a5f2a',
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1a5f2a',
  },
  purchaseContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  purchaseButton: {
    backgroundColor: '#1a5f2a',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchaseButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});
