import React from 'react';

const I = ({ children, w = 14, h = 14, vb = '0 0 14 14', stroke = 'rgba(255,255,255,0.35)', sw = 1.2, fill = 'none', ...rest }) => (
  <svg width={w} height={h} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

export const PlusIcon = (p) => (
  <I w={14} h={14} vb="0 0 14 14" {...p}><line x1="7" y1="2" x2="7" y2="12" /><line x1="2" y1="7" x2="12" y2="7" /></I>
);
export const CamIcon = (p) => (
  <I w={14} h={14} vb="0 0 14 14" {...p}>
    <rect x="2" y="2" width="10" height="10" rx="2.5" />
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="10" cy="4" r="0.6" fill={p.stroke || 'rgba(255,255,255,0.3)'} stroke="none" />
  </I>
);
export const Chevron = (p) => (
  <I w={5} h={9} vb="0 0 5 9" {...p}><polyline points="1,1 4,4.5 1,8" /></I>
);
export const SearchIcon = (p) => (
  <I w={10} h={10} vb="0 0 10 10" sw={1.2} stroke="rgba(255,255,255,0.12)" {...p}><circle cx="4" cy="4" r="2.8" /><line x1="6.2" y1="6.2" x2="9" y2="9" /></I>
);
export const PhoneIcon = (p) => (
  <I w={20} h={20} vb="0 0 20 20" sw={1.3} stroke="rgba(255,255,255,0.25)" {...p}>
    <path d="M3.5 2.5h5l1.5 3.5-2 1.5a8 8 0 0 0 3.5 3.5l1.5-2 3.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5C6.5 15.5 2.5 9.5 2.5 4A1.5 1.5 0 0 1 3.5 2.5Z" />
  </I>
);
export const ChatIcon = (p) => (
  <I w={20} h={20} vb="0 0 20 20" sw={1.3} stroke="rgba(255,255,255,0.25)" {...p}>
    <path d="M2.5 3.5h15a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6l-3.5 3V4.5a1 1 0 0 1 .5-.9Z" />
  </I>
);
export const SpotifyIcon = (p) => (
  <I w={20} h={20} vb="0 0 20 20" sw={1.3} stroke="rgba(255,255,255,0.25)" {...p}>
    <path d="M7 15V5l9-2v10" /><circle cx="4.5" cy="15" r="2.5" /><circle cx="13.5" cy="13" r="2.5" />
  </I>
);
export const DropIcon = (p) => (
  <I w={13} h={15} vb="0 0 13 15" sw={1.2} {...p}>
    <path d="M6.5 1.5C6.5 1.5 2 6.5 2 9.5a4.5 4.5 0 0 0 9 0C11 6.5 6.5 1.5 6.5 1.5Z" />
  </I>
);
export const CheckIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.2} {...p}><polyline points="1.5,6.5 5,10.5 11.5,2.5" /></I>
);
export const FocusIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.2} {...p}>
    <circle cx="6.5" cy="6.5" r="5" /><circle cx="6.5" cy="6.5" r="2" />
    <circle cx="6.5" cy="6.5" r="0.7" fill={p.stroke || 'rgba(255,255,255,0.35)'} stroke="none" />
  </I>
);
export const SleepIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}><path d="M4 2A5 5 0 0 0 9.5 7.5 5 5 0 1 1 4 2Z" /></I>
);
export const StepsIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}><path d="M1.5 10l2.5-5.5 2.5 3.5 2-2.5" /></I>
);
export const PhoneOutline = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}><rect x="3" y="1" width="7" height="11" rx="2" /><line x1="5.5" y1="10" x2="7.5" y2="10" /></I>
);
export const MindIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}><circle cx="6.5" cy="6.5" r="5" /><path d="M4.5 6.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0" /></I>
);
export const LifeIcon = (p) => (
  <I w={18} h={18} vb="0 0 18 18" sw={1.3} stroke="currentColor" {...p}>
    <path d="M9 3C9 3 3.5 8 3.5 12a5.5 5.5 0 0 0 11 0C14.5 8 9 3 9 3Z" />
  </I>
);
export const HabitsIcon = (p) => (
  <I w={18} h={18} vb="0 0 18 18" sw={1.3} stroke="currentColor" {...p}><polyline points="2.5,9 7,14 15.5,4" /></I>
);
export const WorkIcon = (p) => (
  <I w={18} h={18} vb="0 0 18 18" sw={1.3} stroke="currentColor" {...p}>
    <rect x="2" y="5" width="14" height="10" rx="2" />
    <path d="M6 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
  </I>
);
export const HubIcon = (p) => (
  <I w={18} h={18} vb="0 0 18 18" sw={1.3} stroke="currentColor" {...p}><circle cx="9" cy="9" r="7" /><circle cx="9" cy="9" r="3" /></I>
);
export const FocusNavIcon = (p) => (
  <I w={18} h={18} vb="0 0 18 18" sw={1.3} stroke="currentColor" {...p}>
    <circle cx="9" cy="9" r="7" /><circle cx="9" cy="9" r="3.5" />
    <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
  </I>
);
export const PushupIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}>
    <path d="M1.5 8.5h2V6h7v2.5h2" /><rect x="4.5" y="3.5" width="4" height="2.5" rx="1" />
  </I>
);
export const StretchIcon = (p) => (
  <I w={13} h={13} vb="0 0 13 13" sw={1.1} {...p}>
    <circle cx="6.5" cy="2.8" r="1.2" /><path d="M6.5 4.5v3l-2 2.5M6.5 7.5l2 2.5" />
    <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" />
  </I>
);
export const FlameIcon = (p) => (
  <I w={12} h={14} vb="0 0 12 14" sw={1} stroke="rgba(255,255,255,0.22)" {...p}>
    <path d="M6 13c-2.4 0-4.3-1.7-4.3-3.8 0-1.4.7-2.7 1.8-3.4 0 1 .4 1.9 1.1 2.3.3-1.5.7-3 0-4.6 1.7.5 3.2 2.2 3.2 3.7.4-.4.6-1 .6-1.6.9.9 1.2 2 1.2 2.7 0 2.1-1.8 3.7-4.2 3.7z" />
  </I>
);
export const N8nIcon = (p) => (
  <I w={11} h={11} vb="0 0 11 11" sw={1} stroke="rgba(255,255,255,0.15)" {...p}>
    <rect x="1" y="1" width="4" height="4" rx="1" />
    <rect x="6" y="1" width="4" height="4" rx="1" />
    <rect x="3.5" y="6" width="4" height="4" rx="1" />
  </I>
);
export const MailIcon = (p) => (
  <I w={11} h={11} vb="0 0 11 11" sw={1} stroke="rgba(255,255,255,0.15)" {...p}>
    <rect x="1" y="2" width="9" height="7" rx="1.5" />
    <polyline points="1,4 5.5,6.5 10,4" />
  </I>
);
export const HealthIcon = (p) => (
  <I w={11} h={11} vb="0 0 11 11" sw={1} stroke="rgba(255,255,255,0.15)" {...p}><circle cx="5.5" cy="5.5" r="4" /></I>
);
export const PodcastIcon = (p) => (
  <I w={16} h={16} vb="0 0 16 16" sw={1.2} stroke="rgba(255,255,255,0.3)" {...p}>
    <path d="M2.5 9V8a5.5 5.5 0 0 1 11 0v1" />
    <rect x="1" y="9" width="3" height="4.5" rx="1.5" />
    <rect x="12" y="9" width="3" height="4.5" rx="1.5" />
  </I>
);
export const PlayIcon = ({ size = 8, fill = 'rgba(255,255,255,0.4)' }) => (
  <svg width={size} height={size + 2} viewBox="0 0 8 10" fill={fill}><polygon points="1,1 7,5 1,9" /></svg>
);
export const PauseIcon = ({ size = 18, fill = 'rgba(255,255,255,0.55)' }) => (
  <svg width={size} height={size + 2} viewBox="0 0 18 20" fill={fill}>
    <rect x="3" y="2" width="4" height="16" rx="1" />
    <rect x="11" y="2" width="4" height="16" rx="1" />
  </svg>
);
export const PlayBig = ({ size = 18, fill = 'rgba(255,255,255,0.55)' }) => (
  <svg width={size} height={size + 2} viewBox="0 0 18 20" fill={fill}><polygon points="3,2 15,10 3,18" /></svg>
);
