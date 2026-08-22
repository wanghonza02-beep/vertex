/* Thin wrapper over the Lucide icon set loaded from CDN in index.html — matches
   Vertex Design System components/core/Icon.jsx's substitution (see SKILL.md > Iconography). */
(function () {
  function refresh(root) {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons({ root: root || document }); } catch (e) { /* icons are decorative; fail silent */ }
    }
  }
  window.VertexIcons = { refresh };
})();
