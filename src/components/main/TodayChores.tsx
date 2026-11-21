import { useState } from 'react';
import { MAIN_TEXT } from '@/constants/main';
import type { Chore } from '@/types/chore';

interface TodayChoresProps {
  chores: Chore[];
  onToggle: (chore: Chore) => void;
}

function ChoreRow({
  chore,
  extra,
  onToggle,
}: {
  chore: Chore;
  extra?: React.ReactNode;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-neutral-300 px-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={chore.done}
        aria-label={chore.name}
        className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
          chore.done ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-400'
        }`}
        onClick={onToggle}
      >
        {chore.done && '✓'}
      </button>
      <span className={`flex-1 text-sm ${chore.done ? 'text-neutral-400 line-through' : ''}`}>
        {chore.name}
      </span>
      {extra}
    </div>
  );
}

/** 내 오늘 하나: 안 한 짐 하나만 보여주고 나머지는 숨김 (덜어내기) */
function TodayChores({ chores, onToggle }: TodayChoresProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...chores].sort((a, b) => Number(a.done) - Number(b.done));
  const [first, ...rest] = sorted;

  return (
    <section>
      <h2 className="mb-2 text-sm font-bold">{MAIN_TEXT.todayTitle}</h2>
      {!first ? (
        <p className="rounded-xl border border-dashed border-neutral-300 py-4 text-center text-sm text-neutral-400">
          {MAIN_TEXT.todayEmpty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <ChoreRow
            chore={first}
            onToggle={() => onToggle(first)}
            extra={
              rest.length > 0 && (
                <button
                  type="button"
                  className="text-[11px] text-neutral-400"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? MAIN_TEXT.fold : MAIN_TEXT.todayHidden(rest.length)}
                </button>
              )
            }
          />
          {expanded &&
            rest.map((c) => <ChoreRow key={c.id} chore={c} onToggle={() => onToggle(c)} />)}
        </div>
      )}
    </section>
  );
}

export default TodayChores;
