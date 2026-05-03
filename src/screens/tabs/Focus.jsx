import React, { useEffect } from 'react';
import { useStore } from '../../store.js';
import { FocusRing } from '../../components/Ring.jsx';
import { PauseIcon, PlayBig } from '../../components/Icon.jsx';
import PageHeader from './PageHeader.jsx';

const MODE_DURATIONS = { deep: 25 * 60, short: 5 * 60, long: 50 * 60 };
const MODE_LABEL = { deep: 'Deep Work', short: 'Short Break', long: 'Long Work' };

export default function Focus({ goTo }) {
  const focus = useStore((s) => s.focus);
  const setFocusMode = useStore((s) => s.setFocusMode);
  const tickFocus = useStore((s) => s.tickFocus);
  const toggleFocus = useStore((s) => s.toggleFocus);

  useEffect(() => {
    if (!focus.running) return;
    const id = setInterval(tickFocus, 1000);
    return () => clearInterval(id);
  }, [focus.running, tickFocus]);

  const total = MODE_DURATIONS[focus.mode];
  const pct = focus.secondsLeft / total;
  const m = Math.floor(focus.secondsLeft / 60);
  const sec = focus.secondsLeft % 60;
  const display = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  return (
    <>
      <PageHeader title="Focus" goTo={goTo} />
      <div className="flex flex-col items-center pb-3 pt-4">
        <div className="relative h-[170px] w-[170px]">
          <FocusRing pct={pct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="font-mono font-medium text-[34px] leading-none tracking-[-0.03em] text-white/85">
              {display}
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/20">
              {MODE_LABEL[focus.mode]}
            </div>
          </div>
        </div>
        <div
          onClick={toggleFocus}
          className="my-2 flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/20 active:bg-white/[0.07]"
        >
          {focus.running ? <PauseIcon /> : <PlayBig />}
        </div>
      </div>

      <div className="mb-2 text-center font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.18]">
        Select Mode
      </div>

      <div className="mt-1 flex w-full gap-2">
        {[
          { id: 'deep', t: 'Deep', d: '25 min' },
          { id: 'short', t: 'Break', d: '5 min' },
          { id: 'long', t: 'Long', d: '50 min' },
        ].map((m) => {
          const on = focus.mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setFocusMode(m.id)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-[10px] border px-2 py-2.5 transition ${
                on ? 'border-white/25 bg-white/[0.04]' : 'border-white/[0.07]'
              } active:bg-white/[0.04]`}
            >
              <span className="font-mono font-light text-[7.5px] tracking-[0.12em] uppercase text-white/35">
                {m.t}
              </span>
              <span className="font-mono font-light text-[8.5px] tracking-[0.08em] text-white/[0.18]">{m.d}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
