import * as React from 'react';

/** Multi-line field for commission briefs — "describe the direction you have in mind". */
export interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  help?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
