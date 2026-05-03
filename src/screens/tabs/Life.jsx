import React from 'react';
import { useStore, scores } from '../../store.js';
import { SingleRing } from '../../components/Ring.jsx';
import { SleepIcon, StepsIcon, PhoneOutline, MindIcon, HealthIcon } from '../../components/Icon.jsx';
import PageHeader from './PageHeader.jsx';

const StatRow = ({ Icon, label, value, pct }) => (
  <div className="flex items-center gap-2.5 border-b border-white/[0.04] py-2 last:border-b-0">
    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
      <Icon />
    </div>
    <div className="flex-1">
      <div className="mb-1 font-sans font-thin text-[11px] text-white/40">{label}</div>
      <div className="h-[1.5px] rounded-[1px] bg-white/[0.07]">
        <div className="h-full rounded-[1px] bg-white/[0.45]" style={{ width: `${pct}%` }} />
      </div>
    </div>
    <div className="min-w-[40px] text-right font-mono font-light text-[10px] text-white/[0.22]">{value}</div>
  </div>
);

export default function Life({ goTo }) {
  const state = useStore();
  const s = scores(state);

  return (
    <>
      <PageHeader title="Life" goTo={goTo} />
      <div className="flex flex-col items-center pb-3 pt-2">
        <div className="relative h-[140px] w-[140px]">
          <SingleRing pct={s.life} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[38px] leading-none tracking-[-0.04em] text-white/85">
              {s.life}%
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/20">Life</div>
          </div>
        </div>
      </div>

      <StatRow Icon={SleepIcon} label="Sleep" value="7.2h" pct={90} />
      <StatRow Icon={StepsIcon} label="Steps" value="4,200" pct={53} />
      <StatRow Icon={PhoneOutline} label="Screen time" value="42m" pct={47} />
      <StatRow Icon={MindIcon} label="Mindfulness" value="0m" pct={0} />

      <div className="my-2 rounded-[10px] border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
        <div className="font-sans font-thin text-[10px] leading-[1.55] text-white/[0.22]">
          Sleep and screen time looking good. Steps at 53% — try a short walk before the shoot this afternoon.
        </div>
      </div>

      <div className="mb-1.5 flex items-center gap-2 rounded-[9px] border border-dashed border-white/[0.05] px-2.5 py-2">
        <HealthIcon />
        <div className="font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/10">
          Apple Health · Auto-sync
        </div>
        <div className="ml-auto rounded-[3px] border border-white/[0.07] px-1.5 py-0.5 font-mono font-light text-[7px] tracking-[0.1em] uppercase text-white/10">
          Soon
        </div>
      </div>
    </>
  );
}
