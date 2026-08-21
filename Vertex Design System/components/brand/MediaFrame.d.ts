import * as React from 'react';

/** Square-cornered image/video frame with optional protection scrim, overlay content and mono caption. */
export interface MediaFrameProps {
  src?: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9", "3 / 2", "1 / 1". */
  ratio?: string;
  /** Uppercase mono caption beneath the frame. */
  caption?: React.ReactNode;
  /** Content laid over the media, bottom-aligned (tags, titles, play controls). */
  overlay?: React.ReactNode;
  /** Bottom-up protection gradient — required behind any text on imagery. */
  scrim?: boolean;
  /** Text shown in the blueprint placeholder when src is omitted. */
  placeholderLabel?: string;
  style?: React.CSSProperties;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;
