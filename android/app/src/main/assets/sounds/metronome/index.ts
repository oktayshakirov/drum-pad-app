export const METRONOME_SOUNDS = ['tick', 'beep', 'block'] as const;
export type MetronomeSound = (typeof METRONOME_SOUNDS)[number];
