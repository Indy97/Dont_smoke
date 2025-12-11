export interface DailyFact {
  id: number;
  day: number;
  fact: string;
  category: 'health' | 'money' | 'motivation' | 'science' | 'social';
  icon: string;
}

export const dailyFacts: DailyFact[] = [
  // Day 1-7: First week facts
  {
    id: 1,
    day: 1,
    fact: 'Po 20 minutach od ostatniego papierosa Twoje ciśnienie krwi i tętno wracają do normy. Twój organizm już zaczyna się regenerować!',
    category: 'health',
    icon: '❤️',
  },
  {
    id: 2,
    day: 2,
    fact: 'Po 8 godzinach poziom tlenku węgla we krwi spada o połowę, a poziom tlenu wraca do normy. Twoje komórki mogą oddychać!',
    category: 'health',
    icon: '🫁',
  },
  {
    id: 3,
    day: 3,
    fact: 'Po 48 godzinach nikotyna jest całkowicie usunięta z organizmu! Twój smak i węch zaczynają się poprawiać.',
    category: 'health',
    icon: '👃',
  },
  {
    id: 4,
    day: 4,
    fact: 'Palacze wydają średnio 7000 zł rocznie na papierosy. Pomyśl co możesz zrobić z tymi pieniędzmi!',
    category: 'money',
    icon: '💰',
  },
  {
    id: 5,
    day: 5,
    fact: 'Po 72 godzinach oskrzela zaczynają się rozluźniać i oddychanie staje się łatwiejsze. Poziom energii rośnie!',
    category: 'health',
    icon: '⚡',
  },
  {
    id: 6,
    day: 6,
    fact: 'Dzieci palaczy mają 3x większe ryzyko, że same zaczną palić. Rzucając, chronisz nie tylko siebie!',
    category: 'social',
    icon: '👨‍👩‍👧',
  },
  {
    id: 7,
    day: 7,
    fact: 'Gratulacje! Pierwszy tydzień za Tobą! To najtrudniejszy okres - jeśli dałeś radę, dasz radę wszystko!',
    category: 'motivation',
    icon: '🎉',
  },

  // Day 8-14: Second week
  {
    id: 8,
    day: 8,
    fact: 'Jeden papieros zawiera ponad 7000 chemikaliów, z czego 70 jest rakotwórczych. Twoje ciało dziękuje za przerwę!',
    category: 'science',
    icon: '🔬',
  },
  {
    id: 9,
    day: 9,
    fact: 'Po 2 tygodniach krążenie krwi znacznie się poprawia. Możesz to odczuć podczas ćwiczeń - masz więcej siły!',
    category: 'health',
    icon: '🏃',
  },
  {
    id: 10,
    day: 10,
    fact: 'Palenie skraca życie średnio o 10-14 lat. Każdy dzień bez papierosa to dzień dodany do Twojego życia!',
    category: 'science',
    icon: '⏰',
  },
  {
    id: 11,
    day: 11,
    fact: 'Twoja skóra zaczyna wyglądać zdrowiej - palenie zmniejsza dopływ tlenu do skóry i przyspiesza starzenie.',
    category: 'health',
    icon: '✨',
  },
  {
    id: 12,
    day: 12,
    fact: 'Osoby rzucające palenie często zauważają, że jedzenie smakuje lepiej. Twoje kubki smakowe się regenerują!',
    category: 'health',
    icon: '🍳',
  },
  {
    id: 13,
    day: 13,
    fact: 'Bierne palenie zabija 600 000 osób rocznie na świecie. Chroniąc siebie, chronisz też bliskich.',
    category: 'social',
    icon: '🛡️',
  },
  {
    id: 14,
    day: 14,
    fact: 'Dwa tygodnie! Twoje płuca działają lepiej, a chęć palenia staje się coraz słabsza. Jesteś niesamowity!',
    category: 'motivation',
    icon: '💪',
  },

  // Day 15-21: Third week
  {
    id: 15,
    day: 15,
    fact: 'Palenie powoduje 85% przypadków raka płuc. Każdy dzień bez papierosa zmniejsza Twoje ryzyko!',
    category: 'science',
    icon: '🎗️',
  },
  {
    id: 16,
    day: 16,
    fact: 'Twoje zęby i paznokcie zaczynają wyglądać zdrowiej - żółknięcie powoli znika!',
    category: 'health',
    icon: '😁',
  },
  {
    id: 17,
    day: 17,
    fact: 'Według badań, 21 dni to czas potrzebny do zmiany nawyku. Jesteś prawie u celu!',
    category: 'science',
    icon: '🧠',
  },
  {
    id: 18,
    day: 18,
    fact: 'Palacze mają 2-4 razy większe ryzyko chorób serca. Twoje serce z każdym dniem jest bezpieczniejsze!',
    category: 'health',
    icon: '❤️',
  },
  {
    id: 19,
    day: 19,
    fact: 'Zapach dymu pozostaje we włosach i ubraniach przez godziny. Teraz pachiesz świeżo przez cały dzień!',
    category: 'social',
    icon: '🌸',
  },
  {
    id: 20,
    day: 20,
    fact: 'Twoja wydolność fizyczna znacznie się poprawiła. Wchodzenie po schodach nie męczy tak jak kiedyś!',
    category: 'health',
    icon: '🚶',
  },
  {
    id: 21,
    day: 21,
    fact: '21 dni! Nawyk przełamany! Twój mózg stworzył nowe ścieżki neuronowe - jesteś wolny od nałogu!',
    category: 'motivation',
    icon: '🏆',
  },

  // Day 22-30: Fourth week
  {
    id: 22,
    day: 22,
    fact: 'Palenie kosztuje służbę zdrowia miliardy rocznie. Nie paląc, pomagasz też systemowi ochrony zdrowia!',
    category: 'social',
    icon: '🏥',
  },
  {
    id: 23,
    day: 23,
    fact: 'Poziom stresu u byłych palaczy jest niższy niż u palących! Papieros nie uspokaja - uzależnienie stresuje.',
    category: 'science',
    icon: '😌',
  },
  {
    id: 24,
    day: 24,
    fact: 'Twoje rzęski w płucach zaczynają się regenerować - to małe "szczoteczki" które chronią przed infekcjami.',
    category: 'health',
    icon: '🌿',
  },
  {
    id: 25,
    day: 25,
    fact: 'Palenie zwiększa ryzyko bezpłodności zarówno u kobiet jak i mężczyzn. Teraz Twoje ciało się regeneruje!',
    category: 'health',
    icon: '👶',
  },
  {
    id: 26,
    day: 26,
    fact: 'Kaszel palacza zaczyna ustępować - Twoje płuca oczyszczają się z nagromadzonego śluzu i zanieczyszczeń.',
    category: 'health',
    icon: '🫁',
  },
  {
    id: 27,
    day: 27,
    fact: 'Twój układ odpornościowy się wzmacnia. Będziesz rzadziej chorować na przeziębienia!',
    category: 'health',
    icon: '💉',
  },
  {
    id: 28,
    day: 28,
    fact: 'Prawie miesiąc! Twoja siła woli jest niesamowita. Jesteś inspiracją dla innych!',
    category: 'motivation',
    icon: '🌟',
  },
  {
    id: 29,
    day: 29,
    fact: 'Palacze mają 50% większe ryzyko demencji. Twój mózg dziękuje za czysty tlen!',
    category: 'science',
    icon: '🧠',
  },
  {
    id: 30,
    day: 30,
    fact: 'MIESIĄC! Funkcja Twoich płuc poprawiła się o 30%! To ogromny sukces - bądź z siebie dumny!',
    category: 'motivation',
    icon: '🎊',
  },

  // Day 31-60: Second month
  {
    id: 31,
    day: 31,
    fact: 'Po miesiącu wiele osób zauważa, że mają więcej energii rano. Organizm regeneruje się podczas snu lepiej!',
    category: 'health',
    icon: '☀️',
  },
  {
    id: 32,
    day: 45,
    fact: 'Twoja skóra wygląda młodziej - palenie przyspiesza starzenie nawet o 10-20 lat!',
    category: 'health',
    icon: '🧴',
  },
  {
    id: 33,
    day: 60,
    fact: 'Dwa miesiące! Chęć palenia jest teraz znacznie rzadsza. Twój mózg przyzwyczaił się do życia bez nikotyny.',
    category: 'motivation',
    icon: '🧘',
  },

  // Day 61-90: Third month
  {
    id: 34,
    day: 75,
    fact: 'Twoje włosy rosną zdrowsze i mocniejsze. Palenie zaburzało dopływ składników odżywczych!',
    category: 'health',
    icon: '💇',
  },
  {
    id: 35,
    day: 90,
    fact: 'Trzy miesiące! Rzęski w płucach się zregenerowały - Twój układ oddechowy działa jak nowy!',
    category: 'motivation',
    icon: '🏅',
  },

  // Day 91-180: Fourth to sixth month
  {
    id: 36,
    day: 120,
    fact: 'Cztery miesiące! Twój kaszel prawie całkowicie ustąpił, a oddech jest czysty i świeży.',
    category: 'health',
    icon: '🌬️',
  },
  {
    id: 37,
    day: 150,
    fact: 'Pięć miesięcy! Ryzyko zawału serca zaczyna znacząco spadać z każdym dniem.',
    category: 'health',
    icon: '❤️‍🩹',
  },
  {
    id: 38,
    day: 180,
    fact: 'PÓŁ ROKU! Ryzyko zawału serca spadło o 50%! Twoje serce jest znacznie zdrowsze.',
    category: 'motivation',
    icon: '💖',
  },

  // Day 181-365: Second half of first year
  {
    id: 39,
    day: 270,
    fact: 'Dziewięć miesięcy! Twoje płuca są teraz znacznie czystsze. Możesz biegać bez zadyszki!',
    category: 'health',
    icon: '🏃‍♂️',
  },
  {
    id: 40,
    day: 365,
    fact: 'ROK! Ryzyko choroby wieńcowej jest o 50% niższe niż u palacza! Jesteś prawdziwym bohaterem!',
    category: 'motivation',
    icon: '👑',
  },

  // Year 2+
  {
    id: 41,
    day: 730,
    fact: 'DWA LATA! Ryzyko udaru mózgu wraca do poziomu osoby niepalącej! Niesamowite!',
    category: 'health',
    icon: '🎖️',
  },
  {
    id: 42,
    day: 1095,
    fact: 'TRZY LATA! Ryzyko zawału serca jest takie samo jak u osoby, która nigdy nie paliła!',
    category: 'health',
    icon: '💝',
  },
  {
    id: 43,
    day: 1825,
    fact: 'PIĘĆ LAT! Ryzyko raka płuc, jamy ustnej i gardła spadło o 50%! Jesteś legendą!',
    category: 'motivation',
    icon: '🌈',
  },
  {
    id: 44,
    day: 3650,
    fact: 'DZIESIĘĆ LAT! Ryzyko raka płuc jest takie samo jak u niepalącego! Dokonałeś niemożliwego!',
    category: 'motivation',
    icon: '🏰',
  },
];

