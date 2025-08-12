import AsyncStorage from '@react-native-async-storage/async-storage';
import {showRewardedAd, isRewardedAdReady} from '../components/ads/RewardedAd';

const UNLOCKED_PACKS_KEY = 'unlockedPacks';
const FREE_UNLOCK_ATTEMPTS_KEY = 'freeUnlockAttempts';
const FREE_UNLOCK_COOLDOWN_HOURS = 24; // 24 hours between free unlocks per pack
const DEFAULT_UNLOCKED_PACKS = ['brabus'];

export class UnlockService {
  private static unlockedPacks: Set<string> = new Set(DEFAULT_UNLOCKED_PACKS);
  private static freeUnlockAttempts: Map<string, {lastAttempt: number}> =
    new Map();

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

      // Load free unlock attempts
      const attemptsString = await AsyncStorage.getItem(
        FREE_UNLOCK_ATTEMPTS_KEY,
      );
      if (attemptsString) {
        const attempts = JSON.parse(attemptsString);
        this.freeUnlockAttempts = new Map(Object.entries(attempts));
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

  // Check if user can get a free unlock for this specific pack
  static canGetFreeUnlock(packId: string): boolean {
    const attempts = this.freeUnlockAttempts.get(packId);
    if (!attempts) {
      return true;
    } // First time trying this pack

    const hoursSinceLastAttempt =
      (Date.now() - attempts.lastAttempt) / (1000 * 60 * 60);
    const cooldownExpired = hoursSinceLastAttempt >= FREE_UNLOCK_COOLDOWN_HOURS;

    return cooldownExpired;
  }

  // Mark free unlock as used for this specific pack
  static async useFreeUnlock(packId: string): Promise<void> {
    const now = Date.now();
    this.freeUnlockAttempts.set(packId, {lastAttempt: now});

    // Save to AsyncStorage
    const attemptsObject = Object.fromEntries(this.freeUnlockAttempts);
    await AsyncStorage.setItem(
      FREE_UNLOCK_ATTEMPTS_KEY,
      JSON.stringify(attemptsObject),
    );
  }

  // Get unlock status and available options
  static getUnlockStatus(packId: string): {
    isUnlocked: boolean;
    canGetFreeUnlock: boolean;
    hasRewardedAd: boolean;
    hoursUntilFreeUnlock: number;
  } {
    const isUnlocked = this.isPackUnlocked(packId);
    const canGetFreeUnlock = this.canGetFreeUnlock(packId);
    const hasRewardedAd = isRewardedAdReady();

    // Calculate hours until next free unlock
    const attempts = this.freeUnlockAttempts.get(packId);
    let hoursUntilFreeUnlock = 0;
    if (attempts) {
      const hoursSinceLastAttempt =
        (Date.now() - attempts.lastAttempt) / (1000 * 60 * 60);
      hoursUntilFreeUnlock = Math.max(
        0,
        FREE_UNLOCK_COOLDOWN_HOURS - hoursSinceLastAttempt,
      );
    }

    return {
      isUnlocked,
      canGetFreeUnlock,
      hasRewardedAd,
      hoursUntilFreeUnlock: Math.round(hoursUntilFreeUnlock),
    };
  }

  // Comprehensive unlock method with fallbacks
  static async attemptUnlockWithFallbacks(packId: string): Promise<{
    success: boolean;
    method: 'rewarded' | 'free' | 'failed';
    showCongratulatoryAlert: boolean;
  }> {
    // Method 1: Try Rewarded Ad
    if (isRewardedAdReady()) {
      try {
        await showRewardedAd();
        await this.unlockPack(packId);
        return {
          success: true,
          method: 'rewarded',
          showCongratulatoryAlert: true,
        };
      } catch (error) {
        // Continue to fallback
      }
    }

    // Method 2: Try Free Unlock (if available)
    if (this.canGetFreeUnlock(packId)) {
      await this.useFreeUnlock(packId);
      // Note: We don't unlock the pack permanently - it stays locked for future attempts
      return {
        success: true,
        method: 'free',
        showCongratulatoryAlert: false, // No alert for free unlocks
      };
    } else {
      return {
        success: false,
        method: 'failed',
        showCongratulatoryAlert: false,
      };
    }
  }

  // Reset free unlock attempts (for testing purposes)
  static async resetFreeUnlockAttempts(packId?: string): Promise<void> {
    if (packId) {
      this.freeUnlockAttempts.delete(packId);
    } else {
      this.freeUnlockAttempts.clear();
    }

    const attemptsObject = Object.fromEntries(this.freeUnlockAttempts);
    await AsyncStorage.setItem(
      FREE_UNLOCK_ATTEMPTS_KEY,
      JSON.stringify(attemptsObject),
    );
  }
}
