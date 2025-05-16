import TrackPlayer from 'react-native-track-player';
import {getSoundPath, getAvailableSounds} from '../utils/soundUtils';

class AudioService {
  constructor() {
    this.currentSoundPack = null;
    this.isInitialized = false;
    this.metronomeInterval = null;
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
      const sounds = getAvailableSounds(soundPack);

      // Only reset if we're changing sound packs
      if (this.currentSoundPack !== soundPack) {
        await TrackPlayer.reset();
      }

      const tracks = sounds.map(sound => ({
        id: `${soundPack}_${sound.name}`,
        url: sound.path,
        title: sound.name,
        artist: soundPack,
        duration: 1,
        type: 'default',
      }));

      console.log('Adding tracks:', tracks);
      await TrackPlayer.add(tracks);

      this.currentSoundPack = soundPack;
      console.log(`Sound pack ${soundPack} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error preloading sound pack ${soundPack}:`, error);
      return false;
    }
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
      console.log(`Playing sound: ${trackId}`);

      const queue = await TrackPlayer.getQueue();
      const track = queue.find(t => t.id === trackId);

      if (!track) {
        console.error(`Track ${trackId} not found in queue`);
        return false;
      }

      // Stop any currently playing sound
      await TrackPlayer.stop();

      // Reset the queue and add only the track we want to play
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
      this.stopMetronome();

      const tickSound = {
        id: 'metronome_tick',
        url: getSoundPath('metronome', 'tick'),
        title: 'Metronome Tick',
        artist: 'Metronome',
        duration: 0.1,
        type: 'default',
      };

      console.log('Metronome sound path:', tickSound.url);

      await TrackPlayer.reset();
      await TrackPlayer.add(tickSound);

      const interval = (60 / bpm) * 1000;
      this.metronomeInterval = setInterval(async () => {
        try {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
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
    TrackPlayer.stop();
  }
}

export default new AudioService();
