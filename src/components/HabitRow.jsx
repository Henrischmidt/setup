import React from 'react';
import { renderHabitIcon } from '../lib/icons.jsx';

// Segment with a 44px-tall invisible hit area for touch.
const TapSeg = ({ on, full, onTap }) => (
  <div
    onClick={onTap}
    role="button"
    className="relative flex flex-1 cursor-pointer select-none items-center"
    style={{ minHeight: 44 }}
  >
    <div
      className="h-[2px] w-full rounded-[1px]"
      style={{
        background: full ? '#fff' : on ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.07)',
        boxShadow: full ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
      }}
    />
  </div>
);

export default function HabitRow({ habit, value = 0, onTapStep, onToggleSimple, onOpen, met }) {
  const isProgressive = habit.type === 'progressive';
  const valueLabel = isProgressive
    ? value > 0
      ? habit.stepLabels?.[value - 1] ?? value
      : habit.stepLabels?.[0]?.replace(/[\d.]+/, '0') ?? '0'
    : value === 1
    ? 'Done'
    : '—';

  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.04] py-1.5 last:border-b-0">
      <button
        onClick={onOpen}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] active:bg-white/[0.08]"
        aria-label={`Open ${habit.name}`}
      >
        {renderHabitIcon(habit.icon, 14, 'rgba(255,255,255,0.4)')}
      </button>
      <div className="flex-1">
        <button
          onClick={onOpen}
          className="block text-left font-sans font-thin text-[12px] text-white/55 active:text-white/80"
        >
          {habit.name}
        </button>
        {isProgressive ? (
          <div className="mt-0.5 flex items-stretch gap-[3px]">
            {Array.from({ length: habit.steps }, (_, i) => {
              const n = i + 1;
              const on = n <= value;
              const full = met && n === habit.steps;
              return <TapSeg key={n} on={on} full={full} onTap={() => onTapStep(n)} />;
            })}
          </div>
        ) : (
          <div
            className="relative mt-0.5 flex items-center"
            onClick={onToggleSimple}
            style={{ minHeight: 44, cursor: 'pointer' }}
            role="button"
          >
            <div
              className="h-[2px] w-full rounded-[1px]"
              style={{
                background: value === 1 ? '#fff' : 'rgba(255,255,255,0.07)',
                boxShadow: value === 1 ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
              }}
            />
          </div>
        )}
      </div>
      <div className="ml-1 flex items-center gap-2">
        <div className="min-w-[34px] text-right font-mono font-light text-[10px] text-white/[0.32]">
          {valueLabel}
        </div>
        {!isProgressive && (
          <div
            onClick={onToggleSimple}
            className={`flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border ${
              value === 1 ? 'border-white/45 bg-white/[0.08]' : 'border-white/[0.18]'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            {value === 1 && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1.5,4.5 4,7 7.5,2" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
