/**
 * Rowan & Hound Design System Tokens
 * Independent Premium Pet Retailer + Modern Editorial Pet Magazine
 */

export const DESIGN_TOKENS = {
  colors: {
    // Warm Canvas & Paper Backgrounds
    canvas: '#FAF8F5',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F2EB',
    surfaceSubtle: '#EFEBE2',

    // Text & Natural Pigments
    espresso: '#1C1917',
    charcoal: '#292524',
    walnut: '#44403C',
    stoneMuted: '#78716C',
    stoneLight: '#A8A29E',

    // Restrained Natural Accents
    forestGreen: '#1E3A2F',
    forestGreenDark: '#142720',
    forestGreenLight: '#2C5343',
    terracotta: '#9E5A26',
    terracottaLight: '#B85D36',
    warmOat: '#EFE9DC',

    // Framing & Dividers
    borderSubtle: '#E7E2D9',
    borderMedium: '#D6CEBF',
    borderDark: '#A8A29E',

    // Semantic States
    success: '#1B4D3E',
    successBg: '#EAF3EF',
    warning: '#8A5A00',
    warningBg: '#FDF6E2',
    error: '#9A2B2B',
    errorBg: '#FDF0F0',
    info: '#2B4A6F',
    infoBg: '#EDF3F9',
  },

  typography: {
    display: 'font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 leading-[1.12]',
    h1: 'font-serif text-2xl sm:text-3xl font-normal tracking-tight text-stone-900 leading-snug',
    h2: 'font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug',
    h3: 'font-sans text-base sm:text-lg font-semibold text-stone-900 tracking-tight leading-snug',
    body: 'font-sans text-sm text-stone-700 leading-relaxed',
    bodyMuted: 'font-sans text-sm text-stone-600 leading-relaxed',
    small: 'font-sans text-xs text-stone-600 leading-normal',
    label: 'font-sans text-[11px] uppercase tracking-wider font-semibold text-stone-600',
    price: 'font-mono text-base font-semibold tabular-nums text-stone-900',
    priceLg: 'font-mono text-xl sm:text-2xl font-semibold tabular-nums text-stone-900',
    metadata: 'font-sans text-xs text-stone-500 flex items-center gap-1.5',
    kicker: 'font-sans text-[11px] uppercase tracking-widest text-emerald-950 font-bold',
  },

  radii: {
    xs: 'rounded-xs', // 2px - tags, badge, inputs, buttons
    sm: 'rounded-sm', // 4px - compact cards, containers
    md: 'rounded-md', // 6px - larger modal panels
  },

  shadows: {
    subtle: 'shadow-xs',
    card: 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
    modal: 'shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
  },

  spacing: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerNarrow: 'max-w-4xl mx-auto px-4 sm:px-6',
    sectionPadding: 'py-12 sm:py-16 lg:py-20',
  },
} as const;
