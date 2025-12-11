import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface SmokingData {
  quitDate: string;
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  currentStreak: number;
  longestStreak: number;
  checkIns: string[];
  lastCheckIn: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'money' | 'cigarettes' | 'health';
  requirement: number;
  unlockedAt?: string;
}

// Authentication Service
export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data();

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || email,
      displayName: userData?.displayName || userCredential.user.displayName || 'Użytkownik',
      createdAt: userData?.createdAt || new Date().toISOString(),
    };
  },

  async signUp(email: string, password: string, name: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const userData: User = {
      uid: userCredential.user.uid,
      email: email,
      displayName: name,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // Create initial smoking data
    const initialSmokingData: SmokingData = {
      quitDate: new Date().toISOString(),
      cigarettesPerDay: 20,
      pricePerPack: 20,
      cigarettesPerPack: 20,
      currentStreak: 0,
      longestStreak: 0,
      checkIns: [],
      lastCheckIn: null,
    };

    await setDoc(doc(db, 'smokingData', userCredential.user.uid), initialSmokingData);

    return userData;
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'Użytkownik',
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    };
  },
};

// User Data Service
export const userDataService = {
  async getSmokingData(userId: string): Promise<SmokingData | null> {
    try {
      const docRef = doc(db, 'smokingData', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as SmokingData;
      }
      return null;
    } catch (error) {
      console.error('Error getting smoking data:', error);
      return null;
    }
  },

  async updateSmokingData(userId: string, data: Partial<SmokingData>): Promise<void> {
    try {
      const docRef = doc(db, 'smokingData', userId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating smoking data:', error);
      throw error;
    }
  },

  async saveAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      const docRef = doc(db, 'achievements', `${userId}_${achievement.id}`);
      await setDoc(docRef, {
        ...achievement,
        userId,
        unlockedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  },

  async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    try {
      const q = query(collection(db, 'achievements'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Achievement);
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  },
};

export { app, auth, db };
