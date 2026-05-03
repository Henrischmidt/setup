// Icon registry — name => SVG path data (viewBox 24 24, stroke-based)
import React from 'react';

const iconBase = (size, stroke = 'rgba(255,255,255,0.35)', children) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const HABIT_ICONS = [
  {
    name: 'drop',
    render: (size = 28, stroke) =>
      iconBase(size, stroke, <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z" />),
  },
  {
    name: 'lightning',
    render: (size = 28, stroke) =>
      iconBase(size, stroke, <polyline points="13,2 4,14 11,14 10,22 20,10 13,10 14,2" />),
  },
  {
    name: 'stretch',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M12 7v5l-4 5M12 12l4 5" />
          <line x1="8" y1="11" x2="16" y2="11" />
        </>
      ),
  },
  {
    name: 'flame',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <path d="M12 22c-4 0-7-2.8-7-6.3 0-2.3 1.1-4.4 3-5.6 0 1.6.7 3 2 3.8.5-2.5 1.2-5 0-7.6 2.8.8 5.3 3.6 5.3 6 .7-.6 1-1.6 1-2.6 1.5 1.4 2 3.3 2 4.4 0 3.5-3 6.3-6.3 6.3z" />
      ),
  },
  {
    name: 'clock',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12,7 12,12 16,14" />
        </>
      ),
  },
  {
    name: 'star',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <polygon points="12,2 14.7,8.6 22,9.3 16.5,14 18.3,21 12,17.5 5.7,21 7.5,14 2,9.3 9.3,8.6" />
      ),
  },
  {
    name: 'moon',
    render: (size = 28, stroke) =>
      iconBase(size, stroke, <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />),
  },
  {
    name: 'heart',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <path d="M12 21s-7-4.5-9-9.5C1.4 7 5 3.5 9 5c1.5.6 2.4 1.5 3 2.5C12.6 6.5 13.5 5.6 15 5c4-1.5 7.6 2 6 6.5-2 5-9 9.5-9 9.5Z" />
      ),
  },
  {
    name: 'dumbbell',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <>
          <line x1="6" y1="9" x2="6" y2="15" />
          <line x1="18" y1="9" x2="18" y2="15" />
          <line x1="3" y1="11" x2="3" y2="13" />
          <line x1="21" y1="11" x2="21" y2="13" />
          <line x1="6" y1="12" x2="18" y2="12" />
        </>
      ),
  },
  {
    name: 'book',
    render: (size = 28, stroke) =>
      iconBase(
        size,
        stroke,
        <>
          <path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4Z" />
          <path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7Z" />
        </>
      ),
  },
];

export const ICON_BY_NAME = Object.fromEntries(HABIT_ICONS.map((i) => [i.name, i]));

export const renderHabitIcon = (name, size = 14, stroke = 'rgba(255,255,255,0.35)') => {
  const icon = ICON_BY_NAME[name] ?? ICON_BY_NAME.star;
  return icon.render(size, stroke);
};
