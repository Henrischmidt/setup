import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Hub from './tabs/Hub.jsx';
import Life from './tabs/Life.jsx';
import Habits from './tabs/Habits.jsx';
import Work from './tabs/Work.jsx';
import Focus from './tabs/Focus.jsx';
import { HubIcon, LifeIcon, HabitsIcon, WorkIcon, FocusNavIcon } from '../components/Icon.jsx';

const TABS = [
  { id: 'hub', label: 'Hub', Icon: HubIcon, View: Hub },
  { id: 'life', label: 'Life', Icon: LifeIcon, View: Life },
  { id: 'habits', label: 'Habits', Icon: HabitsIcon, View: Habits },
  { id: 'work', label: 'Work', Icon: WorkIcon, View: Work },
  { id: 'focus', label: 'Focus', Icon: FocusNavIcon, View: Focus },
];

export default function AppShell() {
  const { tab = 'hub' } = useParams();
  const nav = useNavigate();
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const View = active.View;

  return (
    <div
      className="relative w-screen overflow-hidden bg-bg pt-[max(env(safe-area-inset-top),2.75rem)]"
      style={{ height: '100dvh' }}
    >
      <div
        className="h-full overflow-y-auto overscroll-contain px-[18px] pt-1.5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        <View goTo={(id) => nav(`/app/${id}`)} />
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-white/[0.06] bg-bg/95 px-1.5 pt-2 backdrop-blur"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        {TABS.map((t) => {
          const on = t.id === active.id;
          return (
            <button
              key={t.id}
              onClick={() => nav(`/app/${t.id}`)}
              className={`min-w-[44px] flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition active:bg-white/[0.04] ${
                on ? 'text-white/85' : 'text-white/40'
              }`}
            >
              <t.Icon />
              <span
                className={`font-mono font-light text-[8px] tracking-[0.12em] uppercase ${
                  on ? 'text-white/80' : 'text-white/35'
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
