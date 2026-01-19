export interface UserSettings {
  name: string;
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
