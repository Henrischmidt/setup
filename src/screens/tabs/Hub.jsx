import React, { useEffect, useMemo, useState } from 'react';
import { useStore, scores, habitsCompletionToday } from '../../store.js';
import { TripleRing } from '../../components/Ring.jsx';
import { DropIcon, CheckIcon, FocusIcon, Chevron, PodcastIcon, PlayIcon } from '../../components/Icon.jsx';
import { yearProgress } from '../../lib/dates.js';
import { fetchPodcast, FALLBACK_PODCAST } from '../../lib/anthropic.js';
import { todayKey } from '../../lib/dates.js';
import { renderHabitIcon } from '../../lib/icons.jsx';

export default function Hub({ goTo }) {
  const habits = useStore((s) => s.habits);
  const todayProgress = useStore((s) => s.todayProgress);
  const tasks = useStore((s) => s.tasks);
  const focus = useStore((s) => s.focus);
  const briefingState = useStore((s) => s.briefing);
  const podcastState = useStore((s) => s.podcast);
  const bumpProgressive = useStore((s) => s.bumpProgressive);
  const toggleSimpleHabit = useStore((s) => s.toggleSimpleHabit);
  const setPodcast = useStore((s) => s.setPodcast);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (podcastState?.dateKey === todayKey()) return;
    fetchPodcast().then(setPodcast).catch(() => setPodcast(FALLBACK_PODCAST));
  }, []); // eslint-disable-line

  const s = useMemo(() => scores({ habits, todayProgress, tasks }), [habits, todayProgress, tasks]);
  const yp = yearProgress(now);
  const briefing = briefingState?.items ?? [
    { tag: 'AI', text: 'OpenAI ships o3 to all tiers — beats GPT-4o on reasoning' },
    { tag: 'MKT', text: 'JSE up 1.2% — Naspers leads, rand holds at R18.40' },
    { tag: 'World', text: 'Fed holds — Powell signals two cuts possible H2 2026' },
  ];
  const podcast = podcastState ?? FALLBACK_PODCAST;

  const dayNum = String(now.getDate()).padStart(2, '0');
  const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const monthYear = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const completion = habitsCompletionToday({ habits, todayProgress });
  // First progressive habit (typically Water) becomes the +bump quick action
  const quickHabit = habits.find((h) => h.type === 'progressive');
  const quickValue = quickHabit ? todayProgress[quickHabit.id] ?? 0 : 0;
  const quickLabel = quickHabit
    ? quickValue > 0
      ? quickHabit.stepLabels?.[quickValue - 1] ?? `${quickValue}`
      : '—'
    : '—';
  const quickTarget = quickHabit
    ? `${quickHabit.stepLabels?.[quickHabit.steps - 1] ?? quickHabit.steps}`
    : '';

  const focusMins = Math.floor(focus.secondsLeft / 60);
  const focusSecs = focus.secondsLeft % 60;
  const focusTime = `${String(focusMins).padStart(2, '0')}:${String(focusSecs).padStart(2, '0')}`;

  return (
    <>
      {/* Date */}
      <div className="flex items-baseline gap-2.5 pb-2.5 pt-1">
        <div className="font-mono font-medium text-[38px] leading-none tracking-[-0.04em] text-white/85">{dayNum}</div>
        <div className="flex flex-col gap-0.5">
          <div className="serif-it text-[13px] text-white/30">{dayName}</div>
          <div className="font-mono font-light text-[8px] tracking-[0.14em] uppercase text-white/[0.15]">
            {monthYear}
          </div>
        </div>
      </div>

      {/* Rings + stats */}
      <div className="flex items-center gap-3.5 pb-2.5">
        <div className="relative h-[148px] w-[148px] shrink-0">
          <TripleRing life={s.life} habits={s.habits} work={s.work} onTap={goTo} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[26px] leading-none tracking-[-0.04em] text-white/85">{s.today}</div>
            <div className="font-mono font-light text-[7px] tracking-[0.2em] uppercase text-white/20">Today</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          {[
            { id: 'life', name: 'Life', v: s.life, fill: 'rgba(255,255,255,0.6)' },
            { id: 'habits', name: 'Habits', v: s.habits, fill: 'rgba(255,255,255,0.45)' },
            { id: 'work', name: 'Work', v: s.work, fill: 'rgba(255,255,255,0.26)' },
          ].map((r) => (
            <div
              key={r.id}
              onClick={() => goTo(r.id)}
              className="flex cursor-pointer flex-col gap-1 rounded-lg px-1.5 py-0.5 active:bg-white/[0.04]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-light text-[7.5px] tracking-[0.16em] uppercase text-white/[0.22]">
                  {r.name}
                </span>
                <span className="font-mono text-[15px] tracking-[-0.02em] text-white/50">{r.v}%</span>
              </div>
              <div className="h-[1.5px] rounded-[1px] bg-white/[0.07]">
                <div className="h-full rounded-[1px]" style={{ width: `${r.v}%`, background: r.fill }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hairline my-2" />

      {/* Quick actions */}
      <div className="mb-2.5 flex gap-1.5">
        <QA
          onClick={() => {
            if (!quickHabit) return goTo('habits');
            quickHabit.type === 'progressive' ? bumpProgressive(quickHabit.id) : toggleSimpleHabit(quickHabit.id);
          }}
        >
          {quickHabit ? renderHabitIcon(quickHabit.icon, 13, 'rgba(255,255,255,0.5)') : <DropIcon />}
          <div className="label !text-[7px] mt-1">{quickHabit?.name ?? 'Habit'}</div>
          <div className="font-mono text-[12px] leading-tight tracking-[-0.01em] text-white/55">
            {quickLabel}{quickTarget ? `/${quickTarget}` : ''}
          </div>
          <Btn>+1 step</Btn>
        </QA>
        <QA onClick={() => goTo('habits')}>
          <CheckIcon />
          <div className="label !text-[7px] mt-1">Habits</div>
          <div className="font-mono text-[12px] leading-tight tracking-[-0.01em] text-white/55">
            {completion.done}/{completion.total}
          </div>
          <Btn>Log</Btn>
        </QA>
        <QA onClick={() => goTo('focus')}>
          <FocusIcon />
          <div className="label !text-[7px] mt-1">Focus</div>
          <div className="font-mono text-[12px] leading-tight tracking-[-0.01em] text-white/55">{focusTime}</div>
          <Btn>Start</Btn>
        </QA>
      </div>

      {/* Briefing */}
      <div className="mb-2 overflow-hidden rounded-[13px] border border-white/[0.06] bg-white/[0.018]">
        <div className="flex justify-between border-b border-white/[0.04] px-3 pt-2 pb-1.5">
          <span className="font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.22]">
            AI Briefing
          </span>
          <span className="font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/[0.12]">
            View all
          </span>
        </div>
        {briefing.slice(0, 3).map((b, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-3 py-1.5 transition active:bg-white/[0.025] ${
              i < 2 ? 'border-b border-white/[0.03]' : ''
            }`}
          >
            <span className="min-w-[22px] pt-[1.5px] font-mono font-light text-[7px] tracking-[0.1em] uppercase text-white/[0.18]">
              {b.tag}
            </span>
            <span className="flex-1 font-sans font-thin text-[10px] leading-[1.4] text-white/[0.38]">
              {b.text}
            </span>
            <div className="shrink-0 pt-1 opacity-15">
              <Chevron stroke="rgba(255,255,255,0.4)" />
            </div>
          </div>
        ))}
      </div>

      {/* Podcast */}
      <div className="mb-2 overflow-hidden rounded-[13px] border border-white/[0.06] bg-white/[0.018]">
        <div className="flex justify-between border-b border-white/[0.04] px-3 pt-2 pb-1.5">
          <span className="font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.22]">
            Listen
          </span>
          <span className="font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/[0.12]">
            Recommended
          </span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04]">
            <PodcastIcon />
          </div>
          <div className="flex-1">
            <div className="mb-1 font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/[0.18]">
              {podcast.show} · {podcast.episode}
            </div>
            <div className="font-sans font-thin text-[10.5px] leading-[1.3] text-white/40">{podcast.description}</div>
            <div className="mt-0.5 font-mono font-light text-[7.5px] tracking-[0.08em] text-white/[0.15]">
              {podcast.duration}
            </div>
          </div>
          <div className="flex h-[28px] w-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10">
            <PlayIcon />
          </div>
        </div>
      </div>

      {/* Year */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="shrink-0 font-mono font-light text-[7.5px] tracking-[0.14em] uppercase text-white/[0.12]">Year</span>
        <div className="relative h-px flex-1 bg-white/[0.06]">
          <div className="relative h-full bg-white/[0.28]" style={{ width: `${yp}%` }}>
            <div className="absolute -right-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-white/[0.45] shadow-[0_0_4px_rgba(255,255,255,0.2)]" />
          </div>
        </div>
        <span className="shrink-0 font-mono font-light text-[7.5px] tracking-[0.06em] text-white/[0.16]">
          {yp.toFixed(1)}%
        </span>
      </div>
    </>
  );
}

const QA = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-1 cursor-pointer flex-col gap-0.5 rounded-[13px] border border-white/[0.07] bg-white/[0.025] p-2.5 transition active:border-white/15"
  >
    {children}
  </div>
);

const Btn = ({ children }) => (
  <div className="mt-0.5 rounded-[5px] border border-white/[0.07] bg-white/[0.05] px-1.5 py-0.5 text-center font-mono font-light text-[7px] tracking-[0.1em] uppercase text-white/[0.22]">
    {children}
  </div>
);
