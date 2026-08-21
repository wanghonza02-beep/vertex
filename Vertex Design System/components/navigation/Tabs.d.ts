import * as React from 'react';

/** Underlined mono tabs sitting on a blueprint rule — spec sections, gallery filters, archive years. */
export interface TabsProps {
  items?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
