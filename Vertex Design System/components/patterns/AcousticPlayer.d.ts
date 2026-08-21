import * as React from 'react';

/** Audio player for the Acoustic Experience section: cold start / exhaust note, waveform in gold on blueprint. */
export interface AcousticTrack {
  label: string;
  duration: string;
  src?: string;
}
export interface AcousticPlayerProps {
  tracks?: AcousticTrack[];
  style?: React.CSSProperties;
}
export declare function AcousticPlayer(props: AcousticPlayerProps): JSX.Element;
