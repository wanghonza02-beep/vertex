import * as React from 'react';

/** Paper-white mono tooltip — inverted so it reads as a drafting annotation on a dark drawing. */
export interface TooltipProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
