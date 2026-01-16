export interface ZodiacColor {
  primary: string;
  secondary: string;
  name: string;
}

export interface WuxingColor {
  primary: string;
  secondary: string;
  name: string;
}

export interface NumerologyColor {
  color: string;
  name: string;
}

export interface LuckyColorResult {
  zodiacColor: string;
  wuxingColor: string;
  numerologyColor: string;
  primaryColor: string;
  secondaryColor: string;
  woodPurpleColors: string[];
}

export type WuxingType = '木' | '火' | '土' | '金' | '水';
