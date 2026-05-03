import React, { useEffect, useState } from 'react';
import { HABIT_ICONS } from '../lib/icons.jsx';

const blank = {
  name: '',
  type: 'simple',
  steps: 4,
  stepLabels: ['', '', '', ''],
  targetStep: 4,
  icon: 'star',
};

export default function HabitEditor({ open, initial, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(initial ?? blank);

  useEffect(() => {
    if (open) setDraft(initial ?? blank);
  }, [open, initial]);

  if (!open) return null;
  const isEdit = Boolean(initial?.id);
  const isProgressive = draft.type === 'progressive';

  const updateSteps = (steps) => {
    const safe = Math.max(2, Math.min(6, steps));
    const labels = Array.from({ length: safe }, (_, i) => draft.stepLabels?.[i] ?? '');
    setDraft({ ...draft, steps: safe, stepLabels: labels, targetStep: Math.min(draft.targetStep ?? safe, safe) });
  };

  const setLabel = (i, v) => {
    const labels = [...(draft.stepLabels ?? [])];
    labels[i] = v;
    setDraft({ ...draft, stepLabels: labels });
  };

  const save = () => {
    if (!draft.name.trim()) return;
    const out = {
      name: draft.name.trim(),
      type: draft.type,
      icon: draft.icon,
    };
    if (draft.type === 'progressive') {
      out.steps = draft.steps;
      out.stepLabels = (draft.stepLabels ?? []).map((s) => (s || '').trim());
      out.targetStep = Math.min(Math.max(1, draft.targetStep ?? draft.steps), draft.steps);
    }
    onSave(out);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full overflow-y-auto rounded-t-[20px] border-t border-white/[0.08] bg-bg shadow-[0_-12px_40px_rgba(0,0,0,0.8)]"
        style={{
          maxHeight: '88dvh',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 18px)',
          animation: 'sheetUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 mb-2 h-1 w-9 rounded-full bg-white/15" />
        <div className="px-5 pt-1 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono font-normal text-[11px] tracking-[0.2em] uppercase text-white/55">
              {isEdit ? 'Edit habit' : 'New habit'}
            </span>
            <button
              onClick={onClose}
              className="font-mono font-light text-[8px] tracking-[0.12em] uppercase text-white/40"
            >
              Cancel
            </button>
          </div>

          <Field label="Name">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Read 20 pages"
              className="w-full rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 font-sans font-thin text-[13px] text-white/85 placeholder-white/40 focus:border-white/25 focus:outline-none"
            />
          </Field>

          <Field label="Type">
            <div className="flex gap-2">
              <Toggle on={draft.type === 'simple'} onClick={() => setDraft({ ...draft, type: 'simple' })}>
                Simple
              </Toggle>
              <Toggle on={isProgressive} onClick={() => setDraft({ ...draft, type: 'progressive' })}>
                Progressive
              </Toggle>
            </div>
          </Field>

          {isProgressive && (
            <>
              <Field label="Steps">
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <Toggle key={n} on={draft.steps === n} onClick={() => updateSteps(n)}>
                      {n}
                    </Toggle>
                  ))}
                </div>
              </Field>

              <Field label="Step labels">
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: draft.steps }, (_, i) => (
                    <input
                      key={i}
                      value={draft.stepLabels?.[i] ?? ''}
                      onChange={(e) => setLabel(i, e.target.value)}
                      placeholder={`Step ${i + 1}`}
                      className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 font-mono text-[11px] text-white/80 placeholder-white/30 focus:border-white/25 focus:outline-none"
                    />
                  ))}
                </div>
              </Field>

              <Field label="Goal step (counts as complete)">
                <div className="flex gap-2">
                  {Array.from({ length: draft.steps }, (_, i) => i + 1).map((n) => (
                    <Toggle key={n} on={draft.targetStep === n} onClick={() => setDraft({ ...draft, targetStep: n })}>
                      {n}
                    </Toggle>
                  ))}
                </div>
              </Field>
            </>
          )}

          <Field label="Icon">
            <div className="grid grid-cols-5 gap-2">
              {HABIT_ICONS.map((icon) => {
                const sel = draft.icon === icon.name;
                return (
                  <button
                    key={icon.name}
                    onClick={() => setDraft({ ...draft, icon: icon.name })}
                    className={`flex aspect-square items-center justify-center rounded-[10px] border ${
                      sel ? 'border-white/45 bg-white/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'
                    } active:bg-white/[0.06]`}
                  >
                    {icon.render(22, sel ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)')}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={save}
              disabled={!draft.name.trim()}
              className="rounded-[10px] border border-white/25 bg-white/[0.08] py-3 font-mono text-[10px] tracking-[0.18em] uppercase text-white/85 transition active:bg-white/[0.14] disabled:opacity-30"
            >
              {isEdit ? 'Save changes' : 'Add habit'}
            </button>
            {isEdit && onDelete && (
              <button
                onClick={onDelete}
                className="rounded-[10px] border border-white/[0.07] py-2.5 font-mono text-[9px] tracking-[0.18em] uppercase text-white/45 transition active:bg-white/[0.04]"
              >
                Delete habit
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes sheetUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="mb-4">
    <div className="mb-1.5 font-mono font-light text-[8px] tracking-[0.18em] uppercase text-white/[0.4]">
      {label}
    </div>
    {children}
  </div>
);

const Toggle = ({ on, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-[8px] border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase transition ${
      on ? 'border-white/45 bg-white/[0.08] text-white/85' : 'border-white/[0.07] bg-white/[0.02] text-white/45'
    } active:bg-white/[0.08]`}
  >
    {children}
  </button>
);
