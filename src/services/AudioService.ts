import {
  AudioContext,
  AudioBuffer,
  AudioBufferSourceNode,
  GainNode,
} from 'react-native-audio-api';
import {Image} from 'react-native';
import {getSoundModuleId, getAvailableSoundNames} from '../utils/soundUtils.ts';
import {soundPacks} from '../assets/sounds';

const LOG_PREFIX = 'AudioService:';

class AudioService {
  private audioContext: AudioContext | null;
  private currentSoundPack: string | null;
  private soundBuffers: Map<string, AudioBuffer>;
  private metronomeSoundBuffers: Map<string, AudioBuffer>;
  private metronomeGainNode: GainNode | null;
  private currentMetronomeSound: string;
  private activeMetronomeSourceNodes: Set<AudioBufferSourceNode>;
  private _initializationPromise: Promise<void> | null;
  private bpm: number;
  private nextBeatTime: number;
  private schedulerLookahead: number;
  private scheduleAheadTime: number;
  private metronomeTimerId: NodeJS.Timeout | null;
  private onTickCallback: (() => void) | null;
  private demoBuffers: Map<string, AudioBuffer> | null;
  private _activeDemoSource: AudioBufferSourceNode | null;
  private soundGroups: Record<string, string[]>;
  private activeGroupSources: Map<string, AudioBufferSourceNode>;
  private activeSingleSources: Map<string, AudioBufferSourceNode>;

  constructor() {
    this.audioContext = null;
    this.currentSoundPack = null;
    this.soundBuffers = new Map();
    this.metronomeSoundBuffers = new Map();
    this.metronomeGainNode = null;
    this.currentMetronomeSound = 'tick';
    this.activeMetronomeSourceNodes = new Set();
    this._initializationPromise = this._initializeAudioContext();
    this.bpm = 120;
    this.nextBeatTime = 0.0;
    this.schedulerLookahead = 25.0;
    this.scheduleAheadTime = 0.1;
    this.metronomeTimerId = null;
    this.onTickCallback = null;
    this.demoBuffers = null;
    this._activeDemoSource = null;
    this.soundGroups = {};
    this.activeGroupSources = new Map();
    this.activeSingleSources = new Map();
  }

  private async _initializeAudioContext(): Promise<void> {
    if (this.audioContext) {
      return Promise.resolve();
    }
    if (this._initializationPromise) {
      return this._initializationPromise;
    }
    this._initializationPromise = (async () => {
      try {
        this.audioContext = new AudioContext();
        this.metronomeGainNode = this.audioContext.createGain();
        this.metronomeGainNode.connect(this.audioContext.destination);
      } catch (error) {
        console.error(
          `${LOG_PREFIX} Error initializing AudioContext:`,
          (error as Error).message,
        );
        this.audioContext = null;
        this._initializationPromise = null;
        throw error;
      }
    })();
    return this._initializationPromise;
  }

  private async _ensureInitialized(): Promise<void> {
    try {
      await this._initializationPromise;
    } catch (error) {
      throw new Error('AudioContextInitializationFailed');
    }
    if (!this.audioContext) {
      throw new Error('AudioContextNotAvailable');
    }
  }

