import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey, yesterdayKey } from './lib/dates';

const defaultTasks = [
  { id: 't1', text: 'Review VDO Africa pipeline', done: false },
  { id: 't2', text: 'Send investor update draft', done: false },
  { id: 't3', text: 'Approve podcast cover art', done: false },
  { id: 't4', text: 'Sync with N8N automation logs', done: false },
];

export const DEFAULT_HABITS = [
  {
    id: 'water',
    name: 'Water',
    type: 'progressive',
    steps: 4,
    stepLabels: ['0.5L', '1L', '1.5L', '2L'],
    targetStep: 4,
    icon: 'drop',
    createdAt: '2024-01-01',
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    type: 'progressive',
    steps: 4,
    stepLabels: ['5', '10', '15', '20'],
    targetStep: 4,
    icon: 'dumbbell',
    createdAt: '2024-01-01',
  },
  {
    id: 'stretch',
    name: 'Stretch',
    type: 'simple',
    icon: 'stretch',
    createdAt: '2024-01-01',
  },
];

const blankStreak = () => ({ current: 0, longest: 0, totalCompletions: 0 });

const isMet = (habit, value) => {
  if (!habit) return false;
  if (habit.type === 'simple') return value === 1;
  return (value ?? 0) >= (habit.targetStep ?? habit.steps ?? 1);
};

const newId = () => `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const useStore = create(
  persist(
    (set, get) => ({
      dayKey: todayKey(),
      habits: DEFAULT_HABITS,
      todayProgress: {}, // { [habitId]: number }
      dailyLogs: {}, // { 'YYYY-MM-DD': { [habitId]: stepReached } }
      streaks: {}, // { [habitId]: { current, longest, totalCompletions } }
      overallStreak: 0,
      tasks: defaultTasks,
      briefing: null,
      podcast: null,
      focus: { mode: 'deep', secondsLeft: 25 * 60, running: false },

      // ── ROLLOVER ────────────────────────────────────────────
      maybeRollover: () => {
        const cur = todayKey();
        const prev = get().dayKey;
        if (cur === prev) return;

        const { habits, todayProgress, dailyLogs, streaks, overallStreak } = get();
        const yKey = yesterdayKey();
        const wasYesterday = prev === yKey;

        const newLogs = { ...dailyLogs, [prev]: { ...todayProgress } };
        const newStreaks = { ...streaks };
        let allMet = habits.length > 0;

        habits.forEach((h) => {
          const v = todayProgress[h.id] ?? 0;
          const met = isMet(h, v);
          const prevS = newStreaks[h.id] ?? blankStreak();
          if (met) {
            const next = wasYesterday ? prevS.current + 1 : 1;
            newStreaks[h.id] = {
              current: next,
              longest: Math.max(prevS.longest, next),
              totalCompletions: prevS.totalCompletions + 1,
            };
          } else {
            newStreaks[h.id] = { ...prevS, current: 0 };
            allMet = false;
          }
        });

        const nextOverall = allMet ? (wasYesterday ? overallStreak + 1 : 1) : 0;

        set({
          dayKey: cur,
          todayProgress: {},
          dailyLogs: newLogs,
          streaks: newStreaks,
          overallStreak: nextOverall,
          tasks: get().tasks.map((t) => ({ ...t, done: false })),
        });
      },

      // ── HABIT ACTIONS ────────────────────────────────────────
      tapHabitStep: (id, n) =>
        set((s) => {
          const cur = s.todayProgress[id] ?? 0;
          const next = cur === n ? n - 1 : n;
          return { todayProgress: { ...s.todayProgress, [id]: next } };
        }),
      toggleSimpleHabit: (id) =>
        set((s) => {
          const cur = s.todayProgress[id] ?? 0;
          return { todayProgress: { ...s.todayProgress, [id]: cur === 1 ? 0 : 1 } };
        }),
      bumpProgressive: (id) =>
        set((s) => {
          const habit = s.habits.find((h) => h.id === id);
          if (!habit || habit.type !== 'progressive') return s;
          const cur = s.todayProgress[id] ?? 0;
          const next = Math.min(habit.steps, cur + 1);
          return { todayProgress: { ...s.todayProgress, [id]: next } };
        }),

      // ── HABIT MGMT ───────────────────────────────────────────
      addHabit: (h) =>
        set((s) => ({
          habits: [...s.habits, { id: newId(), createdAt: new Date().toISOString(), ...h }],
        })),
      updateHabit: (id, patch) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)) })),
      deleteHabit: (id) =>
        set((s) => {
          const nextProgress = { ...s.todayProgress };
          delete nextProgress[id];
          const nextStreaks = { ...s.streaks };
          delete nextStreaks[id];
          return {
            habits: s.habits.filter((h) => h.id !== id),
            todayProgress: nextProgress,
            streaks: nextStreaks,
          };
        }),
      reorderHabits: (ids) =>
        set((s) => ({ habits: ids.map((i) => s.habits.find((h) => h.id === i)).filter(Boolean) })),

      // ── TASKS ───────────────────────────────────────────────
      toggleTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),

      // ── BRIEFING / PODCAST ──────────────────────────────────
      setBriefing: (items) => set({ briefing: { dateKey: todayKey(), items } }),
      setPodcast: (p) => set({ podcast: { dateKey: todayKey(), ...p } }),

      // ── FOCUS ───────────────────────────────────────────────
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
      version: 3,
      migrate: (persisted, fromVersion) => {
        if (!persisted) return persisted;
        let s = persisted;
        // v1 -> v2: add habitHistory (we drop this in v3 anyway)
        // v2 -> v3: convert legacy { water, pushups, stretch } shape into dynamic model
        if (fromVersion < 3) {
          const legacy = s.habits ?? {};
          const legacyHistory = s.habitHistory ?? {};
          const dailyLogs = {};
          Object.keys(legacyHistory).forEach((dk) => {
            const h = legacyHistory[dk] ?? {};
            dailyLogs[dk] = {
              water: h.water ?? 0,
              pushups: h.pushups ?? 0,
              stretch: h.stretch ? 1 : 0,
            };
          });
          s = {
            ...s,
            habits: DEFAULT_HABITS,
            todayProgress: {
              water: legacy.water ?? 0,
              pushups: legacy.pushups ?? 0,
              stretch: legacy.stretch ? 1 : 0,
            },
            dailyLogs,
            streaks: {},
            overallStreak: s.streak ?? 0,
          };
          delete s.habitHistory;
          delete s.streak;
        }
        return s;
      },
    }
  )
);

// ── SELECTORS / DERIVED ────────────────────────────────────
export const habitMet = (habit, value) => isMet(habit, value);

export const habitsCompletionToday = (state) => {
  const list = state.habits ?? [];
  if (!list.length) return { done: 0, total: 0, pct: 0 };
  const done = list.reduce((acc, h) => acc + (isMet(h, state.todayProgress[h.id]) ? 1 : 0), 0);
  return { done, total: list.length, pct: Math.round((done / list.length) * 100) };
};

export const scores = (state) => {
  const life = 76;
  const habits = habitsCompletionToday(state).pct;
  const total = state.tasks.length || 1;
  const done = state.tasks.filter((t) => t.done).length;
  const work = Math.round((done / total) * 100);
  const today = Math.round((life + habits + work) / 3);
  return { life, habits, work, today };
};
