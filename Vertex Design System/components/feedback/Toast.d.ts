import * as React from 'react';

/** Transient uppercase mono confirmation. Auto-dismisses after ~4.2s when onDismiss is supplied. */
export interface ToastProps {
  open?: boolean;
  message?: React.ReactNode;
  /** success = gold edge, alert = Corsa Red edge, neutral = blueprint edge. */
  tone?: 'neutral' | 'success' | 'alert';
  /** Lucide icon name. */
  icon?: string;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element | null;
