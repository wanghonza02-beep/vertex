import * as React from 'react';

/** Gold mono section heading on a full-width blueprint rule, with optional right-aligned meta. */
export interface SectionTitleProps {
  children?: React.ReactNode;
  /** Right-hand counter or note, e.g. "04 builds" or "2019 — 2025". */
  meta?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SectionTitle(props: SectionTitleProps): JSX.Element;
