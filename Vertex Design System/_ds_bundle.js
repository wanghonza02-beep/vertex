/* @ds-bundle: {"format":4,"namespace":"VertexDesignSystem_24ef46","components":[{"name":"BlueprintRule","sourcePath":"components/brand/BlueprintRule.jsx"},{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"HeadlineSplit","sourcePath":"components/brand/HeadlineSplit.jsx"},{"name":"MediaFrame","sourcePath":"components/brand/MediaFrame.jsx"},{"name":"SectionTitle","sourcePath":"components/brand/SectionTitle.jsx"},{"name":"SpecNumber","sourcePath":"components/brand/SpecNumber.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"AcousticPlayer","sourcePath":"components/patterns/AcousticPlayer.jsx"},{"name":"BeforeAfter","sourcePath":"components/patterns/BeforeAfter.jsx"},{"name":"BuildCard","sourcePath":"components/patterns/BuildCard.jsx"},{"name":"SpecTable","sourcePath":"components/patterns/SpecTable.jsx"}],"sourceHashes":{"components/brand/BlueprintRule.jsx":"d8967a6de4d4","components/brand/Eyebrow.jsx":"31fa6b470aa0","components/brand/HeadlineSplit.jsx":"2aeaa20b07f6","components/brand/MediaFrame.jsx":"5184e10a1186","components/brand/SectionTitle.jsx":"57743f0a155b","components/brand/SpecNumber.jsx":"f934d5da10fe","components/core/Badge.jsx":"9441deb682ba","components/core/Button.jsx":"aa2ac2a3356f","components/core/Card.jsx":"c08584adda26","components/core/Icon.jsx":"60e36e733481","components/core/IconButton.jsx":"2adcf2f7100d","components/core/Logo.jsx":"1b2e6824a820","components/core/Tag.jsx":"a15b5ad234a8","components/feedback/Dialog.jsx":"a4c0f568a36b","components/feedback/Toast.jsx":"e97aed5901f6","components/feedback/Tooltip.jsx":"d82ad6a91abf","components/forms/Checkbox.jsx":"d05467caac0b","components/forms/Input.jsx":"dd167b060c71","components/forms/Radio.jsx":"0326550f1ad8","components/forms/Select.jsx":"52b270db1861","components/forms/Switch.jsx":"5aefb857732c","components/forms/Textarea.jsx":"593ec1da1da8","components/navigation/SiteFooter.jsx":"13d7b392dc51","components/navigation/SiteHeader.jsx":"6697f83cfd77","components/navigation/Tabs.jsx":"b647a0b02c12","components/patterns/AcousticPlayer.jsx":"bb164e80a22f","components/patterns/BeforeAfter.jsx":"4f06220d26ef","components/patterns/BuildCard.jsx":"2a1bbb8935ea","components/patterns/SpecTable.jsx":"f97bb6025cec","ui_kits/website/App.jsx":"fb06b0bacb86","ui_kits/website/Commission.jsx":"c0b4d7f3e46c","ui_kits/website/Homepage.jsx":"37c4fa8d2ddf","ui_kits/website/LegacyArchive.jsx":"03cbe615b8f7","ui_kits/website/Showroom.jsx":"d28188ef0289","ui_kits/website/VehicleDetail.jsx":"69f84bd23759","ui_kits/website/data.js":"9b50b7af848d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VertexDesignSystem_24ef46 = window.VertexDesignSystem_24ef46 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BlueprintRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BlueprintRule({
  orientation = 'horizontal',
  tone = 'structural',
  tick = false,
  animate = false,
  length,
  style,
  ...rest
}) {
  const color = tone === 'gold' ? 'var(--champagne-gold)' : tone === 'faint' ? 'var(--line-faint)' : 'var(--line-structural)';
  const horizontal = orientation === 'horizontal';
  const ref = React.useRef(null);
  const [drawn, setDrawn] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate || !ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, {
      threshold: 0.1
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animate]);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    style: {
      position: 'relative',
      display: horizontal ? 'block' : 'inline-block',
      width: horizontal ? length || '100%' : 1,
      height: horizontal ? 1 : length || '100%',
      overflow: 'visible',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      background: color,
      transformOrigin: horizontal ? 'left center' : 'center top',
      transform: horizontal ? 'scaleX(' + (drawn ? 1 : 0) + ')' : 'scaleY(' + (drawn ? 1 : 0) + ')',
      transition: 'transform var(--duration-draw) var(--ease-draw)'
    }
  }), tick && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: color,
      ...(horizontal ? {
        left: 0,
        top: -4,
        width: 1,
        height: 9
      } : {
        top: 0,
        left: -4,
        height: 1,
        width: 9
      })
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: color,
      ...(horizontal ? {
        right: 0,
        top: -4,
        width: 1,
        height: 9
      } : {
        bottom: 0,
        left: -4,
        height: 1,
        width: 9
      })
    }
  })));
}
Object.assign(__ds_scope, { BlueprintRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BlueprintRule.jsx", error: String((e && e.message) || e) }); }

// components/brand/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  children,
  tone = 'gold',
  as = 'div',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      lineHeight: 'var(--leading-label)',
      color: tone === 'gold' ? 'var(--champagne-gold)' : tone === 'brass' ? 'var(--aged-brass)' : 'var(--paper-muted)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/HeadlineSplit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The two-font headline: a luxury (Italiana) clause handing off to a tech (Orbitron) clause. */
