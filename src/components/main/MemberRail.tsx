import { useDroppable } from '@dnd-kit/core';
import { MAIN_TEXT } from '@/constants/main';
import type { Id } from '@/types/common';
import type { Member } from '@/types/member';

export const RAIL_ME_DROP_ID = 'rail-me';

interface MemberRailProps {
  members: Member[];
  myId: Id;
  activeId: Id;
  countOf: (id: Id) => number;
  onSelect: (id: Id) => void;
  /** 상대 메인에서만 true: '나'에 카드를 놓을 수 있음 */
  droppable?: boolean;
  dragging?: boolean;
}

interface AvatarProps {
  label: string;
  count: number;
  active: boolean;
  highlight?: boolean;
  onClick: () => void;
}

function Avatar({ label, count, active, highlight, onClick }: AvatarProps) {
  return (
    <button type="button" className="flex flex-col items-center gap-0.5" onClick={onClick}>
      <span
        className={`relative size-10 rounded-full bg-neutral-100 ${
          highlight
            ? 'border-2 border-dashed border-neutral-900'
            : active
              ? 'border-2 border-neutral-900'
              : 'border border-neutral-300'
        }`}
      >
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] text-white">
          {count}
        </span>
      </span>
      <span className={`text-[10px] ${active ? 'font-bold' : 'text-neutral-500'}`}>{label}</span>
    </button>
  );
}

function DroppableMe(props: AvatarProps & { dragging?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: RAIL_ME_DROP_ID });
  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'scale-110 transition-transform' : 'transition-transform'}
    >
      <Avatar {...props} highlight={props.dragging} />
    </div>
  );
}

/** 오른쪽 구성원 레일 (나가 항상 맨 위) */
function MemberRail({
  members,
  myId,
  activeId,
  countOf,
  onSelect,
  droppable,
  dragging,
}: MemberRailProps) {
  const sorted = [...members].sort((a, b) => Number(b.id === myId) - Number(a.id === myId));

  return (
    <nav className="flex flex-col items-center gap-3">
      {sorted.map((member) => {
        const isMe = member.id === myId;
        const props = {
          label: isMe ? MAIN_TEXT.meLabel : member.nickname,
          count: countOf(member.id),
          active: member.id === activeId,
          onClick: () => onSelect(member.id),
        };
        return isMe && droppable ? (
          <DroppableMe key={member.id} {...props} dragging={dragging} />
        ) : (
          <Avatar key={member.id} {...props} />
        );
      })}
    </nav>
  );
}

export default MemberRail;
