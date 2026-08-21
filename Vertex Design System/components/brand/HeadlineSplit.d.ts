import * as React from 'react';

/**
 * The Vertex headline construction: one clause in Italiana (heritage, Paper White),
 * handing off to a second clause in Orbitron 900 (engineering, Champagne Gold).
 * @startingPoint section="Brand" subtitle="Two-font hero headline — soul meets engineering" viewport="700x260"
 */
export interface HeadlineSplitProps {
  /** Heritage clause, sentence case with a full stop. e.g. "Immortal Icons." */
  luxury?: React.ReactNode;
  /** Engineering clause, rendered uppercase. e.g. "Modern Muscle." */
  tech?: React.ReactNode;
  size?: 'hero' | 'display' | 'section';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}
export declare function HeadlineSplit(props: HeadlineSplitProps): JSX.Element;
