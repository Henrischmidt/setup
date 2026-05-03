import React from 'react';

export default function PageHeader({ title, goTo }) {
  return (
    <div className="flex shrink-0 items-center justify-between pt-1 pb-3">
      <span className="font-mono font-normal text-[12px] tracking-[0.2em] uppercase text-white/55">{title}</span>
      <span
        onClick={() => goTo('hub')}
        className="cursor-pointer font-mono font-light text-[8px] tracking-[0.12em] uppercase text-white/[0.18]"
      >
        ← Hub
      </span>
    </div>
  );
}
