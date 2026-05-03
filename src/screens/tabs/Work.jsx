import React from 'react';
import { useStore, scores } from '../../store.js';
import { SingleRing } from '../../components/Ring.jsx';
import { N8nIcon, MailIcon } from '../../components/Icon.jsx';
import PageHeader from './PageHeader.jsx';

export default function Work({ goTo }) {
  const state = useStore();
  const toggleTask = useStore((s) => s.toggleTask);
  const s = scores(state);

  const done = state.tasks.filter((t) => t.done).length;
  const total = state.tasks.length;
  const open = total - done;

  return (
    <>
      <PageHeader title="Work" goTo={goTo} />
      <div className="flex flex-col items-center pb-3 pt-2">
        <div className="relative h-[140px] w-[140px]">
          <SingleRing pct={s.work} stroke="rgba(255,255,255,0.45)" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[38px] leading-none tracking-[-0.04em] text-white/85">
              {s.work}%
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/20">Work</div>
          </div>
        </div>
      </div>

      <div className="mb-2 font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.18]">
        Today's Top {total}
      </div>

      {state.tasks.map((t) => (
        <div
          key={t.id}
          onClick={() => toggleTask(t.id)}
          className="flex cursor-pointer items-center gap-2.5 border-b border-white/[0.04] py-2 last:border-b-0"
        >
          <div
            className={`h-[6px] w-[6px] shrink-0 rounded-full border ${
              t.done ? 'border-white/60 bg-white/60' : 'border-white/20 bg-white/[0.15]'
            }`}
          />
          <div className="flex-1">
            <div
              className={`font-sans font-thin text-[11px] ${
                t.done ? 'text-white/[0.15] line-through' : 'text-white/40'
              }`}
            >
              {t.text}
            </div>
            <div className="mt-0.5 font-mono font-light text-[8px] tracking-[0.08em] text-white/[0.15]">
              {t.done ? 'Done' : 'Not started'}
            </div>
          </div>
        </div>
      ))}

      <div className="my-2 rounded-[10px] border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
        <div className="font-sans font-thin text-[10px] leading-[1.55] text-white/[0.22]">
          {done} of {total} tasks done. {open} open item{open === 1 ? '' : 's'} need{open === 1 ? 's' : ''} attention today.
        </div>
      </div>

      <SoonRow Icon={N8nIcon} label="N8N · VDO Pipeline" />
      <SoonRow Icon={MailIcon} label="Gmail · VDO Africa" />
    </>
  );
}

const SoonRow = ({ Icon, label }) => (
  <div className="mb-1.5 flex items-center gap-2 rounded-[9px] border border-dashed border-white/[0.05] px-2.5 py-2">
    <Icon />
    <div className="font-mono font-light text-[7px] tracking-[0.14em] uppercase text-white/10">{label}</div>
    <div className="ml-auto rounded-[3px] border border-white/[0.07] px-1.5 py-0.5 font-mono font-light text-[7px] tracking-[0.1em] uppercase text-white/10">
      Soon
    </div>
  </div>
);
