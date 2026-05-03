import React, { useState, useMemo } from 'react';
import { habitMet } from '../store.js';
import { todayKey } from '../lib/dates.js';

// Last N days, ending today (today is the last cell).
const lastNDates = (n) => {
  const out = [];
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(t);
    d.setDate(t.getDate() - i);
    out.push(d);
  }
  return out;
};

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const fmtDate = (d) =>
  d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

// dayCompletion: returns 0 (none), 0.5 (some), 1 (all) for given day key
const completionFor = (habits, logsForDay, todayProgress, key) => {
  if (!habits.length) return 0;
  const isToday = key === todayKey();
  const source = isToday ? (todayProgress ?? {}) : (logsForDay ?? {});
  if (!source) return 0;
  let met = 0;
  habits.forEach((h) => {
    if (habitMet(h, source[h.id])) met++;
  });
  if (met === 0) return 0;
  if (met === habits.length) return 1;
  return 0.5;
};

const namesMet = (habits, source) =>
  habits.filter((h) => habitMet(h, source?.[h.id])).map((h) => h.name);

export default function DotGrid({ habits, dailyLogs, todayProgress, days = 30 }) {
  const dates = useMemo(() => lastNDates(days), [days]);
  const today = todayKey();
  const [picked, setPicked] = useState(today);

  const pickedDate = dates.find((d) => ymd(d) === picked);
  const pickedSource = picked === today ? todayProgress : dailyLogs[picked];
  const pickedMet = pickedSource ? namesMet(habits, pickedSource) : [];

  return (
    <div>
      <div className="grid grid-cols-10 gap-[6px]">
        {dates.map((d) => {
          const k = ymd(d);
          const isToday = k === today;
          const isPicked = k === picked;
          const c = completionFor(habits, dailyLogs[k], todayProgress, k);
          const empty = c === 0;
          const half = c === 0.5;
          const full = c === 1;
          return (
            <button
              key={k}
              onClick={() => setPicked(k)}
              className="relative flex items-center justify-center"
              style={{ minHeight: 24, minWidth: 24 }}
              aria-label={fmtDate(d)}
            >
              <span
                className={`block rounded-full transition ${isToday ? 'h-[12px] w-[12px]' : 'h-[10px] w-[10px]'}`}
                style={{
                  background: full
                    ? '#fff'
                    : half
                    ? 'linear-gradient(90deg, #fff 50%, transparent 50%)'
                    : 'transparent',
                  border: empty ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  boxShadow: full
                    ? '0 0 6px rgba(255,255,255,0.4)'
                    : isToday
                    ? '0 0 6px rgba(255,255,255,0.15)'
                    : 'none',
                  outline: isPicked ? '1px solid rgba(255,255,255,0.55)' : 'none',
                  outlineOffset: isPicked ? '2px' : 0,
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-3 rounded-[8px] border border-white/[0.05] bg-white/[0.018] px-3 py-2">
        <div className="font-mono font-light text-[8px] tracking-[0.14em] uppercase text-white/[0.35]">
          {pickedDate ? fmtDate(pickedDate) : ''}
        </div>
        <div className="mt-1 font-sans font-thin text-[10.5px] leading-[1.45] text-white/55">
          {!pickedSource
            ? 'No data for this day.'
            : pickedMet.length === 0
            ? 'No habits completed.'
            : `${pickedMet.length} of ${habits.length} done · ${pickedMet.join(', ')}`}
        </div>
      </div>
    </div>
  );
}
