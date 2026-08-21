import * as React from 'react';

/** Modal panel over a blurred black scrim — appointment confirmation, enquiry sent, gallery detail. */
export interface DialogProps {
  open?: boolean;
  /** Set in Italiana — the only place display type appears inside a UI panel. */
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  /** Action row, right-aligned. */
  footer?: React.ReactNode;
  onClose?: () => void;
  width?: number;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
