import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore, habitMet } from '../store.js';
import { renderHabitIcon } from '../lib/icons.jsx';
import HabitEditor from './HabitEditor.jsx';
import { todayKey } from '../lib/dates.js';

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

const fmt = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

export default function HabitDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const habit = useStore((s) => s.habits.find((h) => h.id === id));
  const dailyLogs = useStore((s) => s.dailyLogs);
  const todayProgress = useStore((s) => s.todayProgress);
  const streaks = useStore((s) => s.streaks);
  const updateHabit = useStore((s) => s.updateHabit);
  const deleteHabit = useStore((s) => s.deleteHabit);

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [picked, setPicked] = useState(todayKey());

  const dates = useMemo(() => lastNDates(30), []);
  const today = todayKey();

  if (!habit) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        Habit not found.
      </div>
    );
  }

  const s = streaks[habit.id] ?? { current: 0, longest: 0, totalCompletions: 0 };
  const valueFor = (k) => (k === today ? todayProgress[habit.id] : dailyLogs[k]?.[habit.id]);

  const completionPct = useMemo(() => {
    let met = 0;
    dates.forEach((d) => {
      if (habitMet(habit, valueFor(ymd(d)))) met++;
    });
    return Math.round((met / dates.length) * 100);
  }, [dates, habit, dailyLogs, todayProgress]);

  return (
    <div
      className="relative w-screen overflow-hidden bg-bg pt-[max(env(safe-area-inset-top),2.75rem)]"
      style={{ height: '100dvh' }}
    >
      <div className="h-full overflow-y-auto px-[18px] pt-1.5 pb-24">
        <div className="flex items-center justify-between pt-1 pb-3">
          <span className="font-mono font-normal text-[12px] tracking-[0.2em] uppercase text-white/55">
            Detail
          </span>
          <button
            onClick={() => nav('/app/habits')}
            className="font-mono font-light text-[8px] tracking-[0.12em] uppercase text-white/[0.4]"
          >
            ← Habits
          </button>
        </div>

        <div className="flex items-center gap-3 pb-3">
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04]">
            {renderHabitIcon(habit.icon, 26, 'rgba(255,255,255,0.7)')}
          </div>
          <div className="flex-1">
            <div className="font-sans font-thin text-[20px] leading-tight text-white/85">{habit.name}</div>
            <div className="mt-0.5 font-mono font-light text-[8.5px] tracking-[0.14em] uppercase text-white/[0.3]">
              {habit.type === 'progressive'
                ? `${habit.steps} steps · target ${habit.targetStep}`
                : 'Simple toggle'}
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="rounded-[8px] border border-white/[0.1] px-2.5 py-1.5 font-mono text-[8px] tracking-[0.16em] uppercase text-white/55"
          >
            Edit
          </button>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-1.5">
          <Stat label="Current" value={`${s.current}d`} />
          <Stat label="Best" value={`${s.longest}d`} />
          <Stat label="Total" value={s.totalCompletions} />
        </div>
        <div className="mb-3 grid grid-cols-1">
          <Stat label="Completion · 30d" value={`${completionPct}%`} />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.4]">
            Last 30 days
          </span>
          <span className="font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/[0.18]">
            Tap to inspect
          </span>
        </div>

        <div className="grid grid-cols-10 gap-[6px]">
          {dates.map((d) => {
            const k = ymd(d);
            const v = valueFor(k);
            const met = habitMet(habit, v);
            const some = !met && (v ?? 0) > 0;
            const isToday = k === today;
            const isPicked = k === picked;
            return (
              <button
                key={k}
                onClick={() => setPicked(k)}
                className="relative flex items-center justify-center"
                style={{ minHeight: 24, minWidth: 24 }}
              >
                <span
                  className="block rounded-full transition"
                  style={{
                    width: isToday ? 12 : 10,
                    height: isToday ? 12 : 10,
                    background: met ? '#fff' : some ? 'rgba(255,255,255,0.45)' : 'transparent',
                    border: met || some ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: met
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
            {fmt(dates.find((d) => ymd(d) === picked) ?? new Date())}
          </div>
          <div className="mt-1 font-sans font-thin text-[10.5px] leading-[1.45] text-white/55">
            {(() => {
              const v = valueFor(picked);
              if (v == null) return 'No data for this day.';
              if (habit.type === 'progressive') {
                if (v === 0) return 'Not started.';
                const lbl = habit.stepLabels?.[v - 1] ?? `Step ${v}`;
                const okMet = v >= habit.targetStep;
                return `${lbl}${okMet ? ' · Goal met' : ''}`;
              }
              return v === 1 ? 'Done' : 'Not done';
            })()}
          </div>
        </div>
      </div>

      <HabitEditor
        open={editing}
        initial={habit}
        onClose={() => setEditing(false)}
        onSave={(patch) => {
          updateHabit(habit.id, patch);
          setEditing(false);
        }}
        onDelete={() => {
          setEditing(false);
          setConfirm(true);
        }}
      />

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-xs rounded-[14px] border border-white/[0.08] bg-bg px-5 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/75">Delete habit?</div>
            <div className="mt-2 font-sans font-thin text-[11px] leading-[1.5] text-white/45">
              "{habit.name}" will be removed. Past history is kept.
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 rounded-[8px] border border-white/[0.08] py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHabit(habit.id);
                  nav('/app/habits');
                }}
                className="flex-1 rounded-[8px] border border-white/30 bg-white/10 py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/85"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
    <div className="font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/[0.3]">{label}</div>
    <div className="mt-1 font-mono font-medium text-[14px] tracking-[-0.02em] text-white/75">{value}</div>
  </div>
);
