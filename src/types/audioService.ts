import {
  AudioBuffer,
  AudioBufferSourceNode,
  GainNode,
} from 'react-native-audio-api';

export interface MetronomeState {
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

export interface DemoState {
  isPlaying: boolean;
  activeSource: AudioBufferSourceNode | null;
  buffers: Map<string, AudioBuffer>;
}

export interface SoundPackState {
  currentPack: string | null;
  soundBuffers: Map<string, AudioBuffer>;
  soundGroups: Record<string, string[]>;
  activeGroupSources: Map<string, AudioBufferSourceNode>;
  activeSingleSources: Map<string, AudioBufferSourceNode>;
}

export type SoundEvent = {
  type: 'start' | 'end';
  soundName: string;
  soundPack: string;
  duration?: number;
  playInstanceId?: number;
};
