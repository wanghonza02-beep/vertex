import * as React from 'react';

/** 1px structural rule with optional dimension ticks and a draw-on-scroll stroke animation. */
export interface BlueprintRuleProps {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'structural' | 'faint' | 'gold';
  /** End ticks, as on a technical drawing's dimension line. */
  tick?: boolean;
  /** Draws itself when scrolled into view (900ms). */
  animate?: boolean;
  /** CSS length; defaults to 100% of the cross axis. */
  length?: string;
  style?: React.CSSProperties;
}
export declare function BlueprintRule(props: BlueprintRuleProps): JSX.Element;
