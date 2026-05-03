import React from 'react';
import { useStore, scores } from '../../store.js';
import { SingleRing } from '../../components/Ring.jsx';
import { DropIcon, PushupIcon, StretchIcon, FlameIcon } from '../../components/Icon.jsx';
import PageHeader from './PageHeader.jsx';

const Seg = ({ on, full, onClick }) => (
  <div onClick={onClick} className="relative h-[2px] flex-1 cursor-pointer rounded-[1px]" style={{
    background: full ? '#fff' : on ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.07)',
    boxShadow: full ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
  }}>
    <div className="absolute -inset-y-2 inset-x-0" />
  </div>
);

const HabRow = ({ Icon, label, value, segs, count, max, onSegClick }) => (
  <div className="flex items-center gap-2.5 border-b border-white/[0.04] py-2 last:border-b-0">
    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
      <Icon />
    </div>
    <div className="flex-1">
      <div className="mb-1 font-sans font-thin text-[11px] text-white/40">{label}</div>
      <div className="flex gap-[3px]">
        {segs.map((s, i) => (
          <Seg key={i} on={s.on} full={s.full} onClick={() => onSegClick(i + 1)} />
        ))}
      </div>
    </div>
    <div className="min-w-[34px] text-right font-mono font-light text-[10px] text-white/[0.22]">{value}</div>
  </div>
);

const wL = ['0L', '0.5L', '1L', '1.5L', '2L'];
const pL = ['0', '5', '10', '15', '20'];

export default function Habits({ goTo }) {
  const state = useStore();
  const tapWater = useStore((s) => s.tapWater);
  const tapPushups = useStore((s) => s.tapPushups);
  const toggleStretch = useStore((s) => s.toggleStretch);
  const s = scores(state);

  const waterSegs = [1, 2, 3, 4].map((n) => ({
    on: n <= state.habits.water,
    full: state.habits.water === 4 && n === 4,
  }));
  const pushSegs = [1, 2, 3, 4].map((n) => ({
    on: n <= state.habits.pushups,
    full: state.habits.pushups === 4 && n === 4,
  }));

  const done =
    (state.habits.water >= 4 ? 1 : 0) + (state.habits.pushups >= 4 ? 1 : 0) + (state.habits.stretch ? 1 : 0);
  const allDone = done === 3;
  const insight = allDone
    ? 'All 3 habits done. Streak extended.'
    : `${done} of 3 habits done. ${
        done === 0 ? 'Start with water — easiest win.' : 'Keep going to extend your streak.'
      }`;

  return (
    <>
      <PageHeader title="Habits" goTo={goTo} />
      <div className="flex flex-col items-center pb-3 pt-2">
        <div className="relative h-[140px] w-[140px]">
          <SingleRing pct={s.habits} stroke="rgba(255,255,255,0.6)" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[38px] leading-none tracking-[-0.04em] text-white/85">
              {s.habits}%
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/20">Habits</div>
          </div>
        </div>
      </div>

      <HabRow
        Icon={DropIcon}
        label="Water"
        value={wL[state.habits.water]}
        segs={waterSegs}
        onSegClick={(n) => tapWater(n)}
      />
      <HabRow
        Icon={PushupIcon}
        label="Push-ups"
        value={pL[state.habits.pushups]}
        segs={pushSegs}
        onSegClick={(n) => tapPushups(n)}
      />

      {/* Stretch */}
      <div className="flex cursor-pointer items-center gap-2.5 border-b border-white/[0.04] py-2" onClick={toggleStretch}>
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
          <StretchIcon />
        </div>
        <div className="flex-1">
          <div className="mb-1 font-sans font-thin text-[11px] text-white/40">Stretch</div>
          <div className="flex gap-[3px]">
            <div
              className="h-[2px] flex-1 rounded-[1px]"
              style={{
                background: state.habits.stretch ? '#fff' : 'rgba(255,255,255,0.07)',
                boxShadow: state.habits.stretch ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
              }}
            />
          </div>
        </div>
        <div
          className={`flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full border ${
            state.habits.stretch ? 'border-white/45 bg-white/[0.08]' : 'border-white/[0.12]'
          }`}
        >
          {state.habits.stretch && (
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1,3.5 3,5.5 6,1.5" />
            </svg>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.04] py-2">
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
          <FlameIcon />
        </div>
        <div className="flex-1">
          <div className="mb-1 font-sans font-thin text-[11px] text-white/[0.18]">—</div>
        </div>
        <div
          className="min-w-[34px] text-right serif-it text-[22px]"
          style={{ color: allDone ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)' }}
        >
          {state.streak}
        </div>
      </div>

      <div className="my-2 rounded-[10px] border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
        <div className="font-sans font-thin text-[10px] leading-[1.55] text-white/[0.22]">{insight}</div>
      </div>
    </>
  );
}
