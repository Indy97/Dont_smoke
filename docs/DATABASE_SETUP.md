# Instrukcja wdrożenia bazy danych Firebase

## 1. Tworzenie projektu Firebase

### Krok 1: Utwórz projekt w Firebase Console

1. Przejdź do [Firebase Console](https://console.firebase.google.com/)
2. Kliknij "Dodaj projekt" (Add project)
3. Wprowadź nazwę projektu: `nie-pale-app`
4. Włącz/wyłącz Google Analytics według preferencji
5. Kliknij "Utwórz projekt"

### Krok 2: Dodaj aplikacje do projektu

#### Dla iOS:
1. W Firebase Console kliknij ikonę iOS
2. Wprowadź Bundle ID: `com.niepale.app`
3. Opcjonalnie: App nickname i App Store ID
4. Pobierz plik `GoogleService-Info.plist`
5. Umieść plik w katalogu `ios/` projektu

#### Dla Android:
1. W Firebase Console kliknij ikonę Android
2. Wprowadź Package name: `com.niepale.app`
3. Opcjonalnie: App nickname i Debug signing certificate
4. Pobierz plik `google-services.json`
5. Umieść plik w katalogu głównym projektu

### Krok 3: Skopiuj konfigurację

W Firebase Console -> Project Settings -> General, znajdź sekcję "Your apps" i skopiuj konfigurację Firebase:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

Wklej tę konfigurację do pliku `src/services/firebase.ts`.

## 2. Konfiguracja Authentication

### Krok 1: Włącz metody logowania

1. W Firebase Console przejdź do Authentication -> Sign-in method
2. Włącz następujące metody:
   - Email/Password
   - (Opcjonalnie) Google Sign-In
   - (Opcjonalnie) Apple Sign-In

### Krok 2: Skonfiguruj szablony emaili

1. Przejdź do Authentication -> Templates
2. Dostosuj szablony:
   - Email address verification
   - Password reset

## 3. Konfiguracja Firestore Database

### Krok 1: Utwórz bazę danych

1. Przejdź do Firestore Database
2. Kliknij "Create database"
3. Wybierz tryb "Start in production mode"
4. Wybierz lokalizację (np. `europe-central2` dla Polski)

### Krok 2: Skonfiguruj reguły bezpieczeństwa

Przejdź do Firestore -> Rules i wklej następujące reguły:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Użytkownicy - tylko właściciel może czytać/pisać
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Dane o paleniu - tylko właściciel
    match /smokingData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Osiągnięcia - tylko właściciel
    match /achievements/{docId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
    }

    // Posty społeczności - czytanie dla wszystkich zalogowanych,
    // pisanie tylko dla właścicieli
    match /communityPosts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               resource.data.authorId == request.auth.uid;
    }
  }
}
```

### Krok 3: Utwórz indeksy

Firestore automatycznie utworzy potrzebne indeksy, ale dla optymalnej wydajności dodaj:

1. Przejdź do Firestore -> Indexes
2. Utwórz composite index:
   - Collection: `achievements`
   - Fields: `userId` (Ascending), `unlockedAt` (Descending)

## 4. Struktura bazy danych

### Kolekcja: users
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "createdAt": "timestamp",
  "premiumStatus": {
    "isActive": "boolean",
    "plan": "string",
    "expiresAt": "timestamp"
  }
}
```

### Kolekcja: smokingData
```json
{
  "quitDate": "timestamp",
  "cigarettesPerDay": "number",
  "pricePerPack": "number",
  "cigarettesPerPack": "number",
  "currentStreak": "number",
  "longestStreak": "number",
  "checkIns": ["string (ISO date)"],
  "lastCheckIn": "timestamp"
}
```

### Kolekcja: achievements
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "description": "string",
  "icon": "string",
  "type": "streak|money|cigarettes|health",
  "requirement": "number",
  "unlockedAt": "timestamp"
}
```

### Kolekcja: communityPosts
```json
{
  "authorId": "string",
  "authorName": "string",
  "content": "string",
  "createdAt": "timestamp",
  "likes": "number",
  "likedBy": ["string (userId)"],
  "commentsCount": "number"
}
```

## 5. Tworzenie kopii zapasowych

### Automatyczne backupy

1. Przejdź do Firebase Console -> Firestore -> Backups
2. Włącz automatyczne backupy
3. Skonfiguruj harmonogram (zalecane: codziennie)

### Eksport ręczny

Użyj Firebase CLI:
```bash
gcloud firestore export gs://your-bucket-name/backups/$(date +%Y-%m-%d)
```

## 6. Monitorowanie

### Firebase Performance Monitoring

1. Dodaj do `package.json`:
```json
"firebase/performance": "^10.12.0"
```

2. Zainicjalizuj w aplikacji:
```javascript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

### Firebase Analytics

Analytics jest automatycznie włączony. Śledź:
- Logowania użytkowników
- Check-iny
- Zakupy premium
- Odblokowane osiągnięcia

## 7. Rozwiązywanie problemów

### Problem: "Permission denied"
- Sprawdź reguły bezpieczeństwa Firestore
- Upewnij się, że użytkownik jest zalogowany

### Problem: "Network error"
- Sprawdź połączenie internetowe
- Upewnij się, że Firebase jest prawidłowo zainicjalizowany

### Problem: "Invalid API key"
- Sprawdź czy klucze w `firebase.ts` są poprawne
- Upewnij się, że API key nie jest ograniczony

## 8. Koszty i limity

### Darmowy plan (Spark)
- 1 GB storage
- 50K odczytów/dzień
- 20K zapisów/dzień
- 20K usunięć/dzień

### Plan Blaze (Pay as you go)
- Nieograniczone operacje
- Płacisz za użycie
- Ustaw budżet alerts w Firebase Console

---

Po wykonaniu wszystkich kroków, Twoja baza danych Firebase będzie gotowa do użycia z aplikacją "Nie Palę".