export const healthTimeline = [
  {
    time: '20 minut',
    icon: '❤️',
    title: 'Ciśnienie wraca do normy',
    description: 'Tętno i ciśnienie krwi zaczynają wracać do prawidłowych wartości.',
  },
  {
    time: '8 godzin',
    icon: '🫁',
    title: 'Poziom tlenu rośnie',
    description: 'Poziom tlenku węgla spada, a poziom tlenu we krwi wraca do normy.',
  },
  {
    time: '24 godziny',
    icon: '💓',
    title: 'Ryzyko zawału spada',
    description: 'Ryzyko zawału serca zaczyna maleć.',
  },
  {
    time: '48 godzin',
    icon: '👃',
    title: 'Smak i węch się poprawiają',
    description: 'Nikotyna opuszcza organizm. Zmysły smaku i węchu się wyostrzają.',
  },
  {
    time: '72 godziny',
    icon: '🌬️',
    title: 'Oddychanie łatwiejsze',
    description: 'Oskrzela rozluźniają się, zwiększając pojemność płuc.',
  },
  {
    time: '2 tygodnie',
    icon: '🏃',
    title: 'Lepsza cyrkulacja',
    description: 'Krążenie krwi znacznie się poprawia. Chodzenie staje się łatwiejsze.',
  },
  {
    time: '1 miesiąc',
    icon: '💪',
    title: 'Płuca się regenerują',
    description: 'Funkcja płuc poprawia się o 30%. Mniej kaszlu i zadyszki.',
  },
  {
    time: '3 miesiące',
    icon: '🌿',
    title: 'Rzęski się odradzają',
    description: 'Rzęski w płucach regenerują się, lepiej chronią przed infekcjami.',
  },
  {
    time: '6 miesięcy',
    icon: '❤️‍🩹',
    title: 'Ryzyko zawału -50%',
    description: 'Ryzyko zawału serca spada o połowę w porównaniu z palaczem.',
  },
  {
    time: '1 rok',
    icon: '🏆',
    title: 'Serce jak nowe',
    description: 'Ryzyko choroby wieńcowej jest o 50% niższe niż u palacza.',
  },
  {
    time: '5 lat',
    icon: '🧠',
    title: 'Ryzyko udaru normalny',
    description: 'Ryzyko udaru mózgu wraca do poziomu osoby niepalącej.',
  },
  {
    time: '10 lat',
    icon: '🌟',
    title: 'Ryzyko raka płuc -50%',
    description: 'Ryzyko raka płuc spada o połowę. Ryzyko innych nowotworów też maleje.',
  },
  {
    time: '15 lat',
    icon: '👑',
    title: 'Pełna regeneracja',
    description: 'Ryzyko chorób serca jest takie samo jak u osoby, która nigdy nie paliła.',
  },
];

