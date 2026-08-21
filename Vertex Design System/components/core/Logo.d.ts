import * as React from 'react';

/** The Vertex mark: two facets meeting at an apex. Lockup, bare mark, or circular badge. */
export interface LogoProps {
  variant?: 'lockup' | 'mark' | 'badge';
  /** Height of the mark in px; the wordmark scales from it. */
  size?: number;
  /** Force a single-colour rendering for embossing, watermarks and dark photography. */
  mono?: 'gold' | 'paper';
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;
