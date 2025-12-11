# 🚭 Nie Palę - Aplikacja do rzucania palenia

Kompletna aplikacja mobilna na iOS i Android pomagająca rzucić palenie. Zbudowana z React Native i Expo.

## 📱 Funkcje

### Podstawowe (darmowe)
- ✅ **Dzienny check-in** - potwierdź każdy dzień bez papierosa
- 📊 **Statystyki** - dni bez palenia, zaoszczędzone pieniądze, niewypalione papierosy
- 🏆 **Osiągnięcia** - ponad 30 unikalnych nagród do zdobycia
- 💡 **Ciekawostki** - codzienne fakty o zdrowiu i korzyściach z niepalenia
- 📈 **Oś zdrowia** - wizualizacja regeneracji organizmu
- 🔔 **Przypomnienia** - powiadomienia o check-inie

### Premium (19.99 PLN/mies lub 149.99 PLN/rok)
- 🚫 **Bez reklam**
- 📊 **Zaawansowane statystyki**
- 💬 **Spersonalizowane porady**
- 👥 **Dostęp do społeczności**
- 🎨 **Własne motywy**
- 📤 **Eksport danych**

### Pro (39.99 PLN/mies lub 299.99 PLN/rok)
- Wszystko z Premium +
- 🎯 **Coaching 1:1**
- 📋 **Spersonalizowany plan rzucania**
- 📞 **Wsparcie 24/7**
- 📹 **Sesje video z psychologiem**

## 🚀 Szybki start

### Wymagania
- Node.js 18+
- npm lub yarn
- Expo CLI
- Konto Expo (darmowe)

### Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/your-username/nie-pale.git
cd nie-pale

# Zainstaluj zależności
npm install

# Uruchom w trybie deweloperskim
npx expo start
```

### Uruchamianie

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (preview)
npm run web
```

## 📁 Struktura projektu

```
nie-pale/
├── App.tsx                 # Główny punkt wejścia
├── src/
│   ├── contexts/           # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── UserDataContext.tsx
│   │   └── PremiumContext.tsx
│   ├── data/               # Dane statyczne
│   │   ├── achievements.ts
│   │   └── facts.ts
│   ├── navigation/         # Nawigacja
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/            # Ekrany aplikacji
│   │   ├── auth/
│   │   ├── HomeScreen.tsx
│   │   ├── AchievementsScreen.tsx
│   │   ├── FactsScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PremiumScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── HealthTimelineScreen.tsx
│   │   ├── CommunityScreen.tsx
│   │   └── OnboardingScreen.tsx
│   └── services/           # Serwisy zewnętrzne
│       ├── firebase.ts
│       ├── purchases.ts
│       └── notifications.ts
├── assets/                 # Zasoby graficzne
├── docs/                   # Dokumentacja
│   ├── DATABASE_SETUP.md
│   └── STORE_PUBLISHING.md
└── app.json               # Konfiguracja Expo
```

## 🔧 Konfiguracja

### Firebase

1. Utwórz projekt w [Firebase Console](https://console.firebase.google.com/)
2. Włącz Authentication (Email/Password)
3. Utwórz bazę Firestore
4. Skopiuj konfigurację do `src/services/firebase.ts`

Szczegółowa instrukcja: [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)

### RevenueCat (zakupy in-app)

1. Utwórz konto na [RevenueCat](https://www.revenuecat.com)
2. Skonfiguruj produkty w App Store Connect i Google Play Console
3. Dodaj klucze API do `src/services/purchases.ts`

## 📦 Budowanie

### Development build

```bash
# iOS
npx eas build --platform ios --profile development

# Android
npx eas build --platform android --profile development
```

### Production build

```bash
# iOS (App Store)
npx eas build --platform ios --profile production

# Android (Google Play)
npx eas build --platform android --profile production
```

## 🏪 Publikacja

### Google Play Store

```bash
npx eas submit --platform android
```

### Apple App Store

```bash
npx eas submit --platform ios
```

Szczegółowa instrukcja: [docs/STORE_PUBLISHING.md](docs/STORE_PUBLISHING.md)

## 🛠 Technologie

- **React Native** - framework mobilny
- **Expo** - platforma deweloperska
- **TypeScript** - typowanie
- **Firebase** - backend (auth, database)
- **RevenueCat** - zarządzanie subskrypcjami
- **React Navigation** - nawigacja

## 📊 Funkcje do zaimplementowania

- [ ] Integracja z Google Fit / Apple Health
- [ ] Widget na ekran główny
- [ ] Tryb ciemny
- [ ] Więcej języków
- [ ] Integracja z Apple Watch / Wear OS
- [ ] Kalkulator oszczędności
- [ ] Plan rzucania palenia krok po kroku

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch (`git checkout -b feature/amazing-feature`)
3. Commit zmiany (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE)

## 📞 Kontakt

- Email: support@niepale.app
- Website: https://niepale.app

---

**Zbudowane z ❤️ dla tych, którzy chcą rzucić palenie**
