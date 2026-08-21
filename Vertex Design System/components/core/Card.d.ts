import * as React from 'react';

/**
 * Flat panel: graphite fill, 1px blueprint border, zero radius, no shadow.
 * @startingPoint section="Core" subtitle="Graphite panel with blueprint hairline" viewport="700x260"
 */
export interface CardProps {
  children?: React.ReactNode;
  surface?: 'graphite' | 'black' | 'raised' | 'transparent';
  /** Border warms to gold on hover; use for whole-card links. */
  interactive?: boolean;
  padded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
