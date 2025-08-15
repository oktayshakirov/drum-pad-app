import AsyncStorage from '@react-native-async-storage/async-storage';
import {showRewardedAd, isRewardedAdReady} from '../components/ads/RewardedAd';

const UNLOCKED_PACKS_KEY = 'unlockedPacks';
const FREE_UNLOCK_ATTEMPTS_KEY = 'freeUnlockAttempts';
const FREE_UNLOCK_COOLDOWN_HOURS = 24;
const DEFAULT_UNLOCKED_PACKS: string[] = [];

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

      const attemptsString = await AsyncStorage.getItem(
        FREE_UNLOCK_ATTEMPTS_KEY,
      );
      if (attemptsString) {
        const attempts = JSON.parse(attemptsString);
        this.freeUnlockAttempts = new Map(Object.entries(attempts));
      }
    } catch (error) {
      // Handle error silently
    }
  }

  static async unlockPack(packId: string): Promise<void> {
    if (!packId || typeof packId !== 'string') {
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
      // Handle error silently
    }
  }

  static isPackUnlocked(packId: string): boolean {
    return this.unlockedPacks.has(packId);
  }

  static getUnlockedPacks(): Set<string> {
    return new Set(this.unlockedPacks);
  }

  static canGetFreeUnlock(packId: string): boolean {
    const attempts = this.freeUnlockAttempts.get(packId);
    if (!attempts) {
      return true;
    }

    const hoursSinceLastAttempt =
      (Date.now() - attempts.lastAttempt) / (1000 * 60 * 60);
    const cooldownExpired = hoursSinceLastAttempt >= FREE_UNLOCK_COOLDOWN_HOURS;

    return cooldownExpired;
  }

  static async useFreeUnlock(packId: string): Promise<void> {
    const now = Date.now();
    this.freeUnlockAttempts.set(packId, {lastAttempt: now});

    const attemptsObject = Object.fromEntries(this.freeUnlockAttempts);
    await AsyncStorage.setItem(
      FREE_UNLOCK_ATTEMPTS_KEY,
      JSON.stringify(attemptsObject),
    );
  }

  static getUnlockStatus(packId: string): {
    isUnlocked: boolean;
    canGetFreeUnlock: boolean;
    hasRewardedAd: boolean;
    hoursUntilFreeUnlock: number;
  } {
    const isUnlocked = this.isPackUnlocked(packId);
    const canGetFreeUnlock = this.canGetFreeUnlock(packId);
    const hasRewardedAd = isRewardedAdReady();

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

  static async attemptUnlockWithFallbacks(packId: string): Promise<{
    success: boolean;
    method: 'rewarded' | 'free' | 'failed';
    showCongratulatoryAlert: boolean;
  }> {
    if (isRewardedAdReady()) {
      try {
        const adResult = await showRewardedAd();

        if (adResult.success && adResult.rewardEarned) {
          await this.unlockPack(packId);
          return {
            success: true,
            method: 'rewarded',
            showCongratulatoryAlert: true,
          };
        } else {
          return {
            success: false,
            method: 'failed',
            showCongratulatoryAlert: false,
          };
        }
      } catch (error) {}
    }

    if (this.canGetFreeUnlock(packId)) {
      await this.useFreeUnlock(packId);
      return {
        success: true,
        method: 'free',
        showCongratulatoryAlert: false,
      };
    }

    return {
      success: false,
      method: 'failed',
      showCongratulatoryAlert: false,
    };
  }

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
