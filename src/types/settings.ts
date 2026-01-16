export interface UserSettings {
  birthDate: string;
  zodiacSign: string;
  luckyColor: {
    primary: string;
    secondary: string;
    woodPurpleColors: string[];
  };
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}
