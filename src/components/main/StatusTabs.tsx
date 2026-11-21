import { STATUS_LABEL, STATUS_LIST } from '@/constants/status';
import type { MemberStatus } from '@/types/member';

interface StatusTabsProps {
  value: MemberStatus;
  onChange: (status: MemberStatus) => void;
}

function StatusTabs({ value, onChange }: StatusTabsProps) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2">
      {STATUS_LIST.map((status) => {
        const selected = status === value;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs ${
              selected
                ? 'border-2 border-neutral-900 font-bold'
                : 'border border-neutral-300 text-neutral-500'
            }`}
            onClick={() => onChange(status)}
          >
            {/* TODO: 상태 아이콘 */}
            <span className="size-4 rounded-full border border-neutral-400" />
            {STATUS_LABEL[status]}
          </button>
        );
      })}
    </div>
  );
}

export default StatusTabs;
