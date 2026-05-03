import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey, yesterdayKey } from './lib/dates';

const defaultTasks = [
  { id: 't1', text: 'Review VDO Africa pipeline', done: false },
  { id: 't2', text: 'Send investor update draft', done: false },
  { id: 't3', text: 'Approve podcast cover art', done: false },
  { id: 't4', text: 'Sync with N8N automation logs', done: false },
];

const blankHabits = () => ({
  water: 0, // 0..4 segments (0.5L each => 2L total)
  pushups: 0, // 0..4 segments (5,10,15,20)
  stretch: false,
});

export const useStore = create(
  persist(
    (set, get) => ({
      dayKey: todayKey(),
      habits: blankHabits(),
      streak: 0,
      tasks: defaultTasks,
      briefing: null, // { dateKey, items: [{tag,text}] }
      podcast: null, // { dateKey, show, episode, duration, description }
      focus: { mode: 'deep', secondsLeft: 25 * 60, running: false },

      // Apply midnight rollover; called on app load + every minute.
      maybeRollover: () => {
        const cur = todayKey();
        const prev = get().dayKey;
        if (cur === prev) return;
        // determine streak for the day that just ended
        const h = get().habits;
        const allDone = h.water >= 4 && h.pushups >= 4 && h.stretch;
        const wasYesterday = prev === yesterdayKey();
        const newStreak = wasYesterday && allDone ? get().streak + 1 : allDone ? 1 : 0;
        set({
          dayKey: cur,
          habits: blankHabits(),
          streak: newStreak,
          tasks: get().tasks.map((t) => ({ ...t, done: false })),
        });
      },

      // Habit actions
      tapWater: (n) => set((s) => ({ habits: { ...s.habits, water: s.habits.water === n ? n - 1 : n } })),
      tapPushups: (n) => set((s) => ({ habits: { ...s.habits, pushups: s.habits.pushups === n ? n - 1 : n } })),
      toggleStretch: () => set((s) => ({ habits: { ...s.habits, stretch: !s.habits.stretch } })),

      // Tasks
      toggleTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),

      // Cache setters
      setBriefing: (items) => set({ briefing: { dateKey: todayKey(), items } }),
      setPodcast: (p) => set({ podcast: { dateKey: todayKey(), ...p } }),

      // Focus
      setFocusMode: (mode) => {
        const map = { deep: 25 * 60, short: 5 * 60, long: 50 * 60 };
        set({ focus: { mode, secondsLeft: map[mode], running: false } });
      },
      tickFocus: () =>
        set((s) => {
          if (!s.focus.running) return s;
          const next = Math.max(0, s.focus.secondsLeft - 1);
          return { focus: { ...s.focus, secondsLeft: next, running: next > 0 } };
        }),
      toggleFocus: () => set((s) => ({ focus: { ...s.focus, running: !s.focus.running } })),
      resetFocus: () => {
        const map = { deep: 25 * 60, short: 5 * 60, long: 50 * 60 };
        set((s) => ({ focus: { mode: s.focus.mode, secondsLeft: map[s.focus.mode], running: false } }));
      },
    }),
    {
      name: 'cam-os-state',
      version: 1,
    }
  )
);

// Derived scores (pure helpers, not in store)
export const scores = (state) => {
  // Life: hardcoded composite (sleep/steps/screen/mindfulness baseline) since no Apple Health yet
  const life = 76;
  const h = state.habits;
  const habitsPct = Math.round(((h.water / 4) * 0.4 + (h.pushups / 4) * 0.4 + (h.stretch ? 0.2 : 0)) * 100);
  const total = state.tasks.length || 1;
  const done = state.tasks.filter((t) => t.done).length;
  const work = Math.round((done / total) * 100);
  const today = Math.round((life + habitsPct + work) / 3);
  return { life, habits: habitsPct, work, today };
};
