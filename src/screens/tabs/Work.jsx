import React, { useMemo } from 'react';
import { useStore, scores } from '../../store.js';
import { SingleRing } from '../../components/Ring.jsx';
import { N8nIcon, MailIcon } from '../../components/Icon.jsx';
import PageHeader from './PageHeader.jsx';

export default function Work({ goTo }) {
  const tasks = useStore((s) => s.tasks);
  const habits = useStore((s) => s.habits);
  const todayProgress = useStore((s) => s.todayProgress);
  const toggleTask = useStore((s) => s.toggleTask);
  const s = useMemo(() => scores({ tasks, habits, todayProgress }), [tasks, habits, todayProgress]);

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const open = total - done;

  return (
    <>
      <PageHeader title="Work" goTo={goTo} />
      <div className="flex flex-col items-center pb-3 pt-1">
        <div className="relative h-[200px] w-[200px]">
          <SingleRing pct={s.work} stroke="rgba(255,255,255,0.45)" size={200} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="font-mono font-medium text-[50px] leading-none tracking-[-0.04em] text-white/85">
              {s.work}%
            </div>
            <div className="font-mono font-light text-[8px] tracking-[0.2em] uppercase text-white/30">Work</div>
          </div>
        </div>
      </div>

      <div className="mb-2 font-mono font-light text-[7.5px] tracking-[0.18em] uppercase text-white/[0.4]">
        Today's Top {total}
      </div>

      {tasks.map((t) => (
        <button
          key={t.id}
          onClick={() => toggleTask(t.id)}
          className="flex w-full cursor-pointer items-center gap-3 border-b border-white/[0.04] py-3 text-left last:border-b-0 active:bg-white/[0.02]"
          style={{ minHeight: 48 }}
        >
          <div
            className={`h-[10px] w-[10px] shrink-0 rounded-full border ${
              t.done ? 'border-white/70 bg-white/70' : 'border-white/30 bg-white/[0.06]'
            }`}
          />
          <div className="flex-1">
            <div
              className={`font-sans font-thin text-[12px] ${
                t.done ? 'text-white/[0.2] line-through' : 'text-white/65'
              }`}
            >
              {t.text}
            </div>
            <div className="mt-0.5 font-mono font-light text-[8px] tracking-[0.1em] uppercase text-white/[0.25]">
              {t.done ? 'Done' : 'Not started'}
            </div>
          </div>
        </button>
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
