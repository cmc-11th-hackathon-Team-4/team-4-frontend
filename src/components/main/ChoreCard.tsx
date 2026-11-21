import { useDraggable } from '@dnd-kit/core';
import { MAIN_TEXT } from '@/constants/main';
import type { Chore } from '@/types/chore';

interface ChoreCardProps {
  chore: Chore;
  onTake: (chore: Chore) => void;
}

export function ChoreCardView({ name, lifted = false }: { name: string; lifted?: boolean }) {
  return (
    <div
      className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-3 text-sm ${
        lifted ? 'rotate-[-3deg] border-neutral-900 shadow-lg' : 'border-neutral-300'
      }`}
    >
      <span className="text-neutral-400">⠿</span>
      <span className="flex-1">{name}</span>
    </div>
  );
}

/** 끌 수 있는 상대 짐 카드. ↓ 버튼은 드래그가 어려울 때의 대안 */
function ChoreCard({ chore, onTake }: ChoreCardProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: chore.id,
    data: chore,
  });

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="flex h-12 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-xs text-neutral-400"
      >
        {MAIN_TEXT.moving}
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={setNodeRef} {...attributes} {...listeners} className="touch-none">
        <ChoreCardView name={chore.name} />
      </div>
      <button
        type="button"
        aria-label={`${chore.name} 덜어가기`}
        className="absolute top-1/2 right-1 -translate-y-1/2 p-2 text-neutral-400"
        onClick={() => onTake(chore)}
      >
        ↓
      </button>
    </div>
  );
}

export default ChoreCard;
