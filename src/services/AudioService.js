import TrackPlayer from 'react-native-track-player';
import {getSoundPath} from '../utils/soundUtils';

class AudioService {
  constructor() {
    this.currentSoundPack = null;
    this.isInitialized = false;
    this.initializePlayer();
  }

  async initializePlayer() {
    if (this.isInitialized) {
      return;
    }

    try {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
        waitForBuffer: true,
      });
      this.isInitialized = true;
      console.log('TrackPlayer initialized successfully');
    } catch (error) {
      console.error('Error initializing TrackPlayer:', error);
    }
  }

  async preloadSoundPack(soundPack) {
    if (!this.isInitialized) {
      console.log('Waiting for TrackPlayer initialization...');
      await this.initializePlayer();
    }

    try {
      console.log(`Preloading sound pack: ${soundPack}`);
      const sounds = await this.getSoundPackSounds(soundPack);

      await TrackPlayer.reset();

      await TrackPlayer.add(sounds);

      this.currentSoundPack = soundPack;
      console.log(`Sound pack ${soundPack} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error preloading sound pack ${soundPack}:`, error);
      return false;
    }
  }

  async getSoundPackSounds(soundPack) {
    const soundFiles = ['kick', 'snare', 'hi_hat', 'clap'];

    return soundFiles.map(sound => ({
      id: `${soundPack}_${sound}`,
      url: getSoundPath(soundPack, sound),
      title: sound,
      artist: soundPack,
      duration: 1,
    }));
  }

  async playSound(soundPack, sound) {
    if (!this.isInitialized) {
      console.log('Waiting for TrackPlayer initialization...');
      await this.initializePlayer();
    }

    try {
      if (this.currentSoundPack !== soundPack) {
        console.log(`Sound pack ${soundPack} not preloaded`);
        await this.preloadSoundPack(soundPack);
      }

      const trackId = `${soundPack}_${sound}`;
      const queue = await TrackPlayer.getQueue();
      const track = queue.find(t => t.id === trackId);

      if (!track) {
        console.error(`Track ${trackId} not found in queue`);
        return false;
      }

      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      await TrackPlayer.play();
      return true;
    } catch (error) {
      console.error(`Error playing sound ${sound}:`, error);
      return false;
    }
  }

  async stopSound() {
    if (!this.isInitialized) {
      return;
    }
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  async startMetronome(bpm) {
    if (!this.isInitialized) {
      console.log('Waiting for TrackPlayer initialization...');
      await this.initializePlayer();
    }

    try {
      const tickSound = {
        id: 'metronome_tick',
        url: getSoundPath('metronome', 'tick'),
        title: 'Metronome Tick',
        artist: 'Metronome',
        duration: 0.1,
      };

      await TrackPlayer.reset();
      await TrackPlayer.add(tickSound);

      const interval = (60 / bpm) * 1000;
      this.metronomeInterval = setInterval(async () => {
        try {
          await TrackPlayer.play();
          await TrackPlayer.seekTo(0);
        } catch (error) {
          console.error('Error playing metronome tick:', error);
        }
      }, interval);
    } catch (error) {
      console.error('Error starting metronome:', error);
    }
  }

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }
}

export default new AudioService();
