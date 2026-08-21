import * as React from 'react';

/** Square icon-only control for toolbars, galleries, players and dialog dismissal. */
export interface IconButtonProps {
  /** Lucide icon name, e.g. "arrow-right", "play", "x". */
  name: string;
  /** Accessible label — required, the button has no visible text. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'ghost' | 'solid';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
