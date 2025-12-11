# Instrukcja publikacji aplikacji w App Store i Google Play

## Część 1: Przygotowanie do publikacji

### 1.1 Wymagane zasoby graficzne

Przygotuj następujące materiały:

#### Ikona aplikacji
- **iOS**: 1024x1024px (PNG, bez przezroczystości)
- **Android**: 512x512px (PNG, z przezroczystością)

#### Screenshots
- **iPhone 6.7"**: 1290x2796px (minimum 3, max 10)
- **iPhone 6.5"**: 1284x2778px
- **iPhone 5.5"**: 1242x2208px
- **iPad 12.9"**: 2048x2732px
- **Android Phone**: 1080x1920px (minimum 2, max 8)
- **Android Tablet**: 1920x1080px lub 1200x1920px

#### Feature Graphic (tylko Android)
- 1024x500px (PNG lub JPEG)

### 1.2 Opis aplikacji

**Tytuł**: Nie Palę - Rzuć Palenie

**Krótki opis** (80 znaków):
```
Rzuć palenie z nami! Śledź postępy, zdobywaj osiągnięcia, oszczędzaj pieniądze.
```

**Pełny opis** (4000 znaków max):
```
🚭 NIE PALĘ - Twój osobisty asystent w rzucaniu palenia!

Dołącz do tysięcy osób, które skutecznie rzuciły palenie dzięki naszej aplikacji.
Każdy dzień bez papierosa to zwycięstwo!

📊 ŚLEDŹ SWOJE POSTĘPY
• Zobacz ile dni nie palisz
• Oblicz zaoszczędzone pieniądze
• Sprawdź ile papierosów nie wypaliłeś
• Obserwuj regenerację swojego zdrowia

🏆 ZDOBYWAJ OSIĄGNIĘCIA
• Odblokowuj nagrody za każdy kamień milowy
• Od pierwszego dnia do roku wolności od nikotyny
• Ponad 30 unikalnych osiągnięć do zdobycia

💡 CODZIENNE MOTYWACJE
• Otrzymuj ciekawostki o zdrowiu
• Poznaj korzyści płynące z niepalenia
• Inspirujące cytaty na każdy dzień

📈 OŚ ZDROWIA
• Zobacz jak Twoje ciało się regeneruje
• Od 20 minut do 15 lat - każdy etap opisany
• Oparte na badaniach medycznych WHO

👥 SPOŁECZNOŚĆ (Premium)
• Dziel się swoimi sukcesami
• Wspieraj innych na tej samej drodze
• Świętuj razem kamienie milowe

⭐ FUNKCJE PREMIUM
• Bez reklam
• Zaawansowane statystyki
• Spersonalizowane porady
• Dostęp do społeczności
• Własne motywy
• Coaching 1:1 (plan Pro)

🔔 PRZYPOMNIENIA
• Codzienne przypomnienia o check-inie
• Powiadomienia o nowych osiągnięciach
• Motywacyjne wiadomości

Twoje zdrowie jest bezcenne. Każdy dzień bez papierosa to inwestycja
w lepsze jutro. Pobierz teraz i rozpocznij swoją drogę do wolności!

---
Kontakt: support@niepale.app
Polityka prywatności: https://niepale.app/privacy
Regulamin: https://niepale.app/terms
```

**Słowa kluczowe**:
```
rzuć palenie, quit smoking, papierosy, nikotyna, zdrowie, motywacja,
osiągnięcia, oszczędności, wellness, nałóg, abstynencja, smokefree
```

---

## Część 2: Publikacja w Google Play Store

### Krok 1: Utwórz konto dewelopera

