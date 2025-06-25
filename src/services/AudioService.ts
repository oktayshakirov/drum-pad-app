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

interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  currentSound: string;
  volume: number;
  nextBeatTime: number;
  schedulerLookahead: number;
  scheduleAheadTime: number;
  timerId: NodeJS.Timeout | null;
  onTickCallback: (() => void) | null;
  soundBuffers: Map<string, AudioBuffer>;
  gainNode: GainNode | null;
  activeSourceNodes: Set<AudioBufferSourceNode>;
}

interface DemoState {
  isPlaying: boolean;
  activeSource: AudioBufferSourceNode | null;
  buffers: Map<string, AudioBuffer>;
}

interface SoundPackState {
  currentPack: string | null;
  soundBuffers: Map<string, AudioBuffer>;
  soundGroups: Record<string, string[]>;
  activeGroupSources: Map<string, AudioBufferSourceNode>;
  activeSingleSources: Map<string, AudioBufferSourceNode>;
}

class AudioService {
  private audioContext: AudioContext | null;
  private metronomeState: MetronomeState;
  private demoState: DemoState;
  private soundPackState: SoundPackState;

  constructor() {
    this.audioContext = null;

    this.metronomeState = {
      isPlaying: false,
      bpm: 120,
      currentSound: 'tick',
      volume: 1,
      nextBeatTime: 0.0,
      schedulerLookahead: 25.0,
      scheduleAheadTime: 0.1,
      timerId: null,
      onTickCallback: null,
      soundBuffers: new Map(),
      gainNode: null,
      activeSourceNodes: new Set(),
    };

    this.demoState = {
      isPlaying: false,
      activeSource: null,
      buffers: new Map(),
    };

    this.soundPackState = {
      currentPack: null,
      soundBuffers: new Map(),
      soundGroups: {},
      activeGroupSources: new Map(),
      activeSingleSources: new Map(),
    };
  }

  setAudioContext(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this._initializeMetronomeGainNode();
  }

