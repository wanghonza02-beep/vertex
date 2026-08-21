import * as React from 'react';

/** Single-line text field: graphite fill, 1px blueprint border warming to gold on focus, zero radius. */
export interface InputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'search';
  /** Mono helper line beneath the field. */
  help?: string;
  /** Replaces help and turns the border Corsa Red. */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
