import bubble from '@/assets/main/mood-bubble.svg';
import { characterFace } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_LABEL, STATUS_LIST } from '@/constants/status';
import type { CharacterId, MemberStatus } from '@/types/member';

interface MoodPickerProps {
  character: CharacterId;
  value: MemberStatus;
  /** 선택 글자색 (테마) */
  color: string;
  onChange: (status: MemberStatus) => void;
  onClose: () => void;
}

// 시안 좌표: 말풍선 290px, 표정 칸 76px (왼쪽 17 · 107 · 197)
const FACE_LEFT = [17, 107, 197];

/** V5-02 "오늘 기분은 어때요?" 말풍선 (캐릭터 위, 꼬리가 캐릭터를 가리킴) */
function MoodPicker({ character, value, color, onChange, onClose }: MoodPickerProps) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div
        role="dialog"
        aria-label={MAIN_TEXT.moodTitle}
        className="absolute top-[60px] left-14 z-30 h-[168px] w-[290px] drop-shadow-[0_4px_8px_#cfc7e3]"
      >
        <img
          src={bubble}
          alt=""
          className="absolute inset-x-0 top-0 h-[184px] w-[290px] max-w-none"
        />
        <p className="absolute top-4 left-4 text-sm leading-[1.2] font-bold text-gray-800">
          {MAIN_TEXT.moodTitle}
        </p>
        <div role="radiogroup">
          {STATUS_LIST.map((status, i) => {
            const selected = status === value;
            return (
              <button
                key={status}
                type="button"
                role="radio"
                aria-checked={selected}
                className="absolute top-12 flex w-[76px] flex-col items-center gap-0.5"
                style={{ left: FACE_LEFT[i] }}
                onClick={() => {
                  if (!selected) onChange(status);
                  onClose();
                }}
              >
                <span
                  className={`relative block size-20 overflow-hidden rounded-full border-4 border-white bg-line-600 drop-shadow-[0_4px_8px_rgba(207,199,227,0.4)] ${
                    selected ? '' : 'opacity-30'
                  }`}
                >
                  <span className="absolute inset-0 bg-[rgba(13,13,13,0.2)] shadow-[inset_0_8px_8px_#ccc2ff]" />
                  <img
                    src={characterFace(character, status)}
                    alt=""
                    className="absolute top-[-24px] left-[-26px] size-[124px] max-w-none object-cover"
                  />
                </span>
                <span
                  className={`text-xs leading-[normal] ${selected ? 'font-bold' : 'text-gray-800 opacity-30'}`}
                  style={selected ? { color } : undefined}
                >
                  {STATUS_LABEL[status]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MoodPicker;
