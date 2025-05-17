import TrackPlayer, {
  RepeatMode,
  State as PlaybackState,
} from 'react-native-track-player';
import {getSoundPath, getAvailableSounds} from '../utils/soundUtils';

const LOG_PREFIX = 'AudioService:';

class AudioService {
  constructor() {
    this.currentSoundPack = null;
    this.metronomeInterval = null;
    this.isPlayerSetup = false;
    this._initializePlayer();
  }

  async _initializePlayer() {
    if (this.isPlayerSetup) {
      return;
    }
    try {
      console.log(`${LOG_PREFIX} Initializing TrackPlayer...`);
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
        waitForBuffer: true,
      });
      this.isPlayerSetup = true;
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      console.log(`${LOG_PREFIX} TrackPlayer initialized successfully.`);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error initializing TrackPlayer:`,
        error.message,
      );
      this.isPlayerSetup = false;
    }
  }

  async _ensureInitialized() {
    if (!this.isPlayerSetup) {
      await this._initializePlayer();
    }
    if (!this.isPlayerSetup) {
      console.error(`${LOG_PREFIX} FATAL: Player initialization failed.`);
      throw new Error('PlayerNotInitialized');
    }
  }

  async setSoundPack(soundPack) {
    await this._ensureInitialized();

    const sounds = getAvailableSounds(soundPack);
    if (!sounds || sounds.length === 0) {
      console.error(
        `${LOG_PREFIX} No sounds found for sound pack ${soundPack}.`,
      );
      this.currentSoundPack = null;
      return false;
    }

    if (this.currentSoundPack !== soundPack && this.currentSoundPack !== null) {
      try {
        await TrackPlayer.reset();
        console.log(
          `${LOG_PREFIX} Player reset due to sound pack change from ${this.currentSoundPack} to ${soundPack}.`,
        );
      } catch (e) {
        console.warn(
          `${LOG_PREFIX} Error resetting player during sound pack change:`,
          e.message,
        );
      }
    }
    this.currentSoundPack = soundPack;
    console.log(`${LOG_PREFIX} Sound pack context set to: ${soundPack}.`);
    return true;
  }

  async playSound(soundPack, soundName) {
    await this._ensureInitialized();

    try {
      if (this.currentSoundPack !== soundPack) {
        console.warn(
          `${LOG_PREFIX} Sound pack context mismatch. Current: ${this.currentSoundPack}, Requested: ${soundPack}. Attempting to switch...`,
        );
        if (!(await this.setSoundPack(soundPack))) {
          console.error(
            `${LOG_PREFIX} Failed to switch to sound pack ${soundPack}. Cannot play sound.`,
          );
          return false;
        }
      }

      const trackId = `${soundPack}_${soundName}`;
      const soundsInPack = getAvailableSounds(soundPack);
      const soundData = soundsInPack.find(s => s.name === soundName);

      if (
        !soundData ||
        soundData.path === undefined ||
        soundData.path === null
      ) {
        console.error(
          `${LOG_PREFIX} Sound data or path for '${trackId}' is missing or invalid.`,
        );
        return false;
      }

      const trackToPlay = {
        id: trackId,
        url: soundData.path,
        title: String(soundData.name || soundName),
        artist: String(soundPack || 'DrumPadApp'),
        duration: 1,
        type: 'default',
      };

      await TrackPlayer.stop();
      await TrackPlayer.reset();
      await TrackPlayer.add([trackToPlay]);
      await TrackPlayer.play();
      return true;
    } catch (error) {
      console.error(
        `${LOG_PREFIX} CRITICAL ERROR playing sound ${soundName} from ${soundPack}:`,
        error.message,
        error.code ? `(Code: ${error.code})` : '',
      );
      return false;
    }
  }

  async stopAllSounds() {
    if (!this.isPlayerSetup) {
      return;
    }
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.warn(`${LOG_PREFIX} Error stopping sound:`, error.message);
    }
  }

  async startMetronome(bpm) {
    await this._ensureInitialized();

    try {
      this.stopMetronome();

      const tickSoundPath = getSoundPath('metronome', 'tick');
      if (tickSoundPath === undefined || tickSoundPath === null) {
        console.error(
          `${LOG_PREFIX} Metronome tick sound path not found or invalid.`,
        );
        return;
      }

      const metronomeTrack = {
        id: 'metronome_tick',
        url: tickSoundPath,
        title: 'Metronome Tick',
        artist: 'Metronome',
        duration: 0.1,
        type: 'default',
      };

      await TrackPlayer.reset();
      await TrackPlayer.add([metronomeTrack]);

      const intervalTime = (60 / bpm) * 1000;
      this.metronomeInterval = setInterval(async () => {
        try {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
        } catch (playError) {
          console.warn(
            `${LOG_PREFIX} Metronome tick playback error, attempting reload:`,
            playError.message,
          );
          try {
            await TrackPlayer.reset();
            await TrackPlayer.add([metronomeTrack]);
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
          } catch (reloadError) {
            console.error(
              `${LOG_PREFIX} Fatal error playing metronome tick after reload:`,
              reloadError.message,
            );
            this.stopMetronome();
          }
        }
      }, intervalTime);
      console.log(`${LOG_PREFIX} Metronome started at ${bpm} BPM.`);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Error starting metronome:`,
        error.message,
        error.code ? `(Code: ${error.code})` : '',
      );
    }
  }

  async stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
      console.log(`${LOG_PREFIX} Metronome interval cleared.`);
    }
    if (!this.isPlayerSetup) {
      return;
    }

    try {
      const state = await TrackPlayer.getPlaybackState();
      if (
        state.state === PlaybackState.Playing ||
        state.state === PlaybackState.Buffering
      ) {
        await TrackPlayer.stop();
      }
    } catch (e) {
      console.warn(
        `${LOG_PREFIX} Issue stopping/checking player in stopMetronome:`,
        e.message,
      );
    }
  }
}

export default new AudioService();