  async setSoundPack(soundPack: string): Promise<boolean> {
    await this._ensureInitialized();

    if (
      this.soundPackState.currentPack === soundPack &&
      this.soundPackState.soundBuffers.size > 0
    ) {
      return true;
    }

    await this.stopAllSounds();
    this.soundPackState.soundBuffers.clear();
    this.soundPackState.currentPack = soundPack;
    this.soundPackState.soundGroups =
      (soundPacks as any)[soundPack]?.soundGroups || {};

    const soundNames = getAvailableSoundNames(soundPack);
    if (!soundNames?.length) {
      this.soundPackState.currentPack = null;
      return false;
    }

    const loadPromises = soundNames.map(async (name: string) => {
      const moduleId = getSoundModuleId(soundPack, name);
      const buffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${name}`,
      );
      if (buffer) {
        this.soundPackState.soundBuffers.set(name, buffer);
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

    if (this.soundPackState.currentPack !== soundPack) {
      const switched = await this.setSoundPack(soundPack);
      if (!switched) {
        return false;
      }
    }

    const groupName = this._findGroupForSound(soundName);
    this._stopPreviousSound(soundName, groupName);

    let audioBuffer = this.soundPackState.soundBuffers.get(soundName);
    if (!audioBuffer) {
      const moduleId = getSoundModuleId(soundPack, soundName);
      const loadedBuffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${soundName}`,
      );
      if (loadedBuffer) {
        audioBuffer = loadedBuffer;
        this.soundPackState.soundBuffers.set(soundName, loadedBuffer);
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
        this.soundPackState.activeGroupSources.set(groupName, source);
        source.onended = () => {
          if (
            this.soundPackState.activeGroupSources.get(groupName) === source
          ) {
            this.soundPackState.activeGroupSources.delete(groupName);
          }
        };
      } else {
        this.soundPackState.activeSingleSources.set(soundName, source);
        source.onended = () => {
          if (
            this.soundPackState.activeSingleSources.get(soundName) === source
          ) {
            this.soundPackState.activeSingleSources.delete(soundName);
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

  async startMetronome(
    bpm: number,
    onTick: () => void,
    soundName: string = 'tick',
    volume: number = 1,
  ): Promise<void> {
    if (this.metronomeState.timerId) {
      this.updateBpm(bpm);
      this.updateVolume(volume);
      return;
    }

    if (bpm <= 0) {
      return;
    }

    await this._ensureInitialized();
    await this._loadMetronomeSound(soundName);

    const buffer = this.metronomeState.soundBuffers.get(soundName);
    if (!buffer) {
      return;
    }

    await this.stopMetronome();

    this.metronomeState.bpm = bpm;
    this.metronomeState.onTickCallback = onTick;
    this.metronomeState.currentSound = soundName;
    this.metronomeState.isPlaying = true;

    if (this.metronomeState.gainNode) {
      this.metronomeState.gainNode.gain.setValueAtTime(
        volume,
        this.audioContext!.currentTime,
      );
    }

    if (this.audioContext!.state === 'suspended') {
      await this.audioContext!.resume();
    }

    this.metronomeState.nextBeatTime = this.audioContext!.currentTime + 0.1;
    this._metronomeScheduler();
  }

  async stopMetronome(): Promise<void> {
    if (this.metronomeState.timerId) {
      clearTimeout(this.metronomeState.timerId);
      this.metronomeState.timerId = null;
    }

    this.metronomeState.onTickCallback = null;
    this.metronomeState.isPlaying = false;

    this.metronomeState.activeSourceNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    this.metronomeState.activeSourceNodes.clear();
  }

  updateBpm(newBpm: number): void {
    this.metronomeState.bpm = newBpm;
  }

  updateVolume(newVolume: number): void {
    if (this.metronomeState.gainNode && this.audioContext) {
      this.metronomeState.gainNode.gain.setValueAtTime(
        newVolume,
        this.audioContext.currentTime,
      );
    }
  }

  async updateSound(newSound: string): Promise<void> {
    if (this.metronomeState.currentSound !== newSound) {
      await this._loadMetronomeSound(newSound);
      this.metronomeState.currentSound = newSound;
    }
  }

  async playDemo(packId: string): Promise<boolean | Promise<boolean>> {
    if (!packId) {
      return false;
    }

    await this._ensureInitialized();

    try {
      if (this.demoState.activeSource) {
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
          if (this.demoState.activeSource === source) {
            this.demoState.activeSource = null;
            this.demoState.isPlaying = false;
            resolve(true);
          }
        };
      });

      source.start();
      this.demoState.activeSource = source;
      this.demoState.isPlaying = true;

      return playPromise;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error playing demo:`,
        (error as Error).message,
      );
      this.demoState.activeSource = null;
      this.demoState.isPlaying = false;
      return false;
    }
  }

  async stopDemo(): Promise<void> {
    if (this.demoState.activeSource) {
      try {
        this.demoState.activeSource.stop();
      } catch (error) {
        console.warn(
          `${LOG_PREFIX} Error stopping demo:`,
          (error as Error).message,
        );
      } finally {
        this.demoState.activeSource = null;
        this.demoState.isPlaying = false;
      }
    }
  }

  async stopAllSounds(): Promise<void> {
    await this.stopMetronome();
    await this.stopDemo();

    this.soundPackState.activeGroupSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.soundPackState.activeGroupSources.clear();

    this.soundPackState.activeSingleSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.soundPackState.activeSingleSources.clear();
  }

  private async _ensureInitialized(): Promise<void> {
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
    for (const group in this.soundPackState.soundGroups) {
      if (this.soundPackState.soundGroups[group].includes(soundName)) {
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
      if (this.soundPackState.activeGroupSources.has(groupName)) {
        const oldSource = this.soundPackState.activeGroupSources.get(groupName);
        try {
          oldSource?.stop();
        } catch (e) {}
      }
    } else {
      if (this.soundPackState.activeSingleSources.has(soundName)) {
        const oldSource =
          this.soundPackState.activeSingleSources.get(soundName);
        try {
          oldSource?.stop();
        } catch (e) {}
      }
    }
  }

  private _initializeMetronomeGainNode(): void {
    if (this.audioContext) {
      this.metronomeState.gainNode = this.audioContext.createGain();
      this.metronomeState.gainNode.connect(this.audioContext.destination);
    }
  }

  private async _loadMetronomeSound(
    soundName: string,
  ): Promise<AudioBuffer | null> {
    if (this.metronomeState.soundBuffers.has(soundName)) {
      return this.metronomeState.soundBuffers.get(soundName) || null;
    }

    await this._ensureInitialized();
    const tickModuleId = getSoundModuleId('metronome', soundName);
    const buffer = await this._loadAndDecodeSound(
      tickModuleId,
      `metronome/${soundName}`,
    );

    if (buffer) {
      this.metronomeState.soundBuffers.set(soundName, buffer);
    }

    return buffer;
  }

  private _metronomeScheduler(): void {
    while (
      this.metronomeState.nextBeatTime <
      this.audioContext!.currentTime + this.metronomeState.scheduleAheadTime
    ) {
      this._scheduleMetronomeTick(this.metronomeState.nextBeatTime);
      this.metronomeState.nextBeatTime += 60.0 / this.metronomeState.bpm;
    }

    this.metronomeState.timerId = setTimeout(
      () => this._metronomeScheduler(),
      this.metronomeState.schedulerLookahead,
    );
  }

  private _scheduleMetronomeTick(time: number): void {
    const buffer = this.metronomeState.soundBuffers.get(
      this.metronomeState.currentSound,
    );
    if (!buffer || !this.metronomeState.gainNode) {
      return;
    }

    try {
      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;
      source.connect(this.metronomeState.gainNode);
      source.start(time);

      if (this.metronomeState.onTickCallback) {
        const delay = (time - this.audioContext!.currentTime) * 1000;
        setTimeout(this.metronomeState.onTickCallback, Math.max(0, delay));
      }

      this.metronomeState.activeSourceNodes.add(source);
      source.onended = () =>
        this.metronomeState.activeSourceNodes.delete(source);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error scheduling metronome tick:`,
        (error as Error).message,
      );
    }
  }

  private async _loadDemoBuffer(
    packId: string,
    demoModuleId: any,
  ): Promise<AudioBuffer | null> {
    const cachedBuffer = this.demoState.buffers.get(packId);
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
      this.demoState.buffers.set(packId, buffer);
      return buffer;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error loading demo buffer:`,
        (error as Error).message,
      );
      return null;
    }
  }
}

export default new AudioService();
