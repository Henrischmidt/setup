import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, scores, habitsCompletionToday, habitMet } from '../../store.js';
import { SingleRing } from '../../components/Ring.jsx';
import HabitRow from '../../components/HabitRow.jsx';
import DotGrid from '../../components/DotGrid.jsx';
import PageHeader from './PageHeader.jsx';
import { renderHabitIcon } from '../../lib/icons.jsx';

export default function Habits({ goTo }) {
  const nav = useNavigate();
  const habits = useStore((s) => s.habits);
  const todayProgress = useStore((s) => s.todayProgress);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const streaks = useStore((s) => s.streaks);
  const overallStreak = useStore((s) => s.overallStreak);
  const tapHabitStep = useStore((s) => s.tapHabitStep);
  const toggleSimpleHabit = useStore((s) => s.toggleSimpleHabit);
  const tasks = useStore((s) => s.tasks);

  const habitsPct = useMemo(() => habitsCompletionToday({ habits, todayProgress }).pct, [habits, todayProgress]);
  const completion = habitsCompletionToday({ habits, todayProgress });
  const allDone = completion.done === completion.total && completion.total > 0;

  const stats = useMemo(() => {
    const t = scores({ habits, todayProgress, tasks });
    return t;
  }, [habits, todayProgress, tasks]);

  const last30 = useMemo(() => {
    const out = [];
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(t);
      d.setDate(t.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      out.push(`${y}-${m}-${day}`);
    }
    return out;
  }, []);

  const completionRate = useMemo(() => {
    if (!habits.length) return 0;
    let metCount = 0;
    last30.forEach((k) => {
      const src = k === last30[last30.length - 1] ? todayProgress : dailyLogs[k];
      if (!src) return;
      const allMet = habits.every((h) => habitMet(h, src[h.id]));
      if (allMet) metCount++;
    });
    return Math.round((metCount / 30) * 100);
  }, [habits, dailyLogs, todayProgress, last30]);

  const bestStreak = useMemo(
    () => Math.max(overallStreak, ...habits.map((h) => streaks[h.id]?.longest ?? 0), 0),
    [overallStreak, streaks, habits]
  );

  return (
    <>
      <PageHeader
        title="Habits"
        goTo={goTo}
        right={
          <button
            onClick={() => nav('/app/manage')}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-white/[0.07] active:bg-white/[0.04]"
            aria-label="Manage habits"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="1.6" />
              <path d="M6.5 1.5v1.6M6.5 9.9v1.6M11.5 6.5h-1.6M3.1 6.5H1.5M10 3l-1.1 1.1M4.1 8.9 3 10M10 10 8.9 8.9M4.1 4.1 3 3" />
            </svg>
          </button>
        }
      />

      <div className="flex flex-col items-center pb-2 pt-1">
        <div className="relative h-[180px] w-[180px]">
          <SingleRing pct={stats.habits} stroke="rgba(255,255,255,0.6)" size={180} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[44px] leading-none tracking-[-0.04em] text-white/85">
              {stats.habits}%
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/30">Habits</div>
          </div>
        </div>
      </div>

      {habits.map((h) => (
        <HabitRow
          key={h.id}
          habit={h}
          value={todayProgress[h.id] ?? 0}
          met={habitMet(h, todayProgress[h.id])}
          onTapStep={(n) => tapHabitStep(h.id, n)}
          onToggleSimple={() => toggleSimpleHabit(h.id)}
          onOpen={() => nav(`/app/habit/${h.id}`)}
        />
      ))}

      {/* Silent streak (overall) — non-deletable, derived */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.04] py-1.5">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
          {renderHabitIcon('flame', 14, 'rgba(255,255,255,0.32)')}
        </div>
        <div className="flex-1 font-sans font-thin text-[12px] text-white/[0.22]">—</div>
        <div
          className="min-w-[34px] text-right font-mono font-medium text-[20px] tracking-[-0.02em]"
          style={{
            color: allDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
            textShadow: allDone ? '0 0 8px rgba(255,255,255,0.35)' : 'none',
          }}
        >
          {overallStreak}
        </div>
      </div>

      <div className="my-3 rounded-[10px] border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
        <div className="font-sans font-thin text-[10px] leading-[1.55] text-white/[0.4]">
          {allDone
            ? 'All habits done today. Streak extended.'
            : `${completion.done} of ${completion.total} habits done. ${
                completion.done === 0 ? 'Start with the easiest one.' : 'Keep going to extend your streak.'
              }`}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.4]">
          Last 30 days
        </span>
        <span className="font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/[0.18]">
          Tap to inspect
        </span>
      </div>

      <DotGrid habits={habits} dailyLogs={dailyLogs} todayProgress={todayProgress} days={30} />

      <div className="my-3 grid grid-cols-3 gap-1.5">
        <MicroStat label="Current" value={`${overallStreak} ${overallStreak === 1 ? 'day' : 'days'}`} />
        <MicroStat label="Best" value={`${bestStreak} ${bestStreak === 1 ? 'day' : 'days'}`} />
        <MicroStat label="Rate · 30d" value={`${completionRate}%`} />
      </div>
    </>
  );
}

const MicroStat = ({ label, value }) => (
  <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
    <div className="font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/[0.3]">{label}</div>
    <div className="mt-1 font-mono font-medium text-[14px] tracking-[-0.02em] text-white/75">{value}</div>
  </div>
);
