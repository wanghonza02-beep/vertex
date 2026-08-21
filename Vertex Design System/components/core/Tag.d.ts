import * as React from 'react';

/** Outlined uppercase mono tag for build status, donor rarity and inventory signals. */
export interface TagProps {
  children?: React.ReactNode;
  /** rare = Corsa Red, reserved for 1-of-1 / rare-donor signals. */
  tone?: 'neutral' | 'gold' | 'rare' | 'sold' | 'solid';
  /** Leading status dot. */
  dot?: boolean;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
