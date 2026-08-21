import * as React from 'react';

/**
 * Vertex's signature element — an oversized JetBrains Mono figure with a thin gold
 * leader line and an uppercase mono caption, styled like a blueprint dimension callout.
 * @startingPoint section="Brand" subtitle="Blueprint dimension callout — the signature element" viewport="700x220"
 */
export interface SpecNumberProps {
  /** The figure itself, e.g. 640, "3.2", 1989. */
  value: string | number;
  /** Short unit set in mono beside the figure, e.g. "hp", "sec". */
  unit?: string;
  /** Uppercase caption beneath, e.g. "Power output". */
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'paper' | 'gold' | 'dim';
  /** Where the gold dimension line sits. 'none' drops it (dense tables only). */
  leader?: 'left' | 'top' | 'none';
  /** Counts from 0 on mount, ~1.2s ease-out — the brand's only number animation. */
  countUp?: boolean;
  style?: React.CSSProperties;
}
export declare function SpecNumber(props: SpecNumberProps): JSX.Element;