1. Przejdź do [Google Play Console](https://play.google.com/console)
2. Zaloguj się kontem Google
3. Zapłać jednorazową opłatę rejestracyjną: **25 USD**
4. Wypełnij dane konta dewelopera
5. Zweryfikuj tożsamość (może zająć do 48h)

### Krok 2: Utwórz aplikację

1. W Play Console kliknij "Utwórz aplikację"
2. Wypełnij:
   - Nazwa aplikacji: `Nie Palę - Rzuć Palenie`
   - Język domyślny: Polski
   - Typ: Aplikacja
   - Darmowa / Płatna: Darmowa

### Krok 3: Skonfiguruj informacje o sklepie

#### Główne informacje
1. Przejdź do "Informacje o aplikacji" -> "Główne informacje o sklepie"
2. Dodaj:
   - Krótki opis
   - Pełny opis
   - Ikonę aplikacji
   - Feature graphic
   - Zrzuty ekranu (min. 2)

#### Kategoria i dane kontaktowe
1. Kategoria: Zdrowie i fitness
2. Tagi: Zdrowie, Lifestyle, Wellness
3. Adres email kontaktowy
4. Polityka prywatności URL

### Krok 4: Kwestionariusz klasyfikacji treści

1. Przejdź do "Zasady i programy" -> "Klasyfikacja treści"
2. Wypełnij kwestionariusz IARC
3. Twoja aplikacja powinna otrzymać:
   - PEGI 3 (Europa)
   - Everyone (USA)

### Krok 5: Konfiguracja cennika i dystrybucji

1. Przejdź do "Monetyzacja" -> "Produkty"
2. Dodaj subskrypcje:

```
ID: premium_monthly
Nazwa: Premium Miesięczny
Cena: 19.99 PLN/miesiąc

ID: premium_yearly
Nazwa: Premium Roczny
Cena: 149.99 PLN/rok

ID: pro_monthly
Nazwa: Pro Miesięczny
Cena: 39.99 PLN/miesiąc

ID: pro_yearly
Nazwa: Pro Roczny
Cena: 299.99 PLN/rok
```

### Krok 6: Zbuduj i prześlij aplikację

```bash
# Zaloguj do EAS
npx eas login

# Zbuduj dla Android (AAB)
npx eas build --platform android --profile production

# Prześlij do Google Play
npx eas submit --platform android
```

Lub ręcznie:
1. Pobierz plik `.aab` po zakończeniu buildu
2. W Play Console przejdź do "Produkcja" -> "Utwórz nową wersję"
3. Prześlij plik AAB
4. Dodaj informacje o wersji

### Krok 7: Prześlij do recenzji

1. Sprawdź wszystkie sekcje (zielone checkmarki)
2. Kliknij "Wyślij do weryfikacji"
3. Czas weryfikacji: **3-7 dni** (pierwsza publikacja)

---

## Część 3: Publikacja w Apple App Store

### Krok 1: Utwórz konto Apple Developer

1. Przejdź do [Apple Developer](https://developer.apple.com)
2. Zaloguj się Apple ID
3. Zapisz się do Apple Developer Program
4. Opłata roczna: **99 USD/rok**
5. Zweryfikuj tożsamość (osoby prawne: D-U-N-S Number)
6. Czas aktywacji: do 48h

### Krok 2: Skonfiguruj certyfikaty i profile

#### W Xcode (automatycznie)
1. Otwórz projekt w Xcode
2. Signing & Capabilities
3. Włącz "Automatically manage signing"
4. Wybierz swój Team

#### Lub przez EAS (zalecane)
```bash
npx eas credentials
# Wybierz iOS -> Production -> Automatic
```

### Krok 3: Utwórz aplikację w App Store Connect

1. Przejdź do [App Store Connect](https://appstoreconnect.apple.com)
2. Kliknij "+" -> "Nowa aplikacja"
3. Wypełnij:
   - Platformy: iOS
   - Nazwa: `Nie Palę - Rzuć Palenie`
   - Język główny: Polski
   - Bundle ID: `com.niepale.app`
   - SKU: `niepale-app-001`

### Krok 4: Wypełnij informacje o aplikacji

#### Informacje o wersji
1. Zrzuty ekranu dla wszystkich wymaganych rozmiarów
2. Tekst promocyjny (170 znaków)
3. Opis
4. Słowa kluczowe (100 znaków, oddzielone przecinkami)
5. Adres URL wsparcia
6. Adres URL marketingowy

#### Ocena wiekowa
1. Wypełnij kwestionariusz wiekowy
2. Brak treści dla dorosłych -> Rating 4+

#### Informacje o aplikacji
1. Kategoria główna: Zdrowie i fitness
2. Kategoria pomocnicza: Styl życia
3. Licencja: Standardowa licencja
4. Prawa autorskie

### Krok 5: Skonfiguruj zakupy w aplikacji

1. Przejdź do "Funkcje" -> "Zakupy w aplikacji"
2. Kliknij "+" i dodaj każdą subskrypcję:

```
Typ: Subskrypcja z automatycznym odnowieniem
Nazwa referencyjna: Premium Monthly
ID produktu: premium_monthly
Grupa subskrypcji: Premium

Lokalizacje:
- Polski: "Premium Miesięczny", "Pełen dostęp do wszystkich funkcji"
- Angielski: "Premium Monthly", "Full access to all features"

Cena: Tier 6 (~19.99 PLN)
```

Powtórz dla pozostałych planów.

### Krok 6: Zbuduj i prześlij aplikację

```bash
# Zbuduj dla iOS
npx eas build --platform ios --profile production

# Prześlij do App Store
npx eas submit --platform ios
```

### Krok 7: Wypełnij informacje dla recenzji

1. Dane logowania testowego (jeśli wymagane logowanie):
   ```
   Email: test@niepale.app
   Hasło: TestPass123!
   ```
2. Uwagi dla recenzenta
3. Dane kontaktowe

### Krok 8: Wyślij do recenzji

1. Wybierz wersję z buildu
2. Wypełnij wszystkie wymagane pola
3. Kliknij "Wyślij do recenzji"
4. Czas recenzji: **24-48 godzin** (zazwyczaj)

---

## Część 4: Konfiguracja RevenueCat (zakupy in-app)

### Krok 1: Utwórz konto RevenueCat

1. Przejdź do [RevenueCat](https://www.revenuecat.com)
2. Utwórz darmowe konto
3. Utwórz nowy projekt: `Nie Palę`

### Krok 2: Podłącz sklepy

#### Google Play
1. W RevenueCat -> Platforms -> Google Play
2. Wprowadź package name: `com.niepale.app`
3. Dodaj Service Account credentials:
   - Przejdź do Google Play Console -> Setup -> API access
   - Utwórz Service Account
   - Pobierz JSON key
   - Prześlij do RevenueCat

#### App Store
1. W RevenueCat -> Platforms -> App Store
2. Wprowadź bundle ID: `com.niepale.app`
3. Dodaj App Store Connect credentials:
   - App-specific shared secret (App Store Connect -> App -> App Information)

### Krok 3: Skonfiguruj produkty

1. Utwórz Entitlements:
   - `premium` - dostęp do funkcji Premium
   - `pro` - dostęp do funkcji Pro

2. Utwórz Offerings:
   - Offering ID: `default`
   - Packages:
     - `premium_monthly` -> Entitlement: premium
     - `premium_yearly` -> Entitlement: premium
     - `pro_monthly` -> Entitlement: pro
     - `pro_yearly` -> Entitlement: pro

### Krok 4: Zaktualizuj klucze API

W pliku `src/services/purchases.ts`:
```javascript
const REVENUECAT_API_KEY_IOS = 'appl_xxxxxxxxxxxxx';
const REVENUECAT_API_KEY_ANDROID = 'goog_xxxxxxxxxxxxx';
```

---

## Część 5: Checklist przed publikacją

### Techniczny
- [ ] Firebase produkcyjne klucze skonfigurowane
- [ ] RevenueCat produkcyjne klucze skonfigurowane
- [ ] Wszystkie console.log usunięte
- [ ] Crash reporting skonfigurowany
- [ ] Analytics skonfigurowany

### Prawny
- [ ] Polityka prywatności opublikowana
- [ ] Regulamin opublikowany
- [ ] RODO compliance (dla UE)
- [ ] Licencje bibliotek sprawdzone

### Marketing
- [ ] Screenshots przygotowane
- [ ] Opisy przetłumaczone
- [ ] Ikona aplikacji gotowa
- [ ] Feature graphic (Android) gotowy
- [ ] Preview video (opcjonalne)

### Testowanie
- [ ] Testy na prawdziwych urządzeniach
- [ ] Testy zakupów in-app (sandbox)
- [ ] Testy różnych rozmiarów ekranów
- [ ] Testy w trybie offline
- [ ] Testy migracji danych

---

## Część 6: Po publikacji

### Monitorowanie
1. Śledź recenzje i oceny
2. Odpowiadaj na opinie użytkowników
3. Monitoruj crash reports
4. Analizuj metryki użycia

### Aktualizacje
1. Planuj regularne aktualizacje (co 2-4 tygodnie)
2. Reaguj szybko na krytyczne błędy
3. Dodawaj nowe funkcje na podstawie feedbacku

### Marketing
1. ASO (App Store Optimization)
2. Kampanie reklamowe (Apple Search Ads, Google Ads)
3. Social media
4. Content marketing

---

## Wsparcie

- **Google Play**: https://support.google.com/googleplay/android-developer
- **App Store**: https://developer.apple.com/contact
- **RevenueCat**: https://docs.revenuecat.com

---

*Ostatnia aktualizacja: 2024*