export const motivationalQuotes = [
  'Każdy dzień bez papierosa to zwycięstwo nad sobą.',
  'Nie liczy się ile razy upadłeś, liczy się ile razy wstałeś.',
  'Siła nie pochodzi z tego co możesz zrobić, ale z pokonywania tego, co myślałeś że niemożliwe.',
  'Twoje ciało jest świątynią - traktuj je z szacunkiem.',
  'Jedyna osoba, którą musisz pokonać, to ta którą byłeś wczoraj.',
  'Sukces to suma małych wysiłków powtarzanych każdego dnia.',
  'Nie czekaj na idealny moment - stwórz go.',
  'Każda podróż zaczyna się od pierwszego kroku.',
  'Jesteś silniejszy niż myślisz i mądrzejszy niż wierzysz.',
  'Zmiana zaczyna się wtedy, gdy dyskomfort pozostania taki sam przewyższa strach przed zmianą.',
  'Twoje zdrowie to najlepsza inwestycja jaką możesz zrobić.',
  'Przeszłość nie definiuje przyszłości - Ty ją tworzysz.',
  'Każdy moment to nowa szansa na nowy początek.',
  'Cierpliwość i wytrwałość mają magiczną moc.',
  'Bądź zmianą którą chcesz zobaczyć w swoim życiu.',
];

export const getTodaysFact = (daysSinceQuit: number): DailyFact => {
  // Find exact match for this day
  const exactMatch = dailyFacts.find(fact => fact.day === daysSinceQuit);
  if (exactMatch) return exactMatch;

  // Find the closest fact for this day
  const sortedFacts = [...dailyFacts].sort((a, b) => a.day - b.day);
  for (let i = sortedFacts.length - 1; i >= 0; i--) {
    if (sortedFacts[i].day <= daysSinceQuit) {
      return sortedFacts[i];
    }
  }

  // Default to first fact
  return dailyFacts[0];
};

export const getRandomMotivationalQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};
