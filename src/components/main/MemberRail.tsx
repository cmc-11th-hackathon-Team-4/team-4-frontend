import { IconSmile } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';
import type { Id } from '@/types/common';
import type { Member } from '@/types/member';

interface MemberRailProps {
  members: Member[];
  myId: Id;
  activeId: Id;
  countOf: (id: Id) => number;
  onSelect: (id: Id) => void;
}

/** 레일 한 칸 높이(아바타 48 + 이름 + 간격). 위쪽 영역 최소 높이 계산용 */
export const RAIL_ITEM_HEIGHT = 80;

/** 오른쪽 구성원 레일 (나가 항상 맨 위) */
function MemberRail({ members, myId, activeId, countOf, onSelect }: MemberRailProps) {
  const sorted = [...members].sort((a, b) => Number(b.id === myId) - Number(a.id === myId));

  return (
    <nav className="flex flex-col items-center gap-3">
      {sorted.map((member) => {
        const active = member.id === activeId;
        return (
          <button
            key={member.id}
            type="button"
            className="flex flex-col items-center gap-1"
            onClick={() => onSelect(member.id)}
          >
            <span
              className={`relative flex size-12 items-center justify-center rounded-full bg-white text-neutral-600 ${
                active ? 'border-2 border-neutral-900' : 'border border-neutral-300'
              }`}
            >
              <IconSmile size={24} strokeWidth={1.5} />
              <span
                className={`absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  active ? 'bg-neutral-900 text-white' : 'border border-neutral-900 bg-white'
                }`}
              >
                {countOf(member.id)}
              </span>
            </span>
            <span className={`text-[11px] ${active ? 'font-bold' : 'text-neutral-500'}`}>
              {member.id === myId ? MAIN_TEXT.meLabel : member.nickname}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default MemberRail;
