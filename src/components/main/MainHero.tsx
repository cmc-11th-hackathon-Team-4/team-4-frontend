import type { ReactNode } from 'react';
import boxIcon from '@/assets/icons/chip-box.svg';
import chipSparkle from '@/assets/icons/chip-sparkle.svg';
import glass from '@/assets/main/glass.svg';
import sparkle10 from '@/assets/main/sparkle-10.svg';
import sparkle16 from '@/assets/main/sparkle-16.svg';
import sparkle16b from '@/assets/main/sparkle-16b.svg';
import { CHARACTER_IMAGES } from '@/constants/character';
import type { CharacterTheme } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import { STATUS_LABEL } from '@/constants/status';
import type { CharacterId, MemberStatus } from '@/types/member';
import HeartBurst from './HeartBurst';
import LoadGauge from './LoadGauge';

/** 헤더 아래 ~ 첫 카드 위까지 높이 (피그마 y 118 → 543) */
export const HERO_HEIGHT = 425;

interface MainHeroProps {
  theme: CharacterTheme;
  character: CharacterId;
  status: MemberStatus;
  /** 맡은 짐 수 (게이지 · 칩) */
  count: number;
  /** 내 메인: undefined → '내 기분', 상대: 이름 */
  ownerName?: string;
  /** 기분 칩 · 캐릭터를 누르면 (내 메인만) */
  onMoodClick?: () => void;
  /** 새 하트를 받았을 때 캐릭터 뒤 하트 뿅뿅 (key가 바뀌면 다시 재생) */
  heartBurstKey?: string;
  onHeartBurstEnd?: () => void;
  /** 기분 말풍선 등 위에 얹을 것 */
  children?: ReactNode;
}

const chipShadow = (color: string) => ({ filter: `drop-shadow(0 5px 5.5px ${color})` });

/**
 * V5-01 · V5-07 위쪽: 물결 배경 · 유리 원 · 캐릭터 · 호 게이지 · 반짝임 · 기분/짐 칩
 * 좌표는 피그마 402px 화면 기준 (가운데 정렬), 물결만 화면 전체 폭
 */
function MainHero({
  theme,
  character,
  status,
  count,
  ownerName,
  onMoodClick,
  heartBurstKey,
  onHeartBurstEnd,
  children,
}: MainHeroProps) {
  const { layout } = theme;
  const label = STATUS_LABEL[status];

  return (
    <div className="relative shrink-0 overflow-x-clip" style={{ height: HERO_HEIGHT }}>
      {/* 하단 물결 (화면 폭에 맞춰 늘림) */}
      <img
        src={theme.wave1}
        alt=""
        className="pointer-events-none absolute left-0 w-[100.5%] max-w-none"
        style={{ top: layout.wave1Top }}
      />
      <img
        src={theme.wave2}
        alt=""
        className="pointer-events-none absolute left-0 w-[100.5%] max-w-none"
        style={{ top: layout.wave2Top }}
      />

      {/* 402px 시안 영역을 화면 가운데에 (좁은 화면에선 양옆이 같이 잘림) */}
      <div className="relative left-1/2 -ml-[201px] h-full w-[402px]">
        {theme.glass && (
          <img
            src={glass}
            alt=""
            width={364}
            height={353}
            className="pointer-events-none absolute top-[67px] left-[13px] max-w-none"
          />
        )}
        {/* 바닥 그림자 (svg 안에 흐림 여백 4px) */}
        <img
          src={theme.shadow}
          alt=""
          className="pointer-events-none absolute max-w-none"
          style={{ left: layout.shadowLeft - 4, top: layout.shadowTop - 4 }}
        />

        {/* 캐릭터 415px (하트 뿅뿅은 캐릭터 뒤) */}
        <div
          className="absolute size-[415px] -translate-x-1/2"
          style={{ top: layout.characterTop, left: `calc(50% + ${layout.characterLeftOffset}px)` }}
        >
          {heartBurstKey && (
            <HeartBurst key={heartBurstKey} color={theme.c500} onEnd={() => onHeartBurstEnd?.()} />
          )}
          <button
            type="button"
            aria-label={MAIN_TEXT.moodTitle}
            disabled={!onMoodClick}
            onClick={onMoodClick}
            className="absolute inset-[18%] rounded-full disabled:cursor-default"
          />
          <img
            src={CHARACTER_IMAGES[character]}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        </div>

        <LoadGauge
          count={count}
          color={theme.gauge}
          glow={theme.gaugeGlow}
          className="pointer-events-none absolute top-[87px] left-[36px]"
        />

        {/* 반짝임 장식 */}
        <img
          src={sparkle16}
          alt=""
          className="pointer-events-none absolute size-4"
          style={layout.sparkle16}
        />
        <img
          src={sparkle10}
          alt=""
          className="pointer-events-none absolute size-2.5"
          style={layout.sparkle10}
        />
        <img
          src={sparkle16b}
          alt=""
          className="pointer-events-none absolute top-[137px] left-[371px] size-4"
        />

        {children}
      </div>

      {/* 기분 칩 (화면 왼쪽 16px 고정) · 맡은 짐 칩 */}
      <div className="absolute top-3 left-4 flex gap-2">
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
    </div>
  );
}

export default MainHero;
