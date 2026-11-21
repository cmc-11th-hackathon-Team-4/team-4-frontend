import { IconChevronRight } from '@/components/common/icons';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_ICON } from '@/constants/mood';
import { STATUS_LABEL, STATUS_LIST } from '@/constants/status';
import type { MemberStatus } from '@/types/member';

interface MoodPickerProps {
  value: MemberStatus;
  onChange: (status: MemberStatus) => void;
  /** 캐릭터를 눌러도 열려서 부모가 열림 상태를 관리 */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** 게이지 아래 '기분 · 쌩쌩 >' 버튼 + '오늘 기분 어때?' 팝오버 (V5-02) */
function MoodPicker({ value, onChange, open, onOpenChange }: MoodPickerProps) {
  const setOpen = onOpenChange;

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        className="mx-auto flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs"
        onClick={() => setOpen(!open)}
      >
        {MAIN_TEXT.moodButton(STATUS_LABEL[value])}
        <IconChevronRight size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label={MAIN_TEXT.moodTitle}
            className="absolute top-0 left-0 z-30 w-[260px] rounded-2xl border border-neutral-900 bg-white p-4 shadow-lg"
          >
            <p className="mb-3 text-sm font-bold">{MAIN_TEXT.moodTitle}</p>
            <div role="radiogroup" className="grid grid-cols-3 gap-2">
              {STATUS_LIST.map((status) => {
                const Face = STATUS_ICON[status];
                const selected = status === value;
                return (
                  <button
                    key={status}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`flex flex-col items-center gap-1 text-[11px] ${selected ? 'font-bold' : 'text-neutral-500'}`}
                    onClick={() => {
                      if (!selected) onChange(status);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={`flex size-11 items-center justify-center rounded-full ${
                        selected
                          ? 'border-2 border-neutral-900 bg-neutral-100'
                          : 'border border-neutral-300'
                      }`}
                    >
                      <Face size={24} strokeWidth={1.5} />
                    </span>
                    {STATUS_LABEL[status]}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MoodPicker;
