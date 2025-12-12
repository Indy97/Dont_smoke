import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
  PurchasesError,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys - replace with your own
const REVENUECAT_API_KEY_IOS = 'your_revenuecat_ios_api_key';
const REVENUECAT_API_KEY_ANDROID = 'your_revenuecat_android_api_key';

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  period: 'month' | 'year' | 'lifetime';
  features: string[];
  package?: PurchasesPackage;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: PremiumPlan | null;
  expiresAt: string | null;
}

class PurchaseService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      const apiKey = Platform.OS === 'ios'
        ? REVENUECAT_API_KEY_IOS
        : REVENUECAT_API_KEY_ANDROID;

      // Skip initialization if using placeholder keys (development mode)
      if (apiKey.startsWith('your_')) {
        console.log('RevenueCat: Using placeholder API key, skipping initialization');
        return;
      }

      await Purchases.configure({ apiKey });
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      // Don't throw - allow app to work in development without RevenueCat
    }
  }

  async getAvailablePlans(): Promise<PremiumPlan[]> {
    if (!this.isInitialized) {
      return this.getDefaultPlans();
    }

    try {
      const offerings = await Purchases.getOfferings();

      if (!offerings.current) {
        return this.getDefaultPlans();
      }

      return offerings.current.availablePackages.map((pkg) => ({
        id: pkg.identifier,
        name: this.getPackageName(pkg.identifier),
        price: pkg.product.priceString,
        priceValue: pkg.product.price,
        period: this.getPackagePeriod(pkg.packageType),
        features: this.getPackageFeatures(pkg.identifier),
        package: pkg,
      }));
    } catch (error) {
      console.error('Error getting offerings:', error);
      return this.getDefaultPlans();
    }
  }

  private getDefaultPlans(): PremiumPlan[] {
    return [
      {
        id: 'premium_monthly',
        name: 'Premium Miesięczny',
        price: '19.99 PLN',
        priceValue: 19.99,
        period: 'month',
        features: [
          'Bez reklam',
          'Zaawansowane statystyki',
          'Spersonalizowane porady',
          'Dostęp do społeczności',
          'Własne motywy',
          'Nieograniczona historia',
        ],
      },
      {
        id: 'premium_yearly',
        name: 'Premium Roczny',
        price: '149.99 PLN',
        priceValue: 149.99,
        period: 'year',
        features: [
          'Wszystko z Premium Miesięczny',
          'Oszczędzasz 37% rocznie',
          'Priorytetowe wsparcie',
          'Eksport danych',
        ],
      },
      {
        id: 'pro_monthly',
        name: 'Pro Miesięczny',
        price: '39.99 PLN',
        priceValue: 39.99,
        period: 'month',
        features: [
          'Wszystko z Premium',
          'Coaching 1:1 przez chat',
          'Spersonalizowany plan rzucania',
          'Wsparcie 24/7',
          'Sesje z psychologiem (online)',
        ],
      },
      {
        id: 'pro_yearly',
        name: 'Pro Roczny',
        price: '299.99 PLN',
        priceValue: 299.99,
        period: 'year',
        features: [
          'Wszystko z Pro Miesięczny',
          'Oszczędzasz 38% rocznie',
          '3 sesje video z coachem',
          'Gwarancja zwrotu pieniędzy',
        ],
      },
    ];
  }

  private getPackageName(identifier: string): string {
    const names: Record<string, string> = {
      premium_monthly: 'Premium Miesięczny',
      premium_yearly: 'Premium Roczny',
      pro_monthly: 'Pro Miesięczny',
      pro_yearly: 'Pro Roczny',
    };
    return names[identifier] || identifier;
  }

  private getPackagePeriod(type: string): 'month' | 'year' | 'lifetime' {
    if (type.includes('ANNUAL') || type.includes('YEARLY')) return 'year';
    if (type.includes('LIFETIME')) return 'lifetime';
    return 'month';
  }

  private getPackageFeatures(identifier: string): string[] {
    const features: Record<string, string[]> = {
      premium_monthly: [
        'Bez reklam',
        'Zaawansowane statystyki',
        'Spersonalizowane porady',
        'Dostęp do społeczności',
      ],
      premium_yearly: [
        'Wszystko z Premium Miesięczny',
        'Oszczędzasz 37%',
        'Priorytetowe wsparcie',
      ],
      pro_monthly: [
        'Wszystko z Premium',
        'Coaching 1:1',
        'Plan rzucania',
        'Wsparcie 24/7',
      ],
      pro_yearly: [
        'Wszystko z Pro Miesięczny',
        'Oszczędzasz 38%',
        'Sesje video z coachem',
      ],
    };
    return features[identifier] || [];
  }

  async purchaseSubscription(
    planId: string,
    userId: string
  ): Promise<{ success: boolean; plan: PremiumPlan | null }> {
    if (!this.isInitialized) {
      console.log('RevenueCat not initialized - purchase simulation');
      // In development, simulate successful purchase
      const plan = this.getDefaultPlans().find((p) => p.id === planId) || null;
      return { success: true, plan };
    }

    try {
      // Set user ID for RevenueCat
      await Purchases.logIn(userId);

      const offerings = await Purchases.getOfferings();
      const packages = offerings.current?.availablePackages || [];
      const selectedPackage = packages.find((pkg) => pkg.identifier === planId);

      if (!selectedPackage) {
        throw new Error('Package not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      if (this.hasActiveSubscription(customerInfo)) {
        const plan = this.getDefaultPlans().find((p) => p.id === planId) || null;
        return { success: true, plan };
      }

      return { success: false, plan: null };
    } catch (error) {
      const purchasesError = error as PurchasesError;
      if (purchasesError.userCancelled) {
        console.log('User cancelled purchase');
      } else {
        console.error('Error purchasing subscription:', error);
      }
      return { success: false, plan: null };
    }
  }

  async checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    if (!this.isInitialized) {
      return { isActive: false, plan: null, expiresAt: null };
    }

    try {
      await Purchases.logIn(userId);
      const customerInfo = await Purchases.getCustomerInfo();

      const isActive = this.hasActiveSubscription(customerInfo);

      if (isActive) {
        const activeEntitlement = Object.values(customerInfo.entitlements.active)[0];
        const planId = activeEntitlement?.productIdentifier || 'premium_monthly';
        const plan = this.getDefaultPlans().find((p) => p.id === planId) || null;

        return {
          isActive: true,
          plan,
          expiresAt: activeEntitlement?.expirationDate || null,
        };
      }

      return { isActive: false, plan: null, expiresAt: null };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return { isActive: false, plan: null, expiresAt: null };
    }
  }

  async restorePurchases(
    userId: string
  ): Promise<{ success: boolean; plan: PremiumPlan | null }> {
    if (!this.isInitialized) {
      return { success: false, plan: null };
    }

    try {
      await Purchases.logIn(userId);
      const customerInfo = await Purchases.restorePurchases();

      if (this.hasActiveSubscription(customerInfo)) {
        const activeEntitlement = Object.values(customerInfo.entitlements.active)[0];
        const planId = activeEntitlement?.productIdentifier || 'premium_monthly';
        const plan = this.getDefaultPlans().find((p) => p.id === planId) || null;
        return { success: true, plan };
      }

      return { success: false, plan: null };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return { success: false, plan: null };
    }
  }

  private hasActiveSubscription(customerInfo: CustomerInfo): boolean {
    return Object.keys(customerInfo.entitlements.active).length > 0;
  }
}

export const purchaseService = new PurchaseService();
