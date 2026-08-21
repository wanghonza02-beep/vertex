import * as React from 'react';

/**
 * Sticky 78px site header: lockup left, mono nav centre, secondary CTA right, blueprint rule beneath.
 * @startingPoint section="Navigation" subtitle="Sticky site header with mono nav" viewport="1280x120"
 */
export interface SiteHeaderProps {
  items?: Array<string | { value: string; label: string }>;
  active?: string;
  onNavigate?: (value: string) => void;
  cta?: string;
  onCta?: () => void;
  /** Blurred translucent variant for use over a hero video. */
  transparent?: boolean;
  style?: React.CSSProperties;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
