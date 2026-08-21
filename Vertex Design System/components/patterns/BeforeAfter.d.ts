import * as React from 'react';

/**
 * Drag-to-compare slider: rusted donor on the left, finished build on the right.
 * The divider is a 1px gold line with a square drafting handle.
 * @startingPoint section="Patterns" subtitle="Donor → build comparison slider" viewport="700x400"
 */
export interface BeforeAfterProps {
  /** Donor image URL; omitted renders the blueprint placeholder. */
  before?: string;
  /** Finished-build image URL. */
  after?: string;
  beforeLabel?: string;
  afterLabel?: string;
  ratio?: string;
  style?: React.CSSProperties;
}
export declare function BeforeAfter(props: BeforeAfterProps): JSX.Element;
