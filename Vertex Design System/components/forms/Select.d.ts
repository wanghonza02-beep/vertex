import * as React from 'react';

/** Native select in Vertex dress — used for donor model, build slot and appointment pickers. */
export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Strings, or { value, label } pairs. */
  options?: Array<string | { value: string; label: string }>;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
