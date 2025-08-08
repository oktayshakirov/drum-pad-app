import AsyncStorage from '@react-native-async-storage/async-storage';

const UNLOCKED_PACKS_KEY = 'unlockedPacks';
const DEFAULT_UNLOCKED_PACKS = ['brabus'];

export class UnlockService {
  private static unlockedPacks: Set<string> = new Set(DEFAULT_UNLOCKED_PACKS);

  static async initialize(): Promise<void> {
    try {
      const unlockedPacksString = await AsyncStorage.getItem(
        UNLOCKED_PACKS_KEY,
      );
      if (unlockedPacksString) {
        const unlockedPacksArray = JSON.parse(unlockedPacksString);
        this.unlockedPacks = new Set([
          ...DEFAULT_UNLOCKED_PACKS,
          ...unlockedPacksArray,
        ]);
      }
    } catch (error) {
      console.error('Error loading unlocked packs:', error);
    }
  }

  static async unlockPack(packId: string): Promise<void> {
    if (!packId || typeof packId !== 'string') {
      console.error('Invalid packId provided to unlockPack:', packId);
      return;
    }

    try {
      this.unlockedPacks.add(packId);
      const unlockedPacksArray = Array.from(this.unlockedPacks);
      await AsyncStorage.setItem(
        UNLOCKED_PACKS_KEY,
        JSON.stringify(unlockedPacksArray),
      );
      console.log(`Pack ${packId} unlocked successfully`);
    } catch (error) {
      console.error('Error unlocking pack:', error);
    }
  }

  static isPackUnlocked(packId: string): boolean {
    return this.unlockedPacks.has(packId);
  }

  static getUnlockedPacks(): Set<string> {
    return new Set(this.unlockedPacks);
  }
}
