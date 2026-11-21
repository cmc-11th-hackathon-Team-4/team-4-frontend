import boxIcon from '@/assets/icons/chip-box.svg';
import chipSparkle from '@/assets/icons/chip-sparkle.svg';
import type { CharacterTheme } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_LABEL } from '@/constants/status';
import type { MemberStatus } from '@/types/member';

/**
 * 칩 줄 높이 (위 여백 12 + 칩 36 + 아래 배경 12).
 * 고정 영역에 들어가서 캐릭터 영역이 이만큼 위로 올라감 (스크롤 0이면 시안 위치)
 */
export const CHIPS_HEIGHT = 60;

interface MainChipsProps {
  theme: CharacterTheme;
  status: MemberStatus;
  /** 맡은 짐 수 */
  count: number;
  /** 내 메인: undefined → '내 기분', 상대: 이름 */
  ownerName?: string;
  /** 기분 칩을 누르면 (내 메인만) */
  onMoodClick?: () => void;
}

const chipShadow = (color: string) => ({ filter: `drop-shadow(0 5px 5.5px ${color})` });

/** 헤더 아래 고정 칩: '내 기분 · 쌩쌩' · '맡은 짐 N개' (피그마 V5-01 · V5-07) */
function MainChips({ theme, status, count, ownerName, onMoodClick }: MainChipsProps) {
  const label = STATUS_LABEL[status];

  return (
    <div className="flex gap-2 px-4 py-3">
      <button
        type="button"
        disabled={!onMoodClick}
        onClick={onMoodClick}
        className="flex h-9 items-center gap-1 rounded-[18px] px-3.5 text-sm leading-[normal] font-medium whitespace-nowrap disabled:cursor-default"
        style={{ backgroundColor: theme.c500, ...chipShadow(theme.chipShadow) }}
      >
        <img src={chipSparkle} alt="" width={18} height={18} />
        {ownerName ? (
          <span className="text-[#f2efff]">{MAIN_TEXT.moodChipOf(ownerName, label)}</span>
        ) : (
          <span className="text-white">
            <span className="text-[#f2efff]">{MAIN_TEXT.moodChipMine} </span>·{' '}
            <span className="font-semibold">{label}</span>
          </span>
        )}
      </button>
      <span
        className="flex h-9 items-center gap-1 rounded-[18px] border-[1.5px] px-3.5 text-sm leading-[normal] font-medium whitespace-nowrap text-gray-800"
        style={{
          backgroundColor: theme.c100,
          borderColor: theme.c400,
          ...chipShadow(theme.chipShadow),
        }}
      >
        <span
          className="flex size-[18px] items-center justify-center rounded-[5.8px]"
          style={{ backgroundColor: theme.iconBg }}
        >
          <img src={boxIcon} alt="" width={13} height={14} />
        </span>
        {MAIN_TEXT.loadChip}
        <span style={{ color: theme.c500 }}>{MAIN_TEXT.loadChipCount(count)}</span>
      </span>
    </div>
  );
}

export default MainChips;
