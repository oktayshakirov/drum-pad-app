import {AudioContext} from 'react-native-audio-api';
import {Image} from 'react-native';
import {getSoundModuleId, getAvailableSoundNames} from '../utils/soundUtils.js';
import {soundPacks} from '../assets/sounds';

const LOG_PREFIX = 'AudioService:';

class AudioService {
  constructor() {
    this.audioContext = null;
    this.currentSoundPack = null;
    this.soundBuffers = new Map();
    this.metronomeBuffer = null;
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

  async _initializeAudioContext() {
    if (this.audioContext) {
      return Promise.resolve();
    }
    if (this._initializationPromise) {
      return this._initializationPromise;
    }
    this._initializationPromise = (async () => {
      try {
        this.audioContext = new AudioContext();
      } catch (error) {
        console.error(
          `${LOG_PREFIX} Error initializing AudioContext:`,
          error.message,
        );
        this.audioContext = null;
        this._initializationPromise = null;
        throw error;
      }
    })();
    return this._initializationPromise;
  }

  async _ensureInitialized() {
    try {
      await this._initializationPromise;
    } catch (error) {
      throw new Error('AudioContextInitializationFailed');
    }
    if (!this.audioContext) {
      throw new Error('AudioContextNotAvailable');
    }
  }

  async _loadAndDecodeSound(soundModuleId, soundIdentifier = 'UnknownSound') {
    if (!soundModuleId) {
      return null;
    }
    let assetSource;
    try {
      assetSource = Image.resolveAssetSource(soundModuleId);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Failed to resolve asset source for ${soundIdentifier}:`,
        error.message,
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
        error.message,
      );
      return null;
    }
  }

  _findGroupForSound(soundName) {
    for (const group in this.soundGroups) {
      if (this.soundGroups[group].includes(soundName)) {
        return group;
      }
    }
    return null;
  }

  _stopPreviousSound(soundName, groupName) {
    if (groupName) {
      if (this.activeGroupSources.has(groupName)) {
        const oldSource = this.activeGroupSources.get(groupName);
        try {
          oldSource.stop();
        } catch (e) {}
      }
    } else {
      if (this.activeSingleSources.has(soundName)) {
        const oldSource = this.activeSingleSources.get(soundName);
        try {
          oldSource.stop();
        } catch (e) {}
      }
    }
  }

  async setSoundPack(soundPack) {
    await this._ensureInitialized();
    if (this.currentSoundPack === soundPack && this.soundBuffers.size > 0) {
      return true;
    }
    await this.stopAllSounds();
    this.soundBuffers.clear();
    this.currentSoundPack = soundPack;
    this.soundGroups = soundPacks[soundPack]?.soundGroups || {};
    const soundNames = getAvailableSoundNames(soundPack);
    if (!soundNames?.length) {
      this.currentSoundPack = null;
      return false;
    }
    const loadPromises = soundNames.map(async name => {
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
        error.message,
      );
      return false;
    }
  }

  async playSound(soundPack, soundName) {
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
      audioBuffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${soundName}`,
      );
      if (audioBuffer) {
        this.soundBuffers.set(soundName, audioBuffer);
      } else {
        return false;
      }
    }
    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
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
      console.error(`${LOG_PREFIX} Error playing sound:`, error.message);
      return false;
    }
  }

  async _loadMetronomeSound() {
    if (this.metronomeBuffer) {
      return;
    }
    await this._ensureInitialized();
    const tickModuleId = getSoundModuleId('metronome', 'tick');
    this.metronomeBuffer = await this._loadAndDecodeSound(
      tickModuleId,
      'metronome/tick',
    );
  }

  _metronomeScheduler() {
    while (
      this.nextBeatTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this._scheduleMetronomeTick(this.nextBeatTime);
      this.nextBeatTime += 60.0 / this.bpm;
    }
    this.metronomeTimerId = setTimeout(
      () => this._metronomeScheduler(),
      this.schedulerLookahead,
    );
  }

  _scheduleMetronomeTick(time) {
    if (!this.metronomeBuffer) {
      return;
    }
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.metronomeBuffer;
      source.connect(this.audioContext.destination);
      source.start(time);
      if (this.onTickCallback) {
        const delay = (time - this.audioContext.currentTime) * 1000;
        setTimeout(this.onTickCallback, Math.max(0, delay));
      }
      this.activeMetronomeSourceNodes.add(source);
      source.onended = () => this.activeMetronomeSourceNodes.delete(source);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error scheduling metronome tick:`,
        error.message,
      );
    }
  }

  async startMetronome(bpm, onTick) {
    if (bpm <= 0) {
      return;
    }
    await this._ensureInitialized();
    await this._loadMetronomeSound();
    if (!this.metronomeBuffer) {
      return;
    }
    await this.stopMetronome();
    this.bpm = bpm;
    this.onTickCallback = onTick;
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    this.nextBeatTime = this.audioContext.currentTime + 0.1;
    this._metronomeScheduler();
  }

  async stopMetronome() {
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

  async playDemo(packId) {
    if (!packId) {
      return false;
    }
    await this._ensureInitialized();
    try {
      if (this._activeDemoSource) {
        await this.stopDemo();
      }
      const pack = soundPacks[packId];
      if (!pack?.demo) {
        return false;
      }
      const buffer = await this._loadDemoBuffer(packId, pack.demo);
      if (!buffer) {
        return false;
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      const playPromise = new Promise(resolve => {
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
      console.error(`${LOG_PREFIX} Error playing demo:`, error.message);
      this._activeDemoSource = null;
      return false;
    }
  }

  async stopDemo() {
    if (this._activeDemoSource) {
      try {
        this._activeDemoSource.stop();
      } catch (error) {
        console.warn(`${LOG_PREFIX} Error stopping demo:`, error.message);
      } finally {
        this._activeDemoSource = null;
      }
    }
  }

  async _loadDemoBuffer(packId, demoModuleId) {
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
      const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.demoBuffers.set(packId, buffer);
      return buffer;
    } catch (error) {
      console.error(`${LOG_PREFIX} Error loading demo buffer:`, error.message);
      return null;
    }
  }

  async stopAllSounds() {
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
}

export default new AudioService();
