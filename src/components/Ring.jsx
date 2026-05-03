import React from 'react';

const C = (r) => 2 * Math.PI * r;

// Multi-ring concentric (Life outer / Habits middle / Work inner)
export const TripleRing = ({ size = 148, life = 0, habits = 0, work = 0, onTap }) => {
  const sw = 9;
  const r1 = (size - sw) / 2 - 2; // outer
  const r2 = r1 - 16;
  const r3 = r2 - 16;
  const off = (r, p) => C(r) * (1 - Math.max(0, Math.min(100, p)) / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {[r1, r2, r3].map((r) => (
        <circle key={`t${r}`} cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
      ))}
      <circle cx={size / 2} cy={size / 2} r={r1}
        fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r1)} strokeDashoffset={off(r1, life)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <circle cx={size / 2} cy={size / 2} r={r2}
        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r2)} strokeDashoffset={off(r2, habits)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <circle cx={size / 2} cy={size / 2} r={r3}
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r3)} strokeDashoffset={off(r3, work)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
      {onTap && (
        <>
          <circle cx={size / 2} cy={size / 2} r={r1} fill="none" stroke="transparent" strokeWidth="26"
            onClick={() => onTap('life')} style={{ cursor: 'pointer', pointerEvents: 'all' }} />
          <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke="transparent" strokeWidth="26"
            onClick={() => onTap('habits')} style={{ cursor: 'pointer', pointerEvents: 'all' }} />
          <circle cx={size / 2} cy={size / 2} r={r3} fill="none" stroke="transparent" strokeWidth="26"
            onClick={() => onTap('work')} style={{ cursor: 'pointer', pointerEvents: 'all' }} />
        </>
      )}
    </svg>
  );
};

// Big single ring used on Life/Habits/Work tabs
export const SingleRing = ({ size = 140, pct = 0, stroke = 'rgba(255,255,255,0.7)' }) => {
  const sw = 10;
  const r = (size - sw) / 2 - 2;
  const off = C(r) * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} strokeLinecap="round" />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r)} strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
    </svg>
  );
};

// Mini 3-ring used on Home screen score widget
export const MiniRing = ({ size = 70, life = 0, habits = 0, work = 0 }) => {
  const sw = 5;
  const r1 = 30;
  const r2 = 22;
  const r3 = 14;
  const off = (r, p) => C(r) * (1 - Math.max(0, Math.min(100, p)) / 100);
  return (
    <svg width={size} height={size} viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
      {[r1, r2, r3].map((r) => (
        <circle key={`mt${r}`} cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
      ))}
      <circle cx="35" cy="35" r={r1} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r1)} strokeDashoffset={off(r1, life)} />
      <circle cx="35" cy="35" r={r2} fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r2)} strokeDashoffset={off(r2, habits)} />
      <circle cx="35" cy="35" r={r3} fill="none" stroke="rgba(255,255,255,0.27)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={C(r3)} strokeDashoffset={off(r3, work)} />
    </svg>
  );
};

// Focus tab countdown ring
export const FocusRing = ({ size = 170, pct = 1 }) => {
  const sw = 8;
  const r = 75;
  const c = C(r);
  const off = c * (1 - pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} strokeLinecap="round" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1s linear' }} />
    </svg>
  );
};
