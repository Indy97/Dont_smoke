import { Achievement } from '../services/firebase';

export const achievements: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_1',
    name: 'Pierwszy krok',
    description: 'Przeżyj pierwszy dzień bez papierosa',
    icon: '🌱',
    type: 'streak',
    requirement: 1,
  },
  {
    id: 'streak_3',
    name: 'Trzy dni mocy',
    description: 'Utrzymaj 3 dni bez palenia - nikotyna opuszcza Twój organizm!',
    icon: '💪',
    type: 'streak',
    requirement: 3,
  },
  {
    id: 'streak_7',
    name: 'Tydzień wolności',
    description: 'Cały tydzień bez papierosa! Twój smak i węch się poprawiają.',
    icon: '🌟',
    type: 'streak',
    requirement: 7,
  },
  {
    id: 'streak_14',
    name: 'Dwa tygodnie czystości',
    description: '14 dni! Krążenie krwi znacznie się poprawia.',
    icon: '🏃',
    type: 'streak',
    requirement: 14,
  },
  {
    id: 'streak_21',
    name: 'Nawyk przełamany',
    description: '21 dni - według naukowców tyle trwa zmiana nawyku!',
    icon: '🧠',
    type: 'streak',
    requirement: 21,
  },
  {
    id: 'streak_30',
    name: 'Miesiąc sukcesu',
    description: 'Cały miesiąc bez palenia! Funkcja płuc poprawia się o 30%.',
    icon: '🎉',
    type: 'streak',
    requirement: 30,
  },
  {
    id: 'streak_60',
    name: 'Dwa miesiące determinacji',
    description: '60 dni! Twoja skóra jest zdrowsza i bardziej promienna.',
    icon: '✨',
    type: 'streak',
    requirement: 60,
  },
  {
    id: 'streak_90',
    name: 'Kwartał zdrowia',
    description: '3 miesiące! Rzęski w płucach regenerują się.',
    icon: '🏆',
    type: 'streak',
    requirement: 90,
  },
  {
    id: 'streak_180',
    name: 'Pół roku wolności',
    description: '6 miesięcy! Ryzyko zawału serca spadło o połowę.',
    icon: '❤️',
    type: 'streak',
    requirement: 180,
  },
  {
    id: 'streak_365',
    name: 'Rok bez dymu',
    description: 'Cały rok! Ryzyko choroby wieńcowej jest o 50% niższe.',
    icon: '👑',
    type: 'streak',
    requirement: 365,
  },
  {
    id: 'streak_730',
    name: 'Dwuletni mistrz',
    description: '2 lata wolności! Ryzyko udaru wraca do normy.',
    icon: '🎖️',
    type: 'streak',
    requirement: 730,
  },
  {
    id: 'streak_1825',
    name: 'Legenda 5 lat',
    description: '5 lat! Ryzyko raka płuc spadło o 50%.',
    icon: '🌈',
    type: 'streak',
    requirement: 1825,
  },

  // Money saved achievements
  {
    id: 'money_50',
    name: 'Pierwsze oszczędności',
    description: 'Zaoszczędziłeś 50 zł nie kupując papierosów!',
    icon: '💰',
    type: 'money',
    requirement: 50,
  },
  {
    id: 'money_100',
    name: 'Setka w kieszeni',
    description: '100 zł oszczędności! To jak darmowy obiad.',
    icon: '💵',
    type: 'money',
    requirement: 100,
  },
  {
    id: 'money_250',
    name: 'Ćwierć tysiąca',
    description: '250 zł! Możesz kupić coś fajnego dla siebie.',
    icon: '💎',
    type: 'money',
    requirement: 250,
  },
  {
    id: 'money_500',
    name: 'Pół tysiąca',
    description: '500 zł oszczędności! To nowy telefon lub weekend wyjazdowy.',
    icon: '📱',
    type: 'money',
    requirement: 500,
  },
  {
    id: 'money_1000',
    name: 'Tysiącznik',
    description: '1000 zł! Zaoszczędziłeś fortunę.',
    icon: '🤑',
    type: 'money',
    requirement: 1000,
  },
  {
    id: 'money_2500',
    name: 'Wakacyjny fundusz',
    description: '2500 zł - wystarczy na fajne wakacje!',
    icon: '🏖️',
    type: 'money',
    requirement: 2500,
  },
  {
    id: 'money_5000',
    name: 'Pięć tysięcy',
    description: '5000 zł oszczędności! To poważne pieniądze.',
    icon: '🏦',
    type: 'money',
    requirement: 5000,
  },
  {
    id: 'money_10000',
    name: 'Dziesięć tysięcy',
    description: '10 000 zł! Można kupić używany samochód.',
    icon: '🚗',
    type: 'money',
    requirement: 10000,
  },

  // Cigarettes not smoked achievements
  {
    id: 'cigarettes_20',
    name: 'Pierwsza paczka',
    description: 'Nie wypaliłeś 20 papierosów - to cała paczka!',
    icon: '🚭',
    type: 'cigarettes',
    requirement: 20,
  },
  {
    id: 'cigarettes_100',
    name: 'Setka w plecy',
    description: '100 papierosów mniej w Twoim organizmie!',
    icon: '💯',
    type: 'cigarettes',
    requirement: 100,
  },
  {
    id: 'cigarettes_500',
    name: 'Pięćset czystych oddechów',
    description: '500 papierosów! Twoje płuca są wdzięczne.',
    icon: '🌬️',
    type: 'cigarettes',
    requirement: 500,
  },
  {
    id: 'cigarettes_1000',
    name: 'Tysiąc unikniętych',
    description: '1000 papierosów nie trafiło do Twoich płuc!',
    icon: '🎯',
    type: 'cigarettes',
    requirement: 1000,
  },
  {
    id: 'cigarettes_5000',
    name: 'Pięć tysięcy powodów',
    description: '5000 papierosów! To ogromne osiągnięcie.',
    icon: '🏅',
    type: 'cigarettes',
    requirement: 5000,
  },
  {
    id: 'cigarettes_10000',
    name: 'Dziesięć tysięcy zwycięstw',
    description: '10 000 papierosów których nie wypaliłeś!',
    icon: '🥇',
    type: 'cigarettes',
    requirement: 10000,
  },

  // Health milestones
  {
    id: 'health_1',
    name: 'Pierwsze 20 minut',
    description: 'Po 20 minutach ciśnienie krwi wraca do normy.',
    icon: '❤️‍🔥',
    type: 'health',
    requirement: 0, // 0 days = after first check-in
  },
  {
    id: 'health_3',
    name: 'Oczyszczenie z nikotyny',
    description: 'Po 3 dniach nikotyna opuściła Twój organizm!',
    icon: '🧹',
    type: 'health',
    requirement: 3,
  },
  {
    id: 'health_14',
    name: 'Lepsza cyrkulacja',
    description: 'Po 2 tygodniach krążenie krwi znacznie się poprawia.',
    icon: '🩸',
    type: 'health',
    requirement: 14,
  },
  {
    id: 'health_30',
    name: 'Oddychaj pełną piersią',
    description: 'Po miesiącu funkcja płuc poprawia się o 30%.',
    icon: '🫁',
    type: 'health',
    requirement: 30,
  },
  {
    id: 'health_90',
    name: 'Regeneracja rzęsek',
    description: 'Po 3 miesiącach rzęski w płucach zaczynają się regenerować.',
    icon: '🌿',
    type: 'health',
    requirement: 90,
  },
  {
    id: 'health_270',
    name: 'Czyste płuca',
    description: 'Po 9 miesiącach płuca są znacznie czystsze.',
    icon: '☁️',
    type: 'health',
    requirement: 270,
  },
  {
    id: 'health_365',
    name: 'Zdrowe serce',
    description: 'Po roku ryzyko choroby wieńcowej spada o połowę.',
    icon: '💖',
    type: 'health',
    requirement: 365,
  },
];

export const getAchievementProgress = (
  achievement: Achievement,
  currentStreak: number,
  moneySaved: number,
  cigarettesNotSmoked: number
): number => {
  let current = 0;
  switch (achievement.type) {
    case 'streak':
    case 'health':
      current = currentStreak;
      break;
    case 'money':
      current = moneySaved;
      break;
    case 'cigarettes':
      current = cigarettesNotSmoked;
      break;
  }
  return Math.min((current / achievement.requirement) * 100, 100);
};
