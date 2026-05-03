import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, scores } from '../store.js';
import { fetchPodcast, FALLBACK_PODCAST } from '../lib/anthropic.js';
import { fetchWeather, FALLBACK_WEATHER } from '../lib/weather.js';
import { todayKey } from '../lib/dates.js';
import { MiniRing } from '../components/Ring.jsx';
import {
  SearchIcon, PhoneIcon, ChatIcon, SpotifyIcon, CamIcon, PodcastIcon, PlayIcon,
} from '../components/Icon.jsx';

const WidgyTag = () => (
  <div className="font-mono font-light text-[7px] tracking-[0.22em] uppercase text-white/[0.08] text-right py-1">
    Widgy
  </div>
);

export default function Home() {
  const nav = useNavigate();
  const state = useStore();
  const setPodcast = useStore((s) => s.setPodcast);
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState(FALLBACK_WEATHER);
  const s = scores(state);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => {});
  }, []);

  useEffect(() => {
    if (state.podcast?.dateKey === todayKey()) return;
    fetchPodcast()
      .then(setPodcast)
      .catch(() => setPodcast(FALLBACK_PODCAST));
  }, []); // eslint-disable-line

  const dayNum = String(now.getDate()).padStart(2, '0');
  const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const monthYear = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const podcast = state.podcast ?? FALLBACK_PODCAST;
  const briefing = state.briefing?.items ?? [
    { tag: 'AI', text: 'OpenAI ships o3 to all tiers — beats GPT-4o on reasoning' },
    { tag: 'MKT', text: 'JSE up 1.2% — Naspers leads, rand holds at R18.40' },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex flex-col bg-bg pt-[env(safe-area-inset-top,2.75rem)]">
      {/* wallpaper */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-16 -right-20 h-[500px] w-[500px] rounded-full border border-white/[0.025]" />
        <div className="absolute -bottom-24 -right-32 h-[650px] w-[650px] rounded-full border border-white/[0.015]" />
        <div className="absolute top-52 -left-24 h-[350px] w-[350px] rounded-full border border-white/[0.018]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-[18px]">
        {/* DATE */}
        <div className="pt-1 pb-4">
          <div className="font-sans font-thin text-[10px] tracking-[0.24em] uppercase text-white/[0.18] mb-1">
            {dayName}
          </div>
          <div className="font-mono font-medium text-[52px] leading-[0.88] tracking-[-0.05em] text-white/90">
            {dayNum}
          </div>
          <div className="mt-1.5 font-mono font-light text-[10px] tracking-[0.2em] uppercase text-white/[0.18]">
            {monthYear}
          </div>
        </div>

        <div className="hairline" />
        <WidgyTag />

        {/* SCORE WIDGET */}
        <div className="mb-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="label !text-[7.5px] mb-1">Today's Score</div>
              <div className="font-mono font-medium text-[32px] leading-none tracking-[-0.04em] text-white/80">
                {s.today}
              </div>
            </div>
            <div className="relative h-[70px] w-[70px]">
              <MiniRing life={s.life} habits={s.habits} work={s.work} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-mono font-light text-[8px] tracking-[0.1em] uppercase text-white/30">Today</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { name: 'Life', v: s.life, fill: 'rgba(255,255,255,0.55)' },
              { name: 'Habits', v: s.habits, fill: 'rgba(255,255,255,0.4)' },
              { name: 'Work', v: s.work, fill: 'rgba(255,255,255,0.25)' },
            ].map((b) => (
              <div key={b.name} className="flex-1">
                <div className="mb-1 flex justify-between">
                  <span className="font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/[0.18]">{b.name}</span>
                  <span className="font-mono text-[12px] text-white/45">{b.v}%</span>
                </div>
                <div className="h-[2px] rounded-[1px] bg-white/[0.06]">
                  <div className="h-full rounded-[1px]" style={{ width: `${b.v}%`, background: b.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <WidgyTag />

        {/* QUICK STATS */}
        <div className="mb-1.5 flex gap-1.5">
          <QStat label="Weather" main={`${weather.temp}°`} sub={`${weather.desc} · ${weather.city}`} />
          <QStat label="Events" main="3" sub="Today" />
          <QStat label="Screen" main="42m" sub="48m left" />
        </div>
        <WidgyTag />

        {/* AI BRIEFING */}
        <div className="mb-1.5 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/[0.04] px-3 pt-2 pb-1.5">
            <span className="label !text-[7.5px]">AI Briefing</span>
            <span className="label !text-[7.5px] !text-white/10">View all</span>
          </div>
          {briefing.slice(0, 2).map((b, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 px-3 py-1.5 ${i < 1 ? 'border-b border-white/[0.03]' : ''}`}
            >
              <span className="min-w-[20px] pt-[1.5px] font-mono font-light text-[7px] tracking-[0.1em] uppercase text-white/[0.18]">
                {b.tag}
              </span>
              <span className="font-sans font-thin text-[10px] leading-[1.4] text-white/35">{b.text}</span>
            </div>
          ))}
        </div>

        {/* PODCAST */}
        <div className="mb-1.5 flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04]">
            <PodcastIcon w={15} h={15} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 font-mono font-light text-[7px] tracking-[0.12em] uppercase text-white/[0.16]">
              {podcast.show} · {podcast.episode}
            </div>
            <div className="truncate font-sans font-thin text-[10px] leading-[1.3] text-white/[0.38]">
              {podcast.description}
            </div>
            <div className="mt-0.5 font-mono font-light text-[7px] tracking-[0.08em] text-white/[0.14]">
              {podcast.duration}
            </div>
          </div>
          <div className="flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10">
            <PlayIcon size={7} />
          </div>
        </div>
        <WidgyTag />

        {/* SEARCH */}
        <div className="mt-auto mb-0.5 flex items-center gap-2 rounded-lg border border-white/[0.04] px-3 py-1.5">
          <SearchIcon />
          <span className="font-mono font-light text-[8px] tracking-[0.14em] uppercase text-white/10">Search</span>
        </div>
      </div>

      {/* DOCK */}
      <div className="relative z-10 flex justify-around border-t border-white/[0.03] bg-black/80 px-6 pt-2 pb-[max(env(safe-area-inset-bottom),18px)]">
        <DockIcon><PhoneIcon /></DockIcon>
        <DockIcon><ChatIcon /></DockIcon>
        <DockIcon><SpotifyIcon /></DockIcon>
        <DockIcon onClick={() => nav('/app')}>
          <CamIcon w={18} h={18} stroke="rgba(255,255,255,0.55)" />
        </DockIcon>
      </div>
    </div>
  );
}

const QStat = ({ label, main, sub }) => (
  <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2.5">
    <div className="mb-1 font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/[0.18]">{label}</div>
    <div className="font-mono text-[16px] leading-none tracking-[-0.02em] text-white/60">{main}</div>
    <div className="mt-0.5 font-mono font-light text-[7.5px] tracking-[0.08em] text-white/[0.18]">{sub}</div>
  </div>
);

const DockIcon = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] active:bg-white/[0.07]"
  >
    {children}
  </div>
);
