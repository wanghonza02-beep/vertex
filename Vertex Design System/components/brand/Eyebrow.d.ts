import * as React from 'react';

/** Uppercase mono kicker above a headline — project codes, section numbers, donor designations. */
export interface EyebrowProps {
  children?: React.ReactNode;
  tone?: 'gold' | 'brass' | 'muted';
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
