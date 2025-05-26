import {AudioContext} from 'react-native-audio-api';
import {Image} from 'react-native';
import {getSoundModuleId, getAvailableSoundNames} from '../utils/soundUtils.js';

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
        console.log(`${LOG_PREFIX} Initializing AudioContext...`);
        this.audioContext = new AudioContext();
        console.log(`${LOG_PREFIX} AudioContext initialized successfully.`);
      } catch (error) {
        console.error(
          `${LOG_PREFIX} Error initializing AudioContext:`,
          error.message,
          error,
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
    } catch (initError) {
      console.error(
        `${LOG_PREFIX} AudioContext initialization failed during ensureInitialized:`,
        initError.message,
      );
      throw new Error('AudioContextInitializationFailed');
    }
    if (!this.audioContext) {
      console.error(
        `${LOG_PREFIX} FATAL: AudioContext is null after initialization attempt.`,
      );
      throw new Error('AudioContextNotAvailable');
    }
  }

  async _loadAndDecodeSound(soundModuleId, soundIdentifier = 'UnknownSound') {
    if (!soundModuleId) {
      console.error(
        `${LOG_PREFIX} Invalid sound module ID for ${soundIdentifier}.`,
      );
      return null;
    }

    let assetSource;
    try {
      assetSource = Image.resolveAssetSource(soundModuleId);
    } catch (resolveError) {
      console.error(
        `${LOG_PREFIX} Failed to resolve asset source for ${soundIdentifier} (module ID: ${soundModuleId}):`,
        resolveError.message,
      );
      return null;
    }

    if (!assetSource || !assetSource.uri) {
      console.error(
        `${LOG_PREFIX} Missing URI for resolved asset ${soundIdentifier} (module ID: ${soundModuleId}).`,
      );
      return null;
    }

    try {
      console.log(
        `${LOG_PREFIX} Fetching ${soundIdentifier} from URI: ${assetSource.uri}`,
      );
      const response = await fetch(assetSource.uri);
      if (!response.ok) {
        throw new Error(
          `Workspace failed with status ${response.status}: ${response.statusText}`,
        );
      }
      const arrayBuffer = await response.arrayBuffer();

      if (!this.audioContext || this.audioContext.state === 'closed') {
        console.error(
          `${LOG_PREFIX} AudioContext not available or closed during decodeAudioData for ${soundIdentifier}.`,
        );
        throw new Error('AudioContextUnavailableForDecoding');
      }
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error loading/decoding ${soundIdentifier} (URI: ${assetSource.uri}):`,
        error.message,
        error,
      );
      return null;
    }
  }

  async setSoundPack(soundPack) {
    await this._ensureInitialized();
    console.log(`${LOG_PREFIX} Setting sound pack to: ${soundPack}`);

    if (this.currentSoundPack === soundPack && this.soundBuffers.size > 0) {
      console.log(`${LOG_PREFIX} Sound pack ${soundPack} already loaded.`);
      return true;
    }

    this.soundBuffers.clear();
    this.currentSoundPack = soundPack;
    const soundNames = getAvailableSoundNames(soundPack);

    if (!soundNames || soundNames.length === 0) {
      console.warn(
        `${LOG_PREFIX} No sounds found for sound pack ${soundPack}.`,
      );
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
      console.log(
        `${LOG_PREFIX} Sound pack ${soundPack} loaded with ${this.soundBuffers.size} of ${soundNames.length} expected sounds.`,
      );
      return true;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error during batch sound loading for pack ${soundPack}:`,
        error.message,
      );
      return false;
    }
  }

  async playSound(soundPack, soundName) {
    await this._ensureInitialized();

    if (this.currentSoundPack !== soundPack) {
      console.warn(
        `${LOG_PREFIX} Sound pack mismatch. Current: ${this.currentSoundPack}, Requested: ${soundPack}. Switching...`,
      );
      const switched = await this.setSoundPack(soundPack);
      if (!switched) {
        console.error(
          `${LOG_PREFIX} Failed to switch to sound pack ${soundPack}. Cannot play ${soundName}.`,
        );
        return false;
      }
    }

    let audioBuffer = this.soundBuffers.get(soundName);
    if (!audioBuffer) {
      console.warn(
        `${LOG_PREFIX} Buffer for '${soundName}' (pack '${soundPack}') not pre-loaded. Attempting lazy load...`,
      );
      const moduleId = getSoundModuleId(soundPack, soundName);
      audioBuffer = await this._loadAndDecodeSound(
        moduleId,
        `${soundPack}/${soundName}`,
      );
      if (audioBuffer) {
        this.soundBuffers.set(soundName, audioBuffer);
      } else {
        console.error(`${LOG_PREFIX} Failed to lazy load sound ${soundName}.`);
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
      source.start();
      return true;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error playing sound ${soundName} from ${soundPack}:`,
        error.message,
        error,
      );
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
    if (!this.metronomeBuffer) {
      console.error(`${LOG_PREFIX} Metronome tick sound failed to load.`);
    }
  }

  // --- METRONOME LOGIC ---

  _metronomeScheduler() {
    while (
      this.nextBeatTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this._scheduleMetronomeTick(this.nextBeatTime);
      const secondsPerBeat = 60.0 / this.bpm;
      this.nextBeatTime += secondsPerBeat;
    }
    this.metronomeTimerId = setTimeout(
      () => this._metronomeScheduler(),
      this.schedulerLookahead,
    );
  }

  _scheduleMetronomeTick(time) {
    if (!this.metronomeBuffer) {
      console.warn(`${LOG_PREFIX} Metronome tick skipped: Buffer missing.`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.metronomeBuffer;
      source.connect(this.audioContext.destination);
      source.start(time);

      this.activeMetronomeSourceNodes.add(source);
      source.onended = () => {
        this.activeMetronomeSourceNodes.delete(source);
      };
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error scheduling metronome tick:`,
        error.message,
      );
    }
  }

  async startMetronome(bpm) {
    if (bpm <= 0) {
      console.error(
        `${LOG_PREFIX} Invalid BPM: ${bpm}. Metronome not started.`,
      );
      return;
    }
    await this._ensureInitialized();
    await this._loadMetronomeSound();

    if (!this.metronomeBuffer) {
      console.error(
        `${LOG_PREFIX} Cannot start metronome: tick sound not loaded.`,
      );
      return;
    }

    await this.stopMetronome();

    this.bpm = bpm;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.nextBeatTime = this.audioContext.currentTime + 0.1;
    this._metronomeScheduler();
    console.log(`${LOG_PREFIX} Metronome started at ${bpm} BPM.`);
  }

  async stopMetronome() {
    if (this.metronomeTimerId) {
      clearTimeout(this.metronomeTimerId);
      this.metronomeTimerId = null;
    }

    this.activeMetronomeSourceNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Ignore errors if node already stopped
      }
    });
    this.activeMetronomeSourceNodes.clear();
    console.log(`${LOG_PREFIX} Metronome stopped.`);
  }
}

export default new AudioService();
