import * as React from 'react';

/** Lucide glyph wrapper. The host page must load Lucide (unpkg.com/lucide@latest). */
export interface IconProps {
  /** Lucide kebab-case name, e.g. "gauge", "arrow-up-right", "volume-2". */
  name: string;
  size?: number;
  color?: string;
  /** Vertex uses 1.5 everywhere — the drafting-pen weight. */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
