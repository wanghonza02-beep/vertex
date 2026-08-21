import * as React from 'react';

/** Label/value specification list — hairline-ruled rows, mono labels, optional numeric or gold values. */
export interface SpecRow {
  label: string;
  value: React.ReactNode;
  /** Sets the value in JetBrains Mono — use for figures and codes. */
  numeric?: boolean;
  /** Champagne Gold value, for the one headline figure in the table. */
  accent?: boolean;
}
export interface SpecTableProps {
  rows?: SpecRow[];
  /** 1 or 2 column layout. */
  columns?: number;
  style?: React.CSSProperties;
}
export declare function SpecTable(props: SpecTableProps): JSX.Element;
