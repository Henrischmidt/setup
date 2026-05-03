import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, scores } from '../store.js';
import { fetchBriefing, FALLBACK_BRIEFING } from '../lib/anthropic.js';
import { todayKey, weekNumber, dayOfYear, yearProgress, fmtTime } from '../lib/dates.js';
import { Chevron, PlusIcon, CamIcon } from '../components/Icon.jsx';

const Greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning, Cam';
  if (h < 18) return 'Good afternoon, Cam';
  return 'Good evening, Cam';
};

export default function Lock() {
  const nav = useNavigate();
  const state = useStore();
  const setBriefing = useStore((s) => s.setBriefing);
  const [now, setNow] = useState(new Date());
  const [time, setTime] = useState(fmtTime());
  const touchY = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setTime(fmtTime());
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  // Briefing — load once per day
  useEffect(() => {
    const cached = state.briefing;
    if (cached?.dateKey === todayKey()) return;
    fetchBriefing()
      .then(setBriefing)
      .catch(() => setBriefing(FALLBACK_BRIEFING));
  }, []); // eslint-disable-line

  const onStart = (e) => (touchY.current = e.touches[0].clientY);
  const onEnd = (e) => {
    if (touchY.current == null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    touchY.current = null;
    if (dy > 60) nav('/home');
  };

  const s = scores(state);
  const dateLine = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const wk = weekNumber(now);
  const doy = dayOfYear(now);
  const yp = yearProgress(now);
  const items = state.briefing?.items ?? FALLBACK_BRIEFING;
  const teaser = items[0];

  return (
    <div
      className="relative h-screen w-screen overflow-hidden flex flex-col px-5 pb-6 pt-[env(safe-area-inset-top,3rem)]"
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onClick={() => nav('/home')}
    >
      {/* geo lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 bottom-20 h-[340px] w-[340px] rounded-full border border-white/[0.022]" />
        <div className="absolute -right-32 bottom-10 h-[440px] w-[440px] rounded-full border border-white/[0.012]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="font-mono font-light text-[10px] tracking-[0.24em] uppercase text-white/[0.18] mb-1.5">
          {Greeting()}
        </div>
        <div className="font-mono font-medium text-[78px] leading-[0.88] tracking-[-0.04em] text-white mb-2">
          {time}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="serif-it text-[16px] text-white/[0.32]">{dateLine}</span>
          <span className="font-mono font-light text-[8px] tracking-widest uppercase text-white/[0.12]">
            Week {wk}
          </span>
        </div>

        {/* Score + year */}
        <div className="flex items-center gap-3 mb-4">
          <div>
            <div className="label mb-1">Today's Score</div>
            <div className="font-mono font-medium text-[30px] leading-none tracking-[-0.04em] text-white/70">{s.today}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1.5">
              <span className="label !text-[7.5px] !tracking-widest text-white/[0.12]">
                Day {doy} of 365
              </span>
              <span className="font-mono font-light text-[7.5px] text-white/[0.16]">{yp.toFixed(1)}%</span>
            </div>
            <div className="h-px bg-white/[0.06] relative">
              <div className="h-full bg-white/[0.28] relative" style={{ width: `${yp}%` }}>
                <div className="absolute -right-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-white/[0.45] shadow-[0_0_4px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Three ring bars */}
        <div className="flex gap-2 mb-4">
          {[
            { name: 'Life', v: s.life, fill: 'rgba(255,255,255,0.55)' },
            { name: 'Habits', v: s.habits, fill: 'rgba(255,255,255,0.4)' },
            { name: 'Work', v: s.work, fill: 'rgba(255,255,255,0.25)' },
          ].map((b) => (
            <div key={b.name} className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-mono font-light text-[7.5px] tracking-[0.14em] uppercase text-white/[0.18]">{b.name}</span>
                <span className="font-mono text-[13px] text-white/50">{b.v}%</span>
              </div>
              <div className="h-[2px] bg-white/[0.06] rounded-[1px]">
                <div className="h-full rounded-[1px]" style={{ width: `${b.v}%`, background: b.fill }} />
              </div>
            </div>
          ))}
        </div>

        <div className="hairline mb-2.5" />

        {/* Info rows */}
        <InfoRow label="Weather" main="22° · Clear · Cape Town" right="H:28 · L:16" />
        <InfoRow label="Next Event" main="SA Epic check-in · 10:00" right="+58 min" />
        <InfoRow label="Screen Time" main="42m used · 48m left" right="47%" />

        {/* AI teaser */}
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5">
          <div className="font-mono font-light text-[7px] tracking-[0.12em] uppercase text-white/[0.18] shrink-0">
            {teaser.tag}
          </div>
          <div className="flex-1 font-sans font-thin text-[10px] leading-[1.4] text-white/30">{teaser.text}</div>
          <Chevron stroke="rgba(255,255,255,0.2)" />
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.07]">
            <PlusIcon stroke="rgba(255,255,255,0.2)" />
          </div>
          <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/10">Swipe up</div>
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.07]">
            <CamIcon stroke="rgba(255,255,255,0.2)" />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, main, right }) => (
  <div className="flex items-center justify-between border-b border-white/[0.04] py-1.5">
    <div>
      <div className="label mb-0.5 !text-[7.5px]">{label}</div>
      <div className="font-sans font-thin text-[12px] text-white/[0.42]">{main}</div>
    </div>
    <div className="font-mono font-light text-[9px] text-white/[0.18]">{right}</div>
  </div>
);