function HeadlineSplit({
  luxury,
  tech,
  size = 'display',
  align = 'left',
  style,
  ...rest
}) {
  const scale = {
    hero: {
      l: 'var(--size-hero-luxury)',
      t: 'var(--size-hero-tech)'
    },
    display: {
      l: 'var(--size-display-luxury)',
      t: 'var(--size-display-tech)'
    },
    section: {
      l: 'var(--size-headline)',
      t: '30px'
    }
  }[size] || {
    l: 'var(--size-display-luxury)',
    t: 'var(--size-display-tech)'
  };
  return /*#__PURE__*/React.createElement("h1", _extends({
    style: {
      margin: 0,
      textAlign: align,
      ...style
    }
  }, rest), luxury && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-luxury)',
      fontWeight: 'var(--weight-luxury)',
      fontSize: scale.l,
      lineHeight: 'var(--leading-display)',
      letterSpacing: 'var(--tracking-luxury)',
      color: 'var(--paper-white)'
    }
  }, luxury), tech && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-tech)',
      fontWeight: 'var(--weight-tech)',
      fontSize: scale.t,
      lineHeight: 'var(--leading-tech)',
      letterSpacing: 'var(--tracking-tech)',
      textTransform: 'uppercase',
      color: 'var(--champagne-gold)',
      marginTop: 'var(--space-2)'
    }
  }, tech));
}
Object.assign(__ds_scope, { HeadlineSplit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/HeadlineSplit.jsx", error: String((e && e.message) || e) }); }

// components/brand/MediaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Image/video container. Vertex photography is full-bleed, cool-shadowed and never rounded.
 * With no src it renders a blueprint placeholder with crosshair registration marks.
 */
function MediaFrame({
  src,
  alt = '',
  ratio = '16 / 9',
  caption,
  overlay,
  scrim = false,
  placeholderLabel = 'Photography',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      overflow: 'hidden',
      background: src ? 'var(--graphite)' : 'var(--surface-page)',
      border: '1px solid var(--line-structural)'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grid-blueprint)',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: 1,
      background: 'rgba(46,59,71,0.7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: 1,
      background: 'rgba(46,59,71,0.7)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-dim)',
      background: 'var(--surface-page)',
      padding: '6px 12px',
      border: '1px solid var(--line-faint)'
    }
  }, placeholderLabel)), scrim && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-bottom)',
      pointerEvents: 'none'
    }
  }), overlay && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: 'var(--space-6)'
    }
  }, overlay)), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)',
      marginTop: 'var(--space-3)'
    }
  }, caption));
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionTitle({
  children,
  meta,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-6)',
      borderBottom: 'var(--border-rule)',
      paddingBottom: 'var(--space-4)',
      margin: '0 0 var(--space-6)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-mono)',
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--champagne-gold)'
    }
  }, children), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)'
    }
  }, meta));
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/brand/SpecNumber.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The signature Vertex element: an oversized spec number drawn as a dimension callout. */
function SpecNumber({
  value,
  unit,
  label,
  size = 'md',
  tone = 'paper',
  leader = 'left',
  countUp = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: 'var(--size-spec-sm)',
    md: 'var(--size-spec)',
    lg: 'var(--size-spec-lg)',
    xl: 'var(--size-spec-xl)'
  };
  const [shown, setShown] = React.useState(countUp ? 0 : null);
  React.useEffect(() => {
    if (!countUp) return;
    const target = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (!isFinite(target)) return;
    const decimals = (String(value).split('.')[1] || '').length;
    const start = performance.now(),
      dur = 1200;
    let raf;
    const tick = t => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, countUp]);
  const display = countUp && shown !== null ? shown : value;
  const vertical = leader === 'left';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      paddingLeft: vertical ? 'var(--space-6)' : 0,
      paddingTop: leader === 'top' ? 'var(--space-4)' : 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: 'var(--champagne-gold)',
      ...(vertical ? {
        left: 0,
        top: 6,
        bottom: 6,
        width: 1
      } : leader === 'top' ? {
        left: 0,
        right: 0,
        top: 0,
        height: 1
      } : {
        display: 'none'
      })
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-numeric)',
      fontSize: sizes[size] || sizes.md,
      letterSpacing: 'var(--tracking-numeric)',
      lineHeight: 'var(--leading-numeric)',
      color: tone === 'gold' ? 'var(--champagne-gold)' : tone === 'dim' ? 'var(--paper-dim)' : 'var(--paper-white)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, display), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--aged-brass)'
    }
  }, unit)), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      fontWeight: 'var(--weight-mono)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)',
      marginTop: 'var(--space-2)'
    }
  }, label));
}
Object.assign(__ds_scope, { SpecNumber });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SpecNumber.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  children,
  tone = 'gold',
  style,
  ...rest
}) {
  const tones = {
    gold: {
      color: 'var(--vertex-black)',
      background: 'var(--champagne-gold)'
    },
    rare: {
      color: 'var(--paper-white)',
      background: 'var(--corsa-red)'
    },
    dark: {
      color: 'var(--paper-white)',
      background: 'var(--graphite)'
    },
    paper: {
      color: 'var(--vertex-black)',
      background: 'var(--paper-white)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      fontWeight: 'var(--weight-body-semi)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      padding: '5px 9px',
      borderRadius: 'var(--radius-none)',
      lineHeight: 1,
      ...(tones[tone] || tones.gold),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  fontFamily: 'var(--font-mono)',
  fontWeight: 'var(--weight-mono)',
  letterSpacing: 'var(--tracking-cta)',
  textTransform: 'uppercase',
  borderRadius: 'var(--radius-none)',
  cursor: 'pointer',
  transition: 'var(--transition-control)',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  border: '1px solid transparent',
  background: 'none'
};
const sizes = {
  sm: {
    fontSize: 'var(--size-label-sm)',
    padding: '10px 18px',
    minHeight: 'var(--control-height-sm)'
  },
  md: {
    fontSize: 'var(--size-label)',
    padding: 'var(--control-pad-y) var(--control-pad-x)',
    minHeight: 'var(--control-height)'
  },
  lg: {
    fontSize: 'var(--size-body-sm)',
    padding: '18px 40px',
    minHeight: '58px'
  }
};
function variantStyle(variant, hovered, active) {
  switch (variant) {
    case 'secondary':
      return {
        color: hovered ? 'var(--champagne-gold)' : 'var(--action-secondary-fg)',
        borderColor: hovered ? 'var(--action-secondary-line-hover)' : 'var(--action-secondary-line)',
        background: active ? 'var(--gold-wash)' : 'transparent'
      };
    case 'ghost':
      return {
        color: hovered ? 'var(--paper-white)' : 'var(--action-ghost-fg)',
        borderColor: 'transparent',
        background: 'transparent',
        paddingLeft: 0,
        paddingRight: 0
      };
    case 'alert':
      return {
        color: hovered ? 'var(--paper-white)' : 'var(--corsa-red)',
        borderColor: 'var(--corsa-red)',
        background: hovered ? 'var(--corsa-red)' : 'transparent'
      };
    default:
      return {
        color: 'var(--action-primary-fg)',
        background: hovered ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)',
        borderColor: hovered ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)'
      };
  }
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  href,
  iconLeft,
  iconRight,
  fullWidth = false,
  onClick,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const disabledStyle = {
    color: 'var(--action-disabled-fg)',
    background: variant === 'primary' ? 'var(--action-disabled-bg)' : 'transparent',
    borderColor: variant === 'primary' ? 'var(--action-disabled-bg)' : 'var(--line-faint)',
    cursor: 'not-allowed'
  };
  const composed = {
    ...base,
    ...(sizes[size] || sizes.md),
    ...(disabled ? disabledStyle : variantStyle(variant, hovered, active)),
    width: fullWidth ? '100%' : undefined,
    transform: active && !disabled ? 'translateY(1px)' : 'none',
    ...style
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: composed,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onClick: disabled ? undefined : onClick
  }, rest), iconLeft, /*#__PURE__*/React.createElement("span", null, children), iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  surface = 'graphite',
  interactive = false,
  padded = true,
  onClick,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const surfaces = {
    graphite: 'var(--surface-card)',
    black: 'var(--surface-page)',
    raised: 'var(--surface-raised)',
    transparent: 'transparent'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      background: surfaces[surface] || surfaces.graphite,
      border: '1px solid ' + (interactive && hovered ? 'var(--champagne-gold)' : 'var(--line-structural)'),
      borderRadius: 'var(--radius-none)',
      padding: padded ? 'var(--card-pad)' : 0,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'border-color var(--duration-base) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Thin wrapper over the Lucide icon set (loaded from CDN by the host page).
 * Vertex ships no icon library of its own; Lucide's 1.5px geometric stroke is the
 * closest match to the blueprint/drafting register. See readme.md > Iconography.
 */
function Icon({
  name,
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.5,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const draw = () => {
      if (window.lucide && ref.current) window.lucide.createIcons({
        nameAttr: 'data-lucide',
        root: ref.current.parentNode
      });
    };
    draw();
    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [name]);
  return /*#__PURE__*/React.createElement("i", _extends({
    ref: ref,
    "data-lucide": name,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color,
      strokeWidth,
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  name,
  label,
  size = 'md',
  variant = 'outline',
  onClick,
  disabled = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const box = size === 'sm' ? 34 : size === 'lg' ? 56 : 44;
  const glyph = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const outline = variant === 'outline';
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      width: box,
      height: box,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-none)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: variant === 'solid' ? hovered ? 'var(--aged-brass)' : 'var(--champagne-gold)' : 'transparent',
      border: outline ? '1px solid ' + (hovered ? 'var(--champagne-gold)' : 'var(--line-structural)') : '1px solid transparent',
      color: disabled ? 'var(--action-disabled-fg)' : variant === 'solid' ? 'var(--vertex-black)' : hovered ? 'var(--champagne-gold)' : 'var(--paper-muted)',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: glyph
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MARK = (goldFill, paperFill) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
  points: "50,8 92,88 54,88 50,52",
  fill: goldFill
}), /*#__PURE__*/React.createElement("polygon", {
  points: "50,8 8,88 46,88 50,52",
  fill: paperFill
}));
function Logo({
  variant = 'lockup',
  size = 40,
  mono,
  style,
  ...rest
}) {
  const gold = mono === 'gold' ? 'var(--champagne-gold)' : mono === 'paper' ? 'var(--paper-white)' : 'var(--champagne-gold)';
  const paper = mono === 'gold' ? 'rgba(201,166,107,0.55)' : mono === 'paper' ? 'rgba(237,232,221,0.55)' : 'var(--paper-white)';
  const mark = /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    role: "img",
    "aria-label": "Vertex",
    style: {
      display: 'block'
    }
  }, MARK(gold, paper));
  if (variant === 'mark') return /*#__PURE__*/React.createElement("span", _extends({
    style: style
  }, rest), mark);
  if (variant === 'badge') {
    const box = size * 2.6;
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        width: box,
        height: box,
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--champagne-gold)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 100 100",
      width: size,
      height: size,
      role: "img",
      "aria-label": "Vertex"
    }, MARK(gold, paper)));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.55,
      ...style
    }
  }, rest), mark, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-luxury)',
      fontWeight: 'var(--weight-luxury)',
      fontSize: size * 0.9,
      letterSpacing: 'var(--tracking-wordmark)',
      color: mono === 'gold' ? 'var(--champagne-gold)' : 'var(--paper-white)',
      lineHeight: 1
    }
  }, "VERTEX"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  tone = 'neutral',
  dot = false,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      color: 'var(--paper-muted)',
      borderColor: 'var(--line-structural)',
      background: 'transparent'
    },
    gold: {
      color: 'var(--champagne-gold)',
      borderColor: 'var(--champagne-gold)',
      background: 'transparent'
    },
    rare: {
      color: 'var(--corsa-red)',
      borderColor: 'var(--corsa-red)',
      background: 'transparent'
    },
    sold: {
      color: 'var(--paper-dim)',
      borderColor: 'var(--line-faint)',
      background: 'transparent'
    },
    solid: {
      color: 'var(--vertex-black)',
      borderColor: 'var(--champagne-gold)',
      background: 'var(--champagne-gold)'
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      fontWeight: 'var(--weight-mono)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      padding: '9px 14px',
      border: '1px solid',
      borderRadius: 'var(--radius-none)',
      ...t,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  eyebrow,
  children,
  footer,
  onClose,
  width = 560
}) {
  React.useEffect(() => {
    if (!open) return;
    const esc = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'var(--surface-scrim)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      border: '1px solid var(--line-structural)',
      boxShadow: 'var(--shadow-overlay)',
      borderRadius: 'var(--radius-none)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-6)',
      padding: 'var(--space-8) var(--space-8) var(--space-6)',
      borderBottom: 'var(--border-faint)'
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--champagne-gold)',
      marginBottom: 'var(--space-3)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-luxury)',
      fontWeight: 'var(--weight-luxury)',
      fontSize: 'var(--size-title)',
      color: 'var(--paper-white)',
      lineHeight: 'var(--leading-title)'
    }
  }, title)), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "x",
    label: "Close",
    variant: "ghost",
    size: "sm",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-8)',
      font: 'var(--type-body)',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) var(--space-8)',
      borderTop: 'var(--border-faint)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-3)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  open = true,
  message,
  tone = 'neutral',
  icon,
  onDismiss,
  style
}) {
  React.useEffect(() => {
    if (!open || !onDismiss) return;
    const t = setTimeout(onDismiss, 4200);
    return () => clearTimeout(t);
  }, [open, onDismiss]);
  if (!open) return null;
  const accent = tone === 'alert' ? 'var(--corsa-red)' : tone === 'success' ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--line-structural)',
      borderLeft: '2px solid ' + accent,
      padding: 'var(--space-4) var(--space-5)',
      boxShadow: 'var(--shadow-lift)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    color: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--paper-white)'
    }
  }, message), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 0,
      color: 'var(--paper-dim)',
      cursor: 'pointer',
      marginLeft: 'var(--space-3)',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  placement = 'top',
  style
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    right: {
      left: 'calc(100% + 8px)',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    left: {
      right: 'calc(100% + 8px)',
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 60,
      whiteSpace: 'nowrap',
      background: 'var(--paper-white)',
      color: 'var(--vertex-black)',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      padding: '6px 10px',
      pointerEvents: 'none'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      marginTop: 2,
      border: '1px solid ' + (checked ? 'var(--champagne-gold)' : hovered ? 'var(--aged-brass)' : 'var(--line-structural)'),
      background: checked ? 'var(--champagne-gold)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-control)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 5,
      borderLeft: '1.5px solid var(--vertex-black)',
      borderBottom: '1.5px solid var(--vertex-black)',
      transform: 'rotate(-45deg) translate(1px,-1px)'
    }
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--paper-white)',
      lineHeight: 1.45
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontWeight: 'var(--weight-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--text-label)',
  marginBottom: 'var(--space-3)'
};
const helpStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: '0.06em',
  marginTop: 'var(--space-2)'
};
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  help,
  error,
  disabled = false,
  required = false,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'vx-input';
  const fieldId = id || autoId;
  const line = error ? 'var(--corsa-red)' : focused ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: labelStyle
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--champagne-gold)'
    }
  }, " *")), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      height: 'var(--control-height)',
      padding: '0 var(--space-4)',
      background: disabled ? 'transparent' : 'var(--surface-card)',
      border: '1px solid ' + line,
      borderRadius: 'var(--radius-none)',
      color: disabled ? 'var(--text-disabled)' : 'var(--paper-white)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body)',
      outline: 'none',
      transition: 'var(--transition-control)'
    }
  }, rest)), (help || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      ...helpStyle,
      color: error ? 'var(--corsa-red)' : 'var(--text-tertiary)'
    }
  }, error || help));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  layout = 'stack',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)',
      marginBottom: 'var(--space-3)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: layout === 'row' ? 'row' : 'column',
      gap: layout === 'row' ? 'var(--space-6)' : 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement(Radio, {
      key: val,
      name: name,
      label: lab,
      checked: value === val,
      onChange: () => onChange && onChange(val)
    });
  })));
}
function Radio({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flexShrink: 0,
      transform: 'rotate(45deg)',
      border: '1px solid ' + (checked ? 'var(--champagne-gold)' : 'var(--line-structural)'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-control)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      background: 'var(--champagne-gold)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--paper-white)'
    }
  }, label));
}
Object.assign(__ds_scope, { RadioGroup, Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontWeight: 'var(--weight-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--text-label)',
  marginBottom: 'var(--space-3)'
};
const helpStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: '0.06em',
  marginTop: 'var(--space-2)'
};
function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  help,
  error,
  disabled = false,
  required = false,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'vx-select';
  const fieldId = id || autoId;
  const line = error ? 'var(--corsa-red)' : focused ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: labelStyle
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--champagne-gold)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      height: 'var(--control-height)',
      padding: '0 var(--space-10) 0 var(--space-4)',
      background: 'var(--surface-card)',
      border: '1px solid ' + line,
      borderRadius: 'var(--radius-none)',
      color: value ? 'var(--paper-white)' : 'var(--text-tertiary)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body)',
      appearance: 'none',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-control)'
    }
  }, rest), /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val,
      style: {
        background: 'var(--graphite)'
      }
    }, lab);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 'var(--space-4)',
      top: '50%',
      width: 7,
      height: 7,
      borderRight: '1px solid var(--champagne-gold)',
      borderBottom: '1px solid var(--champagne-gold)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })), (help || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      ...helpStyle,
      color: error ? 'var(--corsa-red)' : 'var(--text-tertiary)'
    }
  }, error || help));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 20,
      flexShrink: 0,
      position: 'relative',
      border: '1px solid ' + (checked ? 'var(--champagne-gold)' : 'var(--line-structural)'),
      background: checked ? 'var(--gold-wash)' : 'transparent',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 24 : 2,
      width: 16,
      height: 14,
      background: checked ? 'var(--champagne-gold)' : 'var(--paper-dim)',
      transition: 'left var(--duration-base) var(--ease-out-technical), background-color var(--duration-fast) var(--ease-standard)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: checked ? 'var(--paper-white)' : 'var(--paper-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontWeight: 'var(--weight-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--text-label)',
  marginBottom: 'var(--space-3)'
};
const helpStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--size-label-sm)',
  letterSpacing: '0.06em',
  marginTop: 'var(--space-2)'
};
function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  help,
  error,
  disabled = false,
  required = false,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'vx-textarea';
  const fieldId = id || autoId;
  const line = error ? 'var(--corsa-red)' : focused ? 'var(--champagne-gold)' : 'var(--line-structural)';
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: labelStyle
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--champagne-gold)'
    }
  }, " *")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      padding: 'var(--space-4)',
      background: 'var(--surface-card)',
      border: '1px solid ' + line,
      borderRadius: 'var(--radius-none)',
      color: 'var(--paper-white)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body)',
      lineHeight: 'var(--leading-body)',
      outline: 'none',
      resize: 'vertical',
      transition: 'var(--transition-control)'
    }
  }, rest)), (help || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      ...helpStyle,
      color: error ? 'var(--corsa-red)' : 'var(--text-tertiary)'
    }
  }, error || help));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function SiteFooter({
  columns = [],
  note = '© Vertex. All builds one of one.',
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: 'var(--border-rule)',
      padding: 'var(--space-16) var(--gutter-page) var(--space-10)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-20)',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "lockup",
    size: 24
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--text-tertiary)',
      marginTop: 'var(--space-5)'
    }
  }, "Iconic chassis, rebuilt at the point where character meets engineering.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      flexWrap: 'wrap'
    }
  }, columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)',
      marginBottom: 'var(--space-4)'
    }
  }, col.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--paper-muted)'
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--border-faint)',
      marginTop: 'var(--space-12)',
      paddingTop: 'var(--space-6)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-dim)'
    }
  }, note));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function SiteHeader({
  items = [],
  active,
  onNavigate,
  cta = 'Request a build slot',
  onCta,
  transparent = false,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-10)',
      padding: '0 var(--gutter-page)',
      height: 78,
      background: transparent ? 'rgba(11,12,14,0.55)' : 'var(--surface-page)',
      backdropFilter: transparent ? 'blur(14px)' : undefined,
      borderBottom: 'var(--border-rule)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0] && (items[0].value || items[0]));
    },
    style: {
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "lockup",
    size: 22
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, items.map(it => {
    const val = typeof it === 'string' ? it : it.value;
    const lab = typeof it === 'string' ? it : it.label;
    const on = active === val;
    return /*#__PURE__*/React.createElement("a", {
      key: val,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(val);
      },
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--size-label-sm)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: on ? 'var(--champagne-gold)' : 'var(--paper-muted)',
        borderBottom: '1px solid ' + (on ? 'var(--champagne-gold)' : 'transparent'),
        paddingBottom: 3
      }
    }, lab);
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "secondary",
    onClick: onCta
  }, cta));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      borderBottom: 'var(--border-rule)',
      ...style
    }
  }, items.map(it => {
    const val = typeof it === 'string' ? it : it.value;
    const lab = typeof it === 'string' ? it : it.label;
    const active = value === val;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(val),
      style: {
        background: 'none',
        border: 0,
        borderBottom: '1px solid ' + (active ? 'var(--champagne-gold)' : 'transparent'),
        padding: '0 0 var(--space-4)',
        marginBottom: -1,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--weight-mono)',
        fontSize: 'var(--size-label-sm)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: active ? 'var(--champagne-gold)' : 'var(--paper-muted)',
        transition: 'var(--transition-control)'
      }
    }, lab);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/patterns/AcousticPlayer.jsx
