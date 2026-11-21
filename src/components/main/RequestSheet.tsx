import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { IconInfo, IconSmile } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_LABEL } from '@/constants/status';
import { useToastStore } from '@/stores/toast';
import type { Id } from '@/types/common';
import type { Member } from '@/types/member';

interface RequestSheetProps {
  choreName: string;
  members: Member[];
  countOf: (id: Id) => number;
  /** 짐 5개를 다 가진 사람은 고를 수 없음 */
  isFull: (id: Id) => boolean;
  onClose: () => void;
  onSubmit: (toId: Id) => void;
}

/** V5-05: 누구에게 올릴까요? (부모에서 열 때만 렌더) */
function RequestSheet({
  choreName,
  members,
  countOf,
  isFull,
  onClose,
  onSubmit,
}: RequestSheetProps) {
  const [selected, setSelected] = useState<Id | null>(null);
  const showToast = useToastStore((s) => s.show);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={MAIN_TEXT.requestTitle}
        className="w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+var(--safe-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        <h2 className="text-xl font-bold">{MAIN_TEXT.requestTitle}</h2>
        <p className="mt-1 text-sm text-neutral-500">{MAIN_TEXT.requestDesc(choreName)}</p>

        {members.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-neutral-300 py-8 text-center text-sm text-neutral-400">
            {MAIN_TEXT.requestNoMember}
          </p>
        ) : (
          <div role="radiogroup" className="mt-5 flex flex-col gap-2">
            {members.map((member) => {
              const active = member.id === selected;
              const full = isFull(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-disabled={full || undefined}
                  className={`flex items-center gap-3 rounded-2xl p-3 text-left ${full ? 'opacity-40' : ''} ${
                    active ? 'border-2 border-neutral-900' : 'border border-neutral-300'
                  }`}
                  onClick={() =>
                    full
                      ? showToast(MAIN_TEXT.requestMemberFullToast(member.nickname))
                      : setSelected(member.id)
                  }
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-neutral-100">
                    <IconSmile size={22} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block font-semibold">{member.nickname}</span>
                    <span className="text-[11px] text-neutral-500">
                      {full
                        ? MAIN_TEXT.requestMemberFull(countOf(member.id))
                        : MAIN_TEXT.requestMemberInfo(
                            STATUS_LABEL[member.status],
                            countOf(member.id),
                          )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-neutral-100 p-3 text-xs text-neutral-500">
          <IconInfo size={16} />
          {MAIN_TEXT.requestTip}
        </p>

        <BottomButton
          variant="solid"
          className="mt-8"
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
        >
          {MAIN_TEXT.requestOk}
        </BottomButton>
      </div>
    </div>
  );
}

export default RequestSheet;
