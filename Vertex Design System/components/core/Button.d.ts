import * as React from 'react';

/**
 * Vertex action control. Sharp-cornered, uppercase IBM Plex Mono, tracked out.
 * Gold primary is reserved for the single most important action on a screen.
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost and alert actions" viewport="700x200"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** primary = champagne gold fill (one per screen). secondary = blueprint outline. ghost = bare text. alert = Corsa Red outline, rare/limited actions only. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
