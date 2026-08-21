import * as React from 'react';

/** Single choice. The indicator is a rotated square (a drafting node), never a circle. */
export interface RadioProps {
  label?: React.ReactNode;
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;

export interface RadioGroupProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<string | { value: string; label: string }>;
  layout?: 'stack' | 'row';
  style?: React.CSSProperties;
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
