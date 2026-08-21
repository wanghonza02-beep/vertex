import * as React from 'react';

/** Small filled marker overlaid on imagery or pinned to a card corner. Denser than Tag. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'gold' | 'rare' | 'dark' | 'paper';
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
