import amex from './packs/amex';
import brabus from './packs/brabus';
import digital from './packs/digital';
import energy from './packs/energy';
import ferragamo from './packs/ferragamo';
import foreign from './packs/foreign';
import genesis from './packs/genesis';
import katana from './packs/katana';
import locoContigo from './packs/locoContigo';
import lowrider from './packs/lowrider';
import maskOff from './packs/maskOff';
import morena from './packs/morena';
import outtaControl from './packs/outtaControl';
import shiva from './packs/shiva';
import vendetta from './packs/vendetta';
import vintage from './packs/vintage';
import xmas from './packs/xmas';
import yamaha from './packs/yamaha';
import zenith from './packs/zenith';

interface SoundPack {
  id: string;
  name: string;
  genre: string;
  bpm: string | number;
  cover: any;
  demo?: any;
  sounds: Record<string, any>;
  soundGroups?: Record<string, string[]>;
  padConfig: Array<{
    id: number;
    sound: string | null;
    color: string;
    group?: string;
  }>;
}

interface MetronomeSounds {
  tick: any;
  beep: any;
  block: any;
}

export const soundPacks: Record<string, SoundPack> = {
  amex,
  brabus,
  digital,
  energy,
  ferragamo,
  foreign,
  genesis,
  katana,
  locoContigo,
  lowrider,
  maskOff,
  morena,
  outtaControl,
  shiva,
  vendetta,
  vintage,
  xmas,
  yamaha,
  zenith,
};

export const metronome: MetronomeSounds = {
  tick: require('./metronome/tick.mp3'),
  beep: require('./metronome/beep.mp3'),
  block: require('./metronome/block.mp3'),
};
