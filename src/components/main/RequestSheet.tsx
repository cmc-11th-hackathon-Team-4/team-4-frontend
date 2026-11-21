import { useState } from 'react';
import { CHARACTER_IMAGES } from '@/constants/character';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_LABEL } from '@/constants/status';
import BottomButton from '@/pages/onboarding/components/BottomButton';
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

/** V5-05 받을 사람 선택 바텀시트 (부모에서 열 때만 렌더) */
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
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[rgba(18,18,18,0.45)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={MAIN_TEXT.requestTitle}
        className="relative flex min-h-[400px] w-full max-w-[430px] flex-col rounded-t-[28px] bg-white px-4 pt-10 pb-[max(46px,calc(12px+var(--safe-bottom)))]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-sm bg-line-600" />
        <h2 className="text-[22px] leading-[normal] font-semibold text-gray-800">
          {MAIN_TEXT.requestTitle}
        </h2>
        <p className="mt-1.5 leading-[normal] font-medium text-gray-500">
          {MAIN_TEXT.requestDesc(choreName)}
        </p>

        {members.length === 0 ? (
          <p className="mt-6 rounded-2xl border-[1.5px] border-dashed border-line-700 py-8 text-center text-sm text-gray-400">
            {MAIN_TEXT.requestNoMember}
          </p>
        ) : (
          <div role="radiogroup" className="mt-6 flex flex-col gap-2">
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
                  className={`flex h-[76px] items-center gap-3 rounded-2xl border-[1.5px] px-4 text-left ${
                    active ? 'border-primary-500 bg-primary-100' : 'border-line-600 bg-white'
                  } ${full ? 'opacity-40' : ''}`}
                  onClick={() =>
                    full
                      ? showToast(MAIN_TEXT.requestMemberFullToast(member.nickname))
                      : setSelected(member.id)
                  }
                >
                  <img
                    src={CHARACTER_IMAGES[member.character]}
                    alt=""
                    className="size-[52px] shrink-0 rounded-[26px] object-cover"
                  />
                  <span className="flex flex-col gap-0.5 leading-[normal]">
                    <span className="text-lg font-semibold text-gray-800">{member.nickname}</span>
                    <span className="text-sm font-medium text-gray-500">
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

        <BottomButton
          className="mt-auto"
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
