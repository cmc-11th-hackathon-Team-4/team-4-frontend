import type { Group } from '@/types/group';
import BottomSheet from './BottomSheet';

/** V5-12 집안일 전체 목록 (담당자와 함께) */
function ChoreListSheet({ group, onClose }: { group: Group; onClose: () => void }) {
  const nameOf = (id: string) => group.members.find((m) => m.id === id)?.nickname ?? '';

  return (
    <BottomSheet title={`집안일 목록 ${group.chores.length}개`} onClose={onClose}>
      {group.chores.length === 0 ? (
        <p className="mt-6 text-center text-sm text-gray-500">아직 집안일이 없어요</p>
      ) : (
        <ul className="mt-4 max-h-[50dvh] overflow-y-auto">
          {group.chores.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between border-b border-line-600 py-3 last:border-b-0"
            >
              <span
                className={`text-base ${c.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}
              >
                {c.name}
              </span>
              <span className="text-sm text-gray-500">{nameOf(c.ownerId)}</span>
            </li>
          ))}
        </ul>
      )}
    </BottomSheet>
  );
}

export default ChoreListSheet;
