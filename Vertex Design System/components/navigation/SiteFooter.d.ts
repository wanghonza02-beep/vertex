import * as React from 'react';

/** Site footer: lockup + positioning line, mono link columns, hairline legal strip. */
export interface SiteFooterProps {
  columns?: Array<{ title: string; links: string[] }>;
  note?: string;
  style?: React.CSSProperties;
}
export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
