import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { purchaseService, PremiumPlan } from '../services/purchases';

export interface PremiumFeatures {
  adFree: boolean;
  advancedStats: boolean;
  personalizedTips: boolean;
  communityAccess: boolean;
  coachSupport: boolean;
  unlimitedHistory: boolean;
  customThemes: boolean;
  exportData: boolean;
}

interface PremiumContextType {
  isPremium: boolean;
  premiumPlan: PremiumPlan | null;
  features: PremiumFeatures;
  isLoading: boolean;
  purchasePremium: (planId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  availablePlans: PremiumPlan[];
}

const defaultFeatures: PremiumFeatures = {
  adFree: false,
  advancedStats: false,
  personalizedTips: false,
  communityAccess: false,
  coachSupport: false,
  unlimitedHistory: false,
  customThemes: false,
  exportData: false,
};

const premiumFeatures: PremiumFeatures = {
  adFree: true,
  advancedStats: true,
  personalizedTips: true,
  communityAccess: true,
  coachSupport: false,
  unlimitedHistory: true,
  customThemes: true,
  exportData: true,
};

const proFeatures: PremiumFeatures = {
  adFree: true,
  advancedStats: true,
  personalizedTips: true,
  communityAccess: true,
  coachSupport: true,
  unlimitedHistory: true,
  customThemes: true,
  exportData: true,
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState<PremiumPlan | null>(null);
  const [features, setFeatures] = useState<PremiumFeatures>(defaultFeatures);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePlans, setAvailablePlans] = useState<PremiumPlan[]>([]);

  useEffect(() => {
    initializePurchases();
  }, []);

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    } else {
      setIsPremium(false);
      setPremiumPlan(null);
      setFeatures(defaultFeatures);
    }
  }, [user]);

  const initializePurchases = async () => {
    try {
      await purchaseService.initialize();
      const plans = await purchaseService.getAvailablePlans();
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Error initializing purchases:', error);
      // Use default plans if fetching fails
      setAvailablePlans([
        {
          id: 'premium_monthly',
          name: 'Premium Miesięczny',
          price: '19.99 PLN',
          priceValue: 19.99,
          period: 'month',
          features: ['Bez reklam', 'Zaawansowane statystyki', 'Spersonalizowane porady', 'Społeczność', 'Motywy'],
        },
        {
          id: 'premium_yearly',
          name: 'Premium Roczny',
          price: '149.99 PLN',
          priceValue: 149.99,
          period: 'year',
          features: ['Wszystko z miesięcznego', 'Oszczędzasz 37%', 'Priorytetowe wsparcie'],
        },
        {
          id: 'pro_monthly',
          name: 'Pro Miesięczny',
          price: '39.99 PLN',
          priceValue: 39.99,
          period: 'month',
          features: ['Wszystko z Premium', 'Coaching 1:1', 'Plan rzucania', 'Wsparcie 24/7'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumStatus = async () => {
    setIsLoading(true);
    try {
      const storedPlan = await AsyncStorage.getItem(`premiumPlan_${user?.uid}`);
      if (storedPlan) {
        const plan = JSON.parse(storedPlan);
        setPremiumPlan(plan);
        setIsPremium(true);
        setFeatures(plan.id.includes('pro') ? proFeatures : premiumFeatures);
      }

      // Check with server/RevenueCat
      const serverStatus = await purchaseService.checkSubscriptionStatus(user?.uid || '');
      if (serverStatus.isActive) {
        setIsPremium(true);
        setPremiumPlan(serverStatus.plan);
        setFeatures(serverStatus.plan?.id.includes('pro') ? proFeatures : premiumFeatures);
        await AsyncStorage.setItem(`premiumPlan_${user?.uid}`, JSON.stringify(serverStatus.plan));
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePremium = async (planId: string): Promise<boolean> => {
    try {
      const result = await purchaseService.purchaseSubscription(planId, user?.uid || '');
      if (result.success) {
        setIsPremium(true);
        setPremiumPlan(result.plan);
        setFeatures(planId.includes('pro') ? proFeatures : premiumFeatures);
        await AsyncStorage.setItem(`premiumPlan_${user?.uid}`, JSON.stringify(result.plan));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const result = await purchaseService.restorePurchases(user?.uid || '');
      if (result.success && result.plan) {
        setIsPremium(true);
        setPremiumPlan(result.plan);
        setFeatures(result.plan.id.includes('pro') ? proFeatures : premiumFeatures);
        await AsyncStorage.setItem(`premiumPlan_${user?.uid}`, JSON.stringify(result.plan));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumPlan,
        features,
        isLoading,
        purchasePremium,
        restorePurchases,
        availablePlans,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
