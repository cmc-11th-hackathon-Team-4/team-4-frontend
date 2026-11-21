import { useDroppable } from '@dnd-kit/core';
import { MAIN_TEXT } from '@/constants/main';

export const DOCK_DROP_ID = 'dock';

/** 하단 '내 짐' 도크: 여기에 놓으면 덜어오기 */
function Dock({ count, dragging }: { count: number; dragging: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: DOCK_DROP_ID });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-16 items-center gap-3 rounded-xl px-3 transition-colors ${
        dragging ? 'border-2 border-neutral-900' : 'border border-dashed border-neutral-400'
      } ${isOver ? 'bg-neutral-100' : 'bg-white'}`}
    >
      <span className="size-9 shrink-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <div className="flex-1">
        <p className="text-sm font-bold">{MAIN_TEXT.dockTitle(count)}</p>
        <p className="text-[11px] text-neutral-500">
          {dragging ? MAIN_TEXT.dockActive : MAIN_TEXT.dockIdle}
        </p>
      </div>
    </div>
  );
}

export default Dock;