  private async _loadAndDecodeSound(
    soundModuleId: any,
    soundIdentifier: string = 'UnknownSound',
  ): Promise<AudioBuffer | null> {
    if (!soundModuleId) {
      return null;
    }
    let assetSource;
    try {
      assetSource = Image.resolveAssetSource(soundModuleId);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Failed to resolve asset source for ${soundIdentifier}:`,
        (error as Error).message,
      );
      return null;
    }
    if (!assetSource?.uri) {
      return null;
    }
    try {
      const response = await fetch(assetSource.uri);
      if (!response.ok) {
        throw new Error(
          `Failed with status ${response.status}: ${response.statusText}`,
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      if (!this.audioContext || this.audioContext.state === 'closed') {
        throw new Error('AudioContextUnavailableForDecoding');
      }
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error loading/decoding ${soundIdentifier}:`,
        (error as Error).message,
      );
      return null;
    }
  }

  private _findGroupForSound(soundName: string): string | null {
    for (const group in this.soundGroups) {
      if (this.soundGroups[group].includes(soundName)) {
        return group;
      }
    }
    return null;
  }

  private _stopPreviousSound(
    soundName: string,
    groupName: string | null,
  ): void {
    if (groupName) {
      if (this.activeGroupSources.has(groupName)) {
        const oldSource = this.activeGroupSources.get(groupName);
        try {
          oldSource?.stop();
        } catch (e) {}
      }
    } else {
      if (this.activeSingleSources.has(soundName)) {
        const oldSource = this.activeSingleSources.get(soundName);
        try {
          oldSource?.stop();
        } catch (e) {}
      }
    }
  }

  async setSoundPack(soundPack: string): Promise<boolean> {
    await this._ensureInitialized();
    if (this.currentSoundPack === soundPack && this.soundBuffers.size > 0) {
      return true;
    }
    await this.stopAllSounds();
    this.soundBuffers.clear();
    this.currentSoundPack = soundPack;
    this.soundGroups = (soundPacks as any)[soundPack]?.soundGroups || {};
    const soundNames = getAvailableSoundNames(soundPack);
    if (!soundNames?.length) {
      this.currentSoundPack = null;
      return false;
    }
    const loadPromises = soundNames.map(async (name: string) => {
      const moduleId = getSoundModuleId(soundPack, name);
      const buffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${name}`,
      );
      if (buffer) {
        this.soundBuffers.set(name, buffer);
      }
    });
    try {
      await Promise.all(loadPromises);
      return true;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error during batch sound loading:`,
        (error as Error).message,
      );
      return false;
    }
  }

  async playSound(soundPack: string, soundName: string): Promise<boolean> {
    await this._ensureInitialized();
    if (this.currentSoundPack !== soundPack) {
      const switched = await this.setSoundPack(soundPack);
      if (!switched) {
        return false;
      }
    }
    const groupName = this._findGroupForSound(soundName);
    this._stopPreviousSound(soundName, groupName);
    let audioBuffer = this.soundBuffers.get(soundName);
    if (!audioBuffer) {
      const moduleId = getSoundModuleId(soundPack, soundName);
      const loadedBuffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${soundName}`,
      );
      if (loadedBuffer) {
        audioBuffer = loadedBuffer;
        this.soundBuffers.set(soundName, loadedBuffer);
      } else {
        return false;
      }
    }
    try {
      if (this.audioContext!.state === 'suspended') {
        await this.audioContext!.resume();
      }
      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext!.destination);
      if (groupName) {
        this.activeGroupSources.set(groupName, source);
        source.onended = () => {
          if (this.activeGroupSources.get(groupName) === source) {
            this.activeGroupSources.delete(groupName);
          }
        };
      } else {
        this.activeSingleSources.set(soundName, source);
        source.onended = () => {
          if (this.activeSingleSources.get(soundName) === source) {
            this.activeSingleSources.delete(soundName);
          }
        };
      }
      source.start();
      return true;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error playing sound:`,
        (error as Error).message,
      );
      return false;
    }
  }

  private async _loadMetronomeSound(
    soundName: string,
  ): Promise<AudioBuffer | null> {
    if (this.metronomeSoundBuffers.has(soundName)) {
      return this.metronomeSoundBuffers.get(soundName) || null;
    }
    await this._ensureInitialized();
    const tickModuleId = getSoundModuleId('metronome', soundName);
    const buffer = await this._loadAndDecodeSound(
      tickModuleId,
      `metronome/${soundName}`,
    );
    if (buffer) {
      this.metronomeSoundBuffers.set(soundName, buffer);
    }
    return buffer;
  }

  private _metronomeScheduler(): void {
    while (
      this.nextBeatTime <
      this.audioContext!.currentTime + this.scheduleAheadTime
    ) {
      this._scheduleMetronomeTick(this.nextBeatTime);
      this.nextBeatTime += 60.0 / this.bpm;
    }
    this.metronomeTimerId = setTimeout(
      () => this._metronomeScheduler(),
      this.schedulerLookahead,
    );
  }

  private _scheduleMetronomeTick(time: number): void {
    const buffer = this.metronomeSoundBuffers.get(this.currentMetronomeSound);
    if (!buffer || !this.metronomeGainNode) {
      return;
    }
    try {
      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;
      source.connect(this.metronomeGainNode);
      source.start(time);
      if (this.onTickCallback) {
        const delay = (time - this.audioContext!.currentTime) * 1000;
        setTimeout(this.onTickCallback, Math.max(0, delay));
      }
      this.activeMetronomeSourceNodes.add(source);
      source.onended = () => this.activeMetronomeSourceNodes.delete(source);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error scheduling metronome tick:`,
        (error as Error).message,
      );
    }
  }

  async startMetronome(
    bpm: number,
    onTick: () => void,
    soundName: string = 'tick',
    volume: number = 1,
  ): Promise<void> {
    if (this.metronomeTimerId) {
      this.updateBpm(bpm);
      this.updateVolume(volume);
      return;
    }
    if (bpm <= 0) {
      return;
    }
    await this._ensureInitialized();
    await this._loadMetronomeSound(soundName);

    const buffer = this.metronomeSoundBuffers.get(soundName);
    if (!buffer) {
      return;
    }
    await this.stopMetronome();
    this.bpm = bpm;
    this.onTickCallback = onTick;
    this.currentMetronomeSound = soundName;

    if (this.metronomeGainNode) {
      this.metronomeGainNode.gain.setValueAtTime(
        volume,
        this.audioContext!.currentTime,
      );
    }

    if (this.audioContext!.state === 'suspended') {
      await this.audioContext!.resume();
    }
    this.nextBeatTime = this.audioContext!.currentTime + 0.1;
    this._metronomeScheduler();
  }

  async stopMetronome(): Promise<void> {
    if (this.metronomeTimerId) {
      clearTimeout(this.metronomeTimerId);
      this.metronomeTimerId = null;
    }
    this.onTickCallback = null;
    this.activeMetronomeSourceNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    this.activeMetronomeSourceNodes.clear();
  }

  async playDemo(packId: string): Promise<boolean | Promise<boolean>> {
    if (!packId) {
      return false;
    }
    await this._ensureInitialized();
    try {
      if (this._activeDemoSource) {
        await this.stopDemo();
      }
      const pack = (soundPacks as any)[packId];
      if (!pack?.demo) {
        return false;
      }
      const buffer = await this._loadDemoBuffer(packId, pack.demo);
      if (!buffer) {
        return false;
      }
      if (this.audioContext!.state === 'suspended') {
        await this.audioContext!.resume();
      }
      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext!.destination);
      const playPromise = new Promise<boolean>(resolve => {
        source.onended = () => {
          if (this._activeDemoSource === source) {
            this._activeDemoSource = null;
            resolve(true);
          }
        };
      });
      source.start();
      this._activeDemoSource = source;
      return playPromise;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error playing demo:`,
        (error as Error).message,
      );
      this._activeDemoSource = null;
      return false;
    }
  }

  async stopDemo(): Promise<void> {
    if (this._activeDemoSource) {
      try {
        this._activeDemoSource.stop();
      } catch (error) {
        console.warn(
          `${LOG_PREFIX} Error stopping demo:`,
          (error as Error).message,
        );
      } finally {
        this._activeDemoSource = null;
      }
    }
  }

  private async _loadDemoBuffer(
    packId: string,
    demoModuleId: any,
  ): Promise<AudioBuffer | null> {
    if (!this.demoBuffers) {
      this.demoBuffers = new Map();
    }
    const cachedBuffer = this.demoBuffers.get(packId);
    if (cachedBuffer) {
      return cachedBuffer;
    }
    try {
      const assetSource = Image.resolveAssetSource(demoModuleId);
      if (!assetSource?.uri) {
        return null;
      }
      const response = await fetch(assetSource.uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch demo: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.demoBuffers.set(packId, buffer);
      return buffer;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error loading demo buffer:`,
        (error as Error).message,
      );
      return null;
    }
  }

  async stopAllSounds(): Promise<void> {
    await this.stopMetronome();
    await this.stopDemo();
    this.activeGroupSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.activeGroupSources.clear();
    this.activeSingleSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.activeSingleSources.clear();
  }

  public updateBpm(newBpm: number) {
    this.bpm = newBpm;
  }

  public updateVolume(newVolume: number) {
    if (this.metronomeGainNode && this.audioContext) {
      this.metronomeGainNode.gain.setValueAtTime(
        newVolume,
        this.audioContext.currentTime,
      );
    }
  }

  public async updateSound(newSound: string) {
    if (this.currentMetronomeSound !== newSound) {
      await this._loadMetronomeSound(newSound);
      this.currentMetronomeSound = newSound;
    }
  }
}

export default new AudioService();
