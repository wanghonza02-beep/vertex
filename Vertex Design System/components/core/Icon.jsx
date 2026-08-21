import React from 'react';

/**
 * Thin wrapper over the Lucide icon set (loaded from CDN by the host page).
 * Vertex ships no icon library of its own; Lucide's 1.5px geometric stroke is the
 * closest match to the blueprint/drafting register. See readme.md > Iconography.
 */
export function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.5, style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const draw = () => { if (window.lucide && ref.current) window.lucide.createIcons({ nameAttr: 'data-lucide', root: ref.current.parentNode }); };
    draw();
    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [name]);
  return (
    <i
      ref={ref} data-lucide={name} aria-hidden="true"
      style={{ display: 'inline-flex', width: size, height: size, color,
        strokeWidth, verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...rest}
    />
  );
}
