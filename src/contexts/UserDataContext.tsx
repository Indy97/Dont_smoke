import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { userDataService, SmokingData, Achievement } from '../services/firebase';
import { achievements } from '../data/achievements';

interface UserDataContextType {
  smokingData: SmokingData | null;
  unlockedAchievements: Achievement[];
  isLoading: boolean;
  checkInToday: () => Promise<void>;
  hasCheckedInToday: boolean;
  currentStreak: number;
  longestStreak: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
  refreshData: () => Promise<void>;
  updateSmokingProfile: (cigarettesPerDay: number, pricePerPack: number, cigarettesPerPack: number) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Demo data for testing
const createDemoData = (): SmokingData => {
  const quitDate = new Date();
  quitDate.setDate(quitDate.getDate() - 7); // Started 7 days ago

  const checkIns: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    checkIns.push(date.toISOString().split('T')[0]);
  }

  return {
    quitDate: quitDate.toISOString(),
    cigarettesPerDay: 20,
    pricePerPack: 22,
    cigarettesPerPack: 20,
    currentStreak: 7,
    longestStreak: 7,
    checkIns,
    lastCheckIn: new Date().toISOString().split('T')[0],
  };
};

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user, isDemo } = useAuth();
  const [smokingData, setSmokingData] = useState<SmokingData | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setSmokingData(null);
      setUnlockedAchievements([]);
      setIsLoading(false);
    }
  }, [user, isDemo]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Try to load from local storage first
      const localData = await AsyncStorage.getItem(`smokingData_${user?.uid}`);

      if (localData) {
        const parsed = JSON.parse(localData);
        setSmokingData(parsed);
        updateAchievements(parsed);
      } else if (isDemo) {
        // Create demo data for first-time demo users
        const demoData = createDemoData();
        setSmokingData(demoData);
        updateAchievements(demoData);
        await AsyncStorage.setItem(`smokingData_${user?.uid}`, JSON.stringify(demoData));
      }

      // Only sync with server for non-demo users
      if (user && !isDemo) {
        try {
          const serverData = await userDataService.getSmokingData(user.uid);
          if (serverData) {
            setSmokingData(serverData);
            updateAchievements(serverData);
            await AsyncStorage.setItem(`smokingData_${user.uid}`, JSON.stringify(serverData));
          }
        } catch (error) {
          console.log('Firebase not configured, using local storage only');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);

      // Fallback to demo data if nothing else works
      if (isDemo) {
        const demoData = createDemoData();
        setSmokingData(demoData);
        updateAchievements(demoData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateAchievements = (data: SmokingData) => {
    const unlocked = achievements.filter((achievement) => {
      if (achievement.type === 'streak') {
        return data.currentStreak >= achievement.requirement;
      } else if (achievement.type === 'money') {
        return calculateMoneySaved(data) >= achievement.requirement;
      } else if (achievement.type === 'cigarettes') {
        return calculateCigarettesNotSmoked(data) >= achievement.requirement;
      } else if (achievement.type === 'health') {
        return getDaysSinceQuit(data) >= achievement.requirement;
      }
      return false;
    });
    setUnlockedAchievements(unlocked);
  };

  const getDaysSinceQuit = (data: SmokingData): number => {
    if (!data.quitDate) return 0;
    const quitDate = new Date(data.quitDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - quitDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateMoneySaved = (data: SmokingData): number => {
    const days = getDaysSinceQuit(data);
    const cigarettesPerDay = data.cigarettesPerDay || 20;
    const pricePerPack = data.pricePerPack || 20;
    const cigarettesPerPack = data.cigarettesPerPack || 20;
    return (days * cigarettesPerDay / cigarettesPerPack) * pricePerPack;
  };

  const calculateCigarettesNotSmoked = (data: SmokingData): number => {
    const days = getDaysSinceQuit(data);
    return days * (data.cigarettesPerDay || 20);
  };

  const checkInToday = async () => {
    if (!user || !smokingData) return;

    const today = new Date().toISOString().split('T')[0];

    if (smokingData.checkIns.includes(today)) {
      return; // Already checked in today
    }

    const updatedData: SmokingData = {
      ...smokingData,
      checkIns: [...smokingData.checkIns, today],
      currentStreak: smokingData.currentStreak + 1,
      longestStreak: Math.max(smokingData.longestStreak, smokingData.currentStreak + 1),
      lastCheckIn: today,
    };

    setSmokingData(updatedData);
    updateAchievements(updatedData);

    await AsyncStorage.setItem(`smokingData_${user.uid}`, JSON.stringify(updatedData));

    // Only sync with Firebase for non-demo users
    if (!isDemo) {
      try {
        await userDataService.updateSmokingData(user.uid, updatedData);
      } catch (error) {
        console.log('Firebase not configured, saved locally only');
      }
    }
  };

  const updateSmokingProfile = async (
    cigarettesPerDay: number,
    pricePerPack: number,
    cigarettesPerPack: number
  ) => {
    if (!user) return;

    const updatedData: SmokingData = smokingData || {
      quitDate: new Date().toISOString(),
      cigarettesPerDay: 20,
      pricePerPack: 20,
      cigarettesPerPack: 20,
      currentStreak: 0,
      longestStreak: 0,
      checkIns: [],
      lastCheckIn: null,
    };

    updatedData.cigarettesPerDay = cigarettesPerDay;
    updatedData.pricePerPack = pricePerPack;
    updatedData.cigarettesPerPack = cigarettesPerPack;

    if (!smokingData) {
      updatedData.quitDate = new Date().toISOString();
    }

    setSmokingData(updatedData);
    await AsyncStorage.setItem(`smokingData_${user.uid}`, JSON.stringify(updatedData));

    // Only sync with Firebase for non-demo users
    if (!isDemo) {
      try {
        await userDataService.updateSmokingData(user.uid, updatedData);
      } catch (error) {
        console.log('Firebase not configured, saved locally only');
      }
    }
  };

  const hasCheckedInToday = (): boolean => {
    if (!smokingData) return false;
    const today = new Date().toISOString().split('T')[0];
    return smokingData.checkIns.includes(today);
  };

  const refreshData = async () => {
    await loadUserData();
  };

  return (
    <UserDataContext.Provider
      value={{
        smokingData,
        unlockedAchievements,
        isLoading,
        checkInToday,
        hasCheckedInToday: hasCheckedInToday(),
        currentStreak: smokingData?.currentStreak || 0,
        longestStreak: smokingData?.longestStreak || 0,
        moneySaved: smokingData ? calculateMoneySaved(smokingData) : 0,
        cigarettesNotSmoked: smokingData ? calculateCigarettesNotSmoked(smokingData) : 0,
        refreshData,
        updateSmokingProfile,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
