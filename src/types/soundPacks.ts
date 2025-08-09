export interface PadColors {
  DRUMS_MAIN: string;
  DRUMS_ACCENT: string;
  MELODY_MAIN: string;
  MELODY_ACCENT: string;
  SFX_MAIN: string;
  SFX_ACCENT: string;
  [key: string]: string;
}

export type Theme = 'light' | 'dark';

export interface SoundPack {
  id: string;
  name: string;
  genre: string;
  bpm: string | number;
  cover: any;
  demo: any;
  sounds: Record<string, any>;
  soundGroups: Record<string, string[]>;
  padConfig: Array<{
    id: number;
    sound: string;
    color: string;
    group?: string;
    icon?: string;
    title?: string;
  }>;
  theme?: Theme;
}
