import * as React from 'react';

/**
 * Inventory tile for Available Builds and the Legacy Archive: image, project code,
 * status tag, Italiana title, donor line and a two-metric footer.
 * @startingPoint section="Patterns" subtitle="Inventory tile for a finished build" viewport="700x420"
 */
export interface BuildCardProps {
  /** Project designation, e.g. "Project 01 — 1989 Porsche 911". */
  code?: string;
  /** Build name, e.g. "Monaco Edition". */
  title?: string;
  /** Donor description line. */
  donor?: string;
  status?: 'available' | 'rare' | 'sold' | 'building';
  /** Man-hours invested, e.g. "1,247". */
  hours?: string;
  /** Power figure, e.g. "640 hp". */
  power?: string;
  image?: string;
  onSelect?: () => void;
  style?: React.CSSProperties;
}
export declare function BuildCard(props: BuildCardProps): JSX.Element;