try { (() => {
/** "Acoustic Experience" player — cold start and exhaust note, drawn as a waveform readout. */
function AcousticPlayer({
  tracks = [],
  style
}) {
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress(p => p >= 100 ? (setPlaying(false), 0) : p + 0.8), 40);
    return () => clearInterval(id);
  }, [playing]);
  const bars = React.useMemo(() => Array.from({
    length: 68
  }, (_, i) => 18 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 46), []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-structural)',
      background: 'var(--surface-card)',
      padding: 'var(--card-pad)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      marginBottom: 'var(--space-6)'
    }
  }, tracks.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.label,
    onClick: () => {
      setActive(i);
      setProgress(0);
      setPlaying(true);
    },
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: i === active ? 'var(--champagne-gold)' : 'var(--paper-dim)',
      borderBottom: '1px solid ' + (i === active ? 'var(--champagne-gold)' : 'transparent'),
      paddingBottom: 3
    }
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPlaying(p => !p),
    "aria-label": playing ? 'Pause' : 'Play',
    style: {
      width: 48,
      height: 48,
      flexShrink: 0,
      background: 'var(--champagne-gold)',
      border: 0,
      color: 'var(--vertex-black)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: playing ? 'pause' : 'play',
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: 64,
      flex: 1
    }
  }, bars.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: h + '%',
      background: i / bars.length * 100 <= progress ? 'var(--champagne-gold)' : 'var(--blueprint-line)',
      transition: 'background-color 80ms linear'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-numeric)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--paper-muted)',
      minWidth: 44,
      textAlign: 'right'
    }
  }, tracks[active] ? tracks[active].duration : '0:00')));
}
Object.assign(__ds_scope, { AcousticPlayer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/AcousticPlayer.jsx", error: String((e && e.message) || e) }); }

// components/patterns/BeforeAfter.jsx
try { (() => {
/** Interactive donor → finished-build comparison slider. */
function BeforeAfter({
  before,
  after,
  beforeLabel = 'Donor',
  afterLabel = 'Vertex build',
  ratio = '16 / 9',
  style
}) {
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef(null);
  const drag = React.useRef(false);
  const move = clientX => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100)));
  };
  React.useEffect(() => {
    const up = () => {
      drag.current = false;
    };
    const mv = e => {
      if (drag.current) move(e.clientX ?? (e.touches && e.touches[0].clientX));
    };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', mv);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointermove', mv);
    };
  }, []);
  const Panel = ({
    src,
    label,
    placeholder
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface-page)',
      backgroundImage: src ? 'url(' + src + ')' : 'var(--grid-blueprint)',
      backgroundSize: src ? 'cover' : 'auto',
      backgroundPosition: 'center'
    }
  }, !src && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-dim)'
    }
  }, placeholder));
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: e => {
      drag.current = true;
      move(e.clientX);
    },
    style: {
      position: 'relative',
      aspectRatio: ratio,
      overflow: 'hidden',
      border: '1px solid var(--line-structural)',
      cursor: 'ew-resize',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    src: after,
    placeholder: "Finished build"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: 'inset(0 ' + (100 - pos) + '% 0 0)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    src: before,
    placeholder: "Donor chassis"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: pos + '%',
      width: 1,
      background: 'var(--champagne-gold)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 30,
      height: 30,
      border: '1px solid var(--champagne-gold)',
      background: 'var(--surface-scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 10,
      background: 'var(--champagne-gold)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 10,
      background: 'var(--champagne-gold)'
    }
  }))), /*#__PURE__*/React.createElement(Label, {
    side: "left"
  }, beforeLabel), /*#__PURE__*/React.createElement(Label, {
    side: "right"
  }, afterLabel));
}
function Label({
  side,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 'var(--space-4)',
      [side]: 'var(--space-4)',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-white)',
      background: 'rgba(11,12,14,0.7)',
      border: '1px solid var(--line-structural)',
      padding: '5px 9px'
    }
  }, children);
}
Object.assign(__ds_scope, { BeforeAfter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/BeforeAfter.jsx", error: String((e && e.message) || e) }); }

// components/patterns/BuildCard.jsx
try { (() => {
function BuildCard({
  code,
  title,
  donor,
  status = 'available',
  hours,
  power,
  image,
  onSelect,
  style
}) {
  const [hovered, setHovered] = React.useState(false);
  const statusTag = {
    available: /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      tone: "gold"
    }, "Available"),
    rare: /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      tone: "rare",
      dot: true
    }, "1 of 1 \u2014 rare donor"),
    sold: /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      tone: "sold"
    }, "Sold"),
    building: /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      tone: "neutral",
      dot: true
    }, "In build")
  }[status];
  return /*#__PURE__*/React.createElement("article", {
    onClick: onSelect,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      border: '1px solid ' + (hovered ? 'var(--champagne-gold)' : 'var(--line-structural)'),
      background: 'var(--surface-card)',
      cursor: onSelect ? 'pointer' : 'default',
      transition: 'border-color var(--duration-base) var(--ease-standard)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MediaFrame, {
    src: image,
    ratio: "3 / 2",
    placeholderLabel: code,
    style: {
      margin: '-1px -1px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--card-pad)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    tone: "brass"
  }, code), statusTag), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 'var(--space-4) 0 var(--space-2)',
      fontFamily: 'var(--font-luxury)',
      fontWeight: 'var(--weight-luxury)',
      fontSize: 'var(--size-title)',
      lineHeight: 'var(--leading-title)',
      color: hovered ? 'var(--champagne-gold)' : 'var(--paper-white)',
      transition: 'var(--transition-control)'
    }
  }, title), donor && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--text-tertiary)'
    }
  }, donor), (hours || power) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-6)',
      paddingTop: 'var(--space-5)',
      borderTop: 'var(--border-faint)'
    }
  }, power && /*#__PURE__*/React.createElement(Metric, {
    value: power,
    label: "Power"
  }), hours && /*#__PURE__*/React.createElement(Metric, {
    value: hours,
    label: "Hours"
  }))));
}
function Metric({
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-numeric)',
      fontSize: 'var(--size-body-lg)',
      letterSpacing: 'var(--tracking-numeric)',
      color: 'var(--paper-white)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)',
      marginTop: 3
    }
  }, label));
}
Object.assign(__ds_scope, { BuildCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/BuildCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SpecTable.jsx
try { (() => {
function SpecTable({
  rows = [],
  columns = 1,
  style
}) {
  return /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(' + columns + ', minmax(0,1fr))',
      columnGap: 'var(--space-16)',
      borderTop: 'var(--border-rule)',
      ...style
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.label,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 'var(--space-6)',
      padding: 'var(--space-4) 0',
      borderBottom: 'var(--border-faint)'
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)'
    }
  }, r.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      textAlign: 'right',
      fontFamily: r.numeric ? 'var(--font-numeric)' : 'var(--font-body)',
      fontWeight: r.numeric ? 'var(--weight-numeric)' : 'var(--weight-body)',
      fontSize: 'var(--size-body-sm)',
      color: r.accent ? 'var(--champagne-gold)' : 'var(--paper-white)',
      letterSpacing: r.numeric ? 'var(--tracking-numeric)' : 0
    }
  }, r.value))));
}
Object.assign(__ds_scope, { SpecTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SpecTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
const {
  Homepage,
  VehicleDetail,
  LegacyArchive,
  Commission,
  Showroom
} = window;
function App() {
  const data = window.VERTEX_DATA;
  const [page, setPage] = React.useState('home');
  const [build, setBuild] = React.useState(null);
  const openBuild = b => {
    setBuild(b);
    setPage('build');
    window.scrollTo(0, 0);
  };
  const go = p => {
    setPage(p);
    window.scrollTo(0, 0);
  };
  const nav = [{
    value: 'home',
    label: 'Home'
  }, {
    value: 'archive',
    label: 'Legacy archive'
  }, {
    value: 'commission',
    label: 'Commission'
  }, {
    value: 'showroom',
    label: 'Showroom'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto',
      borderLeft: 'var(--border-rule)',
      borderRight: 'var(--border-rule)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    items: nav,
    active: page === 'build' ? 'home' : page,
    onNavigate: go,
    transparent: page === 'home',
    onCta: () => go('commission')
  }), page === 'home' && /*#__PURE__*/React.createElement(Homepage, {
    builds: data.builds,
    onSelect: openBuild,
    onNavigate: go
  }), page === 'build' && build && /*#__PURE__*/React.createElement(VehicleDetail, {
    build: build,
    onBack: () => go('home')
  }), page === 'archive' && /*#__PURE__*/React.createElement(LegacyArchive, {
    builds: data.builds,
    onSelect: openBuild
  }), page === 'commission' && /*#__PURE__*/React.createElement(Commission, null), page === 'showroom' && /*#__PURE__*/React.createElement(Showroom, null), /*#__PURE__*/React.createElement(SiteFooter, {
    columns: data.footer
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
setTimeout(() => window.lucide && window.lucide.createIcons(), 150);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Commission.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
function Commission() {
  const [donor, setDonor] = React.useState('');
  const [kind, setKind] = React.useState('Commission');
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const submit = () => {
    if (!email.includes('@')) {
      setError('Enter a valid address.');
      return;
    }
    setError('');
    setSent(true);
    setToast(true);
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-wide) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
      gap: 'var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Commission"), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "display",
    luxury: "One chassis.",
    tech: "One owner.",
    style: {
      margin: 'var(--space-5) 0 var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-text)',
      margin: '0 0 var(--space-12)'
    }
  }, "Select a base donor and describe the direction you have in mind. A commission takes 14 to 20 months from sourcing to delivery."), /*#__PURE__*/React.createElement(BlueprintRule, {
    tick: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-12)',
      marginTop: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(SpecNumber, {
    value: 2,
    label: "Slots remaining, 2026",
    tone: "gold"
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: "14\u201320",
    unit: "mo",
    label: "Build duration"
  }))), /*#__PURE__*/React.createElement(Card, {
    surface: "graphite",
    style: {
      padding: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    label: "Enquiry type",
    name: "kind",
    value: kind,
    onChange: setKind,
    layout: "row",
    options: ['Available build', 'Commission', 'Private viewing']
  }), /*#__PURE__*/React.createElement(BlueprintRule, {
    tone: "faint"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    required: true,
    placeholder: "Your name"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    required: true,
    value: email,
    error: error,
    onChange: e => setEmail(e.target.value),
    placeholder: "name@domain.com"
  })), /*#__PURE__*/React.createElement(Select, {
    label: "Base donor",
    value: donor,
    onChange: e => setDonor(e.target.value),
    options: ['Porsche 911 (964)', 'Porsche 911 Targa (964)', 'Mercedes-Benz 280 SL', 'Lamborghini Jalpa', 'Sourcing advice required']
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Aesthetic direction",
    rows: 4,
    placeholder: "Paint, leather, stitching, exhaust character, intended use\u2026"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Add me to the build-slot register",
    description: "Two emails a year, when a slot or finished build becomes available.",
    checked: consent,
    onChange: setConsent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-dim)'
    }
  }, "Response within 2 working days"), /*#__PURE__*/React.createElement(Button, {
    onClick: submit
  }, "Request a build slot"))))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 'var(--space-8)',
      left: 'var(--space-8)',
      zIndex: 80
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success",
    icon: "check",
    message: "Enquiry sent",
    onDismiss: () => setToast(false)
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: sent,
    eyebrow: "Build slot",
    title: "Your request is registered.",
    onClose: () => setSent(false),
    footer: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => setSent(false)
    }, "Close")
  }, "A member of the studio will be in contact within two working days to discuss donor availability and the 2026 queue."));
}
Object.assign(window, {
  Commission
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Commission.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Homepage.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
function Hero({
  onView,
  onCommission
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 620,
      display: 'flex',
      alignItems: 'center',
      borderBottom: 'var(--border-rule)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--grid-blueprint)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-left)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '0 var(--gutter-page-wide)',
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Vertex \u2014 Restomod atelier"), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "hero",
    luxury: "Immortal Icons.",
    tech: "Modern Muscle.",
    style: {
      margin: 'var(--space-6) 0 var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      fontSize: 'var(--size-subtitle)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-text)',
      margin: '0 0 var(--space-10)'
    }
  }, "We do not build cars. We resurrect legends \u2014 the most iconic chassis in automotive history, rebuilt at the exact point where character meets engineering."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onView
  }, "View the build"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onCommission,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Request a build slot"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 'var(--gutter-page-wide)',
      bottom: 'var(--space-10)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 44,
      background: 'var(--corsa-red)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--corsa-red)'
    }
  }, "Scroll")));
}
function Philosophy() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-24) var(--gutter-page-wide)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)',
      gap: 'var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: "Since 2019"
  }, "Why we exist"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-body)',
      margin: '0 0 var(--space-6)'
    }
  }, "Perfection isn't found in the newest technology, and it isn't found in old-world nostalgia either \u2014 it's found at the vertex, the point where both meet."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-body)',
      margin: 0
    }
  }, "Modern hypercars have become sterile and digitalized. Even a limited-run supercar is still one of hundreds of nearly identical VINs. The icons of the past carry raw soul and timeless design, but are held back by outdated performance. We don't take that soul away. We elevate it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-12) var(--space-16)',
      alignContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(SpecNumber, {
    value: "1,000",
    unit: "hrs",
    label: "Minimum per build",
    tone: "gold",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 4,
    label: "Builds delivered",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 1,
    unit: "of 1",
    label: "Every commission"
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 2,
    label: "Slots remaining, 2026"
  }))));
}
function Inventory({
  builds,
  onSelect
}) {
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const shown = availableOnly ? builds.filter(b => b.status !== 'sold') : builds;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-24) var(--gutter-page-wide)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: shown.length + ' builds'
  }, "Available builds"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Available only",
    checked: availableOnly,
    onChange: setAvailableOnly
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
      gap: 'var(--space-8)'
    }
  }, shown.map(b => /*#__PURE__*/React.createElement(BuildCard, {
    key: b.id,
    code: b.code + ' — ' + b.year + ' ' + b.donorName,
    title: b.title,
    donor: b.donor,
    status: b.status,
    power: b.power,
    hours: b.hours,
    onSelect: () => onSelect(b)
  }))));
}
function ArchiveTeaser({
  onArchive
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-24) var(--gutter-page-wide)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-16)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "brass"
  }, "The legacy archive"), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "section",
    luxury: "Every build, on record.",
    style: {
      margin: 'var(--space-5) 0 var(--space-6)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-body)',
      margin: '0 0 var(--space-8)'
    }
  }, "Total man-hours, donor provenance and historical backstory for every car that has left the studio."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onArchive,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 14
    })
  }, "Enter the archive")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(SpecNumber, {
    value: "4,603",
    label: "Hours invested",
    size: "lg",
    tone: "gold",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 7,
    label: "Donors sourced",
    size: "lg",
    countUp: true
  })));
}
function Homepage({
  builds,
  onSelect,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    onView: () => onSelect(builds[0]),
    onCommission: () => onNavigate('commission')
  }), /*#__PURE__*/React.createElement(Philosophy, null), /*#__PURE__*/React.createElement(Inventory, {
    builds: builds,
    onSelect: onSelect
  }), /*#__PURE__*/React.createElement(ArchiveTeaser, {
    onArchive: () => onNavigate('archive')
  }));
}
Object.assign(window, {
  Homepage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Homepage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LegacyArchive.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
function LegacyArchive({
  builds,
  onSelect
}) {
  const [year, setYear] = React.useState('All');
  const years = ['All', '2024', '2023', '2022'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-wide) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "brass"
  }, "The legacy archive"), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "display",
    luxury: "Proof, not promise.",
    tech: "Every hour logged.",
    style: {
      margin: 'var(--space-5) 0 var(--space-10)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      paddingBottom: 'var(--space-12)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement(SpecNumber, {
    value: "4,603",
    label: "Total hours invested",
    size: "lg",
    tone: "gold",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 7,
    label: "Donors sourced",
    size: "lg",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: 4,
    label: "Builds delivered",
    size: "lg",
    countUp: true
  })), /*#__PURE__*/React.createElement(Tabs, {
    items: years,
    value: year,
    onChange: setYear,
    style: {
      margin: 'var(--space-10) 0 var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--border-rule)'
    }
  }, builds.map(b => /*#__PURE__*/React.createElement(ArchiveRow, {
    key: b.id,
    build: b,
    onSelect: () => onSelect(b)
  }))));
}
function ArchiveRow({
  build,
  onSelect
}) {
  const [hovered, setHovered] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onSelect,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'grid',
      gridTemplateColumns: '150px minmax(0,1fr) 130px 130px 150px 40px',
      alignItems: 'center',
      gap: 'var(--space-6)',
      padding: 'var(--space-6) 0',
      borderBottom: 'var(--border-faint)',
      cursor: 'pointer',
      background: hovered ? 'var(--surface-card)' : 'transparent',
      transition: 'background-color var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-label)'
    }
  }, build.code), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-luxury)',
      fontSize: 'var(--size-title)',
      color: hovered ? 'var(--champagne-gold)' : 'var(--paper-white)',
      transition: 'var(--transition-control)'
    }
  }, build.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, build.year, " ", build.donorName)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-numeric)',
      fontSize: 'var(--size-body-lg)',
      color: 'var(--paper-white)'
    }
  }, build.power), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-numeric)',
      fontSize: 'var(--size-body-lg)',
      color: 'var(--paper-white)'
    }
  }, build.hours, " h"), /*#__PURE__*/React.createElement("span", null, build.status === 'sold' ? /*#__PURE__*/React.createElement(Tag, {
    tone: "sold"
  }, "Sold 2024") : build.status === 'rare' ? /*#__PURE__*/React.createElement(Tag, {
    tone: "rare",
    dot: true
  }, "1 of 1") : /*#__PURE__*/React.createElement(Tag, {
    tone: "gold"
  }, "Available")), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 16,
    color: hovered ? 'var(--champagne-gold)' : 'var(--paper-dim)'
  }));
}
Object.assign(window, {
  LegacyArchive
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LegacyArchive.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Showroom.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
function Showroom() {
  const [slot, setSlot] = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const slots = [{
    day: 'Thu 12 Mar',
    time: '10:00'
  }, {
    day: 'Thu 12 Mar',
    time: '14:00'
  }, {
    day: 'Fri 13 Mar',
    time: '11:00'
  }, {
    day: 'Tue 17 Mar',
    time: '09:30'
  }, {
    day: 'Wed 18 Mar',
    time: '15:00'
  }, {
    day: 'Fri 20 Mar',
    time: '13:00'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-wide) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
      gap: 'var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Private showroom"), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "display",
    luxury: "By appointment only.",
    style: {
      margin: 'var(--space-5) 0 var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure-text)',
      margin: '0 0 var(--space-10)'
    }
  }, "The studio is not open to the public. Viewings run for ninety minutes, one client at a time, with the workshop floor accessible."), /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "16 / 9",
    placeholderLabel: "Studio floor",
    caption: "Stuttgart \u2014 assembly bay 2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: "Mar 2026"
  }, "Select a slot"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-3)'
    }
  }, slots.map((s, i) => {
    const on = slot === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setSlot(i),
      style: {
        textAlign: 'left',
        padding: 'var(--space-5)',
        cursor: 'pointer',
        background: on ? 'var(--gold-wash)' : 'var(--surface-card)',
        border: '1px solid ' + (on ? 'var(--champagne-gold)' : 'var(--line-structural)'),
        transition: 'var(--transition-control)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--size-label-sm)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: on ? 'var(--champagne-gold)' : 'var(--text-label)'
      }
    }, s.day), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-numeric)',
        fontWeight: 'var(--weight-numeric)',
        fontSize: 'var(--size-spec-sm)',
        letterSpacing: 'var(--tracking-numeric)',
        color: 'var(--paper-white)',
        marginTop: 6
      }
    }, s.time));
  })), /*#__PURE__*/React.createElement(BlueprintRule, {
    style: {
      margin: 'var(--space-8) 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    required: true,
    placeholder: "Your name"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Telephone",
    type: "tel",
    help: "Used only to confirm the appointment."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Studio address sent on confirmation"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-dim)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), " Stuttgart")), /*#__PURE__*/React.createElement(Button, {
    disabled: slot === null,
    onClick: () => setConfirmed(true)
  }, "Book the viewing"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirmed,
    eyebrow: "Private showroom",
    title: "Confirm your appointment.",
    onClose: () => setConfirmed(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => setConfirmed(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => setConfirmed(false)
    }, "Confirm"))
  }, slot !== null && slots[slot].day + ', ' + slots[slot].time + ' — Studio, Stuttgart. Ninety minutes, workshop floor included.'));
}
Object.assign(window, {
  Showroom
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Showroom.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/VehicleDetail.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  Tag,
  Badge,
  Card,
  Logo,
  HeadlineSplit,
  SpecNumber,
  Eyebrow,
  SectionTitle,
  BlueprintRule,
  MediaFrame,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SiteHeader,
  SiteFooter,
  Tabs,
  Dialog,
  Toast,
  Tooltip,
  BuildCard,
  SpecTable,
  BeforeAfter,
  AcousticPlayer
} = window.VertexDesignSystem_24ef46;
function VehicleDetail({
  build,
  onBack
}) {
  const [tab, setTab] = React.useState('Exterior');
  const [shot, setShot] = React.useState(0);
  const specs = {
    Exterior: [{
      label: 'Paint',
      value: build.paint
    }, {
      label: 'Wheels',
      value: '17in Fuchs, refinished'
    }, {
      label: 'Lighting',
      value: 'LED in original housings'
    }, {
      label: 'Aero',
      value: 'Ducktail, period-correct profile'
    }],
    Interior: [{
      label: 'Leather',
      value: 'Full-grain, hand-stitched'
    }, {
      label: 'Trim',
      value: 'Exposed carbon, Alcantara headliner'
    }, {
      label: 'Gauges',
      value: 'Bespoke dials, matched to paint'
    }, {
      label: 'Amenities',
      value: 'Concealed audio, climate control'
    }],
    Powertrain: [{
      label: 'Engine',
      value: '3.6 flat-six, twin-plug'
    }, {
      label: 'Power output',
      value: build.power,
      numeric: true,
      accent: true
    }, {
      label: '0–100 km/h',
      value: build.sprint + ' s',
      numeric: true
    }, {
      label: 'Exhaust',
      value: 'Stainless, signature acoustic profile'
    }, {
      label: 'Suspension',
      value: 'Fully adjustable coilover'
    }, {
      label: 'Brakes',
      value: '6-piston front, 4-piston rear'
    }]
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-12) var(--gutter-page-wide) var(--space-16)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--size-label-sm)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--paper-muted)',
      marginBottom: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 13
  }), " All builds"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 'var(--space-10)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, build.code, " \u2014 ", build.year, " ", build.donorName), /*#__PURE__*/React.createElement(HeadlineSplit, {
    size: "display",
    luxury: build.title + '.',
    style: {
      marginTop: 'var(--space-5)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, build.status === 'rare' && /*#__PURE__*/React.createElement(Tag, {
    tone: "rare",
    dot: true
  }, "1 of 1 \u2014 rare donor"), build.status === 'sold' ? /*#__PURE__*/React.createElement(Tag, {
    tone: "sold"
  }, "Sold 2024") : /*#__PURE__*/React.createElement(Tag, {
    tone: "gold"
  }, build.price))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      marginTop: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(SpecNumber, {
    value: parseInt(build.power),
    unit: "hp",
    label: "Power output",
    size: "lg",
    tone: "gold",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: build.sprint,
    unit: "sec",
    label: "0\u2013100 km/h",
    size: "lg",
    countUp: true
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: build.year,
    label: "Donor year",
    size: "lg"
  }), /*#__PURE__*/React.createElement(SpecNumber, {
    value: build.hours,
    label: "Hours invested",
    size: "lg"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-20) var(--gutter-page-wide)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: "Drag to compare"
  }, "Donor to build"), /*#__PURE__*/React.createElement(BeforeAfter, {
    ratio: "21 / 9",
    beforeLabel: "Donor, as acquired",
    afterLabel: build.title
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-20) var(--gutter-page-wide)',
      borderBottom: 'var(--border-rule)'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: "Full breakdown"
  }, "Specification"), /*#__PURE__*/React.createElement(Tabs, {
    items: ['Exterior', 'Interior', 'Powertrain'],
    value: tab,
    onChange: setTab,
    style: {
      marginBottom: 'var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement(SpecTable, {
    columns: 2,
    rows: specs[tab]
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-20) var(--gutter-page-wide)',
      borderBottom: 'var(--border-rule)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, null, "Acoustic experience"), /*#__PURE__*/React.createElement(AcousticPlayer, {
    tracks: [{
      label: 'Cold start',
      duration: '0:34'
    }, {
      label: 'Exhaust note',
      duration: '1:12'
    }]
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--size-body-sm)',
      color: 'var(--text-tertiary)',
      marginTop: 'var(--space-5)'
    }
  }, "Recorded at the studio, 4m from the tailpipe, no processing.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    meta: "52 frames"
  }, "Gallery"), /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "3 / 2",
    placeholderLabel: 'Frame ' + String(shot + 1).padStart(2, '0'),
    scrim: true,
    overlay: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "gold"
    }, build.code), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      name: "chevron-left",
      label: "Previous",
      size: "sm",
      onClick: () => setShot(s => Math.max(0, s - 1))
    }), /*#__PURE__*/React.createElement(IconButton, {
      name: "chevron-right",
      label: "Next",
      size: "sm",
      onClick: () => setShot(s => Math.min(51, s + 1))
    })))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setShot(i),
    style: {
      flex: 1,
      height: 52,
      background: 'var(--surface-page)',
      backgroundImage: 'var(--grid-blueprint)',
      border: '1px solid ' + (shot === i ? 'var(--champagne-gold)' : 'var(--line-structural)'),
      cursor: 'pointer'
    }
  }))))));
}
Object.assign(window, {
  VehicleDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/VehicleDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.VERTEX_DATA = {
  builds: [{
    id: 'p01',
    code: 'Project 01',
    year: 1989,
    donorName: 'Porsche 911 Targa (964)',
    title: 'Monaco Edition',
    donor: 'Air-cooled 3.6 flat-six, matching numbers',
    status: 'rare',
    power: '640 hp',
    hours: '1,247',
    sprint: '3.2',
    paint: 'PTS Monaco Blue',
    price: 'On application'
  }, {
    id: 'p02',
    code: 'Project 02',
    year: 1971,
    donorName: 'Mercedes-Benz 280 SL',
    title: 'Riviera',
    donor: 'Pagoda hardtop, single-owner shell',
    status: 'available',
    power: '420 hp',
    hours: '1,104',
    sprint: '4.1',
    paint: 'Anthracite over Cognac',
    price: 'On application'
  }, {
    id: 'p03',
    code: 'Project 03',
    year: 1984,
    donorName: 'Lamborghini Jalpa',
    title: 'Sant\u2019Agata',
    donor: 'Targa, factory 3.5 V8 rebuilt to 4.0',
    status: 'building',
    power: '505 hp',
    hours: '860',
    sprint: '3.8',
    paint: 'Nero Opaco',
    price: 'Reserved'
  }, {
    id: 'p04',
    code: 'Project 04',
    year: 1993,
    donorName: 'Porsche 964 Turbo',
    title: 'Nordschleife',
    donor: '3.6 Turbo, factory Speed Yellow',
    status: 'sold',
    power: '700 hp',
    hours: '1,392',
    sprint: '2.9',
    paint: 'Speed Yellow, satin',
    price: 'Sold 2024'
  }],
  footer: [{
    title: 'Builds',
    links: ['Available builds', 'Legacy archive', 'Commission a build']
  }, {
    title: 'Studio',
    links: ['The process', 'Private showroom', 'Contact']
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.BlueprintRule = __ds_scope.BlueprintRule;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.HeadlineSplit = __ds_scope.HeadlineSplit;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.SpecNumber = __ds_scope.SpecNumber;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.AcousticPlayer = __ds_scope.AcousticPlayer;

__ds_ns.BeforeAfter = __ds_scope.BeforeAfter;

__ds_ns.BuildCard = __ds_scope.BuildCard;

__ds_ns.SpecTable = __ds_scope.SpecTable;

})();
