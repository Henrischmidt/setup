import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store.js';
import HabitEditor from './HabitEditor.jsx';
import { renderHabitIcon } from '../lib/icons.jsx';

export default function Manage() {
  const nav = useNavigate();
  const habits = useStore((s) => s.habits);
  const addHabit = useStore((s) => s.addHabit);
  const updateHabit = useStore((s) => s.updateHabit);
  const deleteHabit = useStore((s) => s.deleteHabit);

  const [editing, setEditing] = useState(null); // habit object or 'new'
  const [confirm, setConfirm] = useState(null); // habit object pending delete

  const close = () => setEditing(null);

  const onSave = (data) => {
    if (editing && editing !== 'new') {
      updateHabit(editing.id, data);
    } else {
      addHabit(data);
    }
    close();
  };

  const onDelete = () => {
    if (editing && editing !== 'new') {
      setConfirm(editing);
      close();
    }
  };

  return (
    <div
      className="relative w-screen overflow-hidden bg-bg pt-[max(env(safe-area-inset-top),2.75rem)]"
      style={{ height: '100dvh' }}
    >
      <div className="h-full overflow-y-auto px-[18px] pt-1.5 pb-24">
        <div className="flex shrink-0 items-center justify-between pt-1 pb-3">
          <span className="font-mono font-normal text-[12px] tracking-[0.2em] uppercase text-white/55">
            Manage
          </span>
          <button
            onClick={() => nav('/app/habits')}
            className="cursor-pointer font-mono font-light text-[8px] tracking-[0.12em] uppercase text-white/[0.4]"
          >
            ← Habits
          </button>
        </div>

        <div className="mb-4 font-sans font-thin text-[11px] leading-[1.55] text-white/40">
          Tap a habit to edit. Add new ones with the + button below.
        </div>

        <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.018]">
          {habits.map((h, i) => (
            <button
              key={h.id}
              onClick={() => setEditing(h)}
              className={`flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:bg-white/[0.04] ${
                i < habits.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
                {renderHabitIcon(h.icon, 14, 'rgba(255,255,255,0.45)')}
              </div>
              <div className="flex-1">
                <div className="font-sans font-thin text-[13px] text-white/80">{h.name}</div>
                <div className="mt-0.5 font-mono font-light text-[8px] tracking-[0.12em] uppercase text-white/[0.3]">
                  {h.type === 'progressive' ? `${h.steps} steps · target ${h.targetStep}` : 'Simple toggle'}
                </div>
              </div>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round">
                <polyline points="1,1 5,5 1,9" />
              </svg>
            </button>
          ))}
          {habits.length === 0 && (
            <div className="px-3.5 py-6 text-center font-sans font-thin text-[11px] text-white/30">
              No habits yet.
            </div>
          )}
        </div>

        <button
          onClick={() => setEditing('new')}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-white/[0.12] py-3.5 font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 transition active:bg-white/[0.04]"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round">
            <line x1="5.5" y1="1.5" x2="5.5" y2="9.5" />
            <line x1="1.5" y1="5.5" x2="9.5" y2="5.5" />
          </svg>
          Add habit
        </button>
      </div>

      <HabitEditor
        open={editing !== null}
        initial={editing && editing !== 'new' ? editing : null}
        onClose={close}
        onSave={onSave}
        onDelete={onDelete}
      />

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setConfirm(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-xs rounded-[14px] border border-white/[0.08] bg-bg px-5 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/75">Delete habit?</div>
            <div className="mt-2 font-sans font-thin text-[11px] leading-[1.5] text-white/45">
              "{confirm.name}" will be removed. Past history is kept.
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-[8px] border border-white/[0.08] py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHabit(confirm.id);
                  setConfirm(null);
                }}
                className="flex-1 rounded-[8px] border border-white/30 bg-white/10 py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/85"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
