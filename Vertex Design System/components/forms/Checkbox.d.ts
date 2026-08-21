import * as React from 'react';

/** Square gold-filled checkbox with a drawn tick. */
export interface CheckboxProps {
  label?: React.ReactNode;
  /** Second line in tertiary paper, for consent detail. */
  description?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
