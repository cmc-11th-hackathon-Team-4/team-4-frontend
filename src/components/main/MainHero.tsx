import type { ReactNode } from 'react';
import glass from '@/assets/main/glass.svg';
import sparkle10 from '@/assets/main/sparkle-10.svg';
import sparkle16 from '@/assets/main/sparkle-16.svg';
import sparkle16b from '@/assets/main/sparkle-16b.svg';
import { CHARACTER_IMAGES } from '@/constants/character';
import type { CharacterTheme } from '@/constants/characterTheme';
import { MAIN_TEXT } from '@/constants/main';
import type { CharacterId } from '@/types/member';
import { CHIPS_HEIGHT } from './MainChips';
import HeartBurst from './HeartBurst';
import LoadGauge from './LoadGauge';

/** 헤더 아래 ~ 첫 카드 위까지 높이 (피그마 y 118 → 543) */
const HERO_HEIGHT = 425;

interface MainHeroProps {
  theme: CharacterTheme;
  character: CharacterId;
  /** 맡은 짐 수 (게이지) */
  count: number;
  /** 캐릭터를 누르면 기분 말풍선 (내 메인만) */
  onMoodClick?: () => void;
  /** 새 하트를 받았을 때 캐릭터 뒤 하트 뿅뿅 (key가 바뀌면 다시 재생) */
  heartBurstKey?: string;
  onHeartBurstEnd?: () => void;
  /** 기분 말풍선 등 위에 얹을 것 */
  children?: ReactNode;
}

/**
 * V5-01 · V5-07 위쪽: 물결 배경 · 유리 원 · 캐릭터 · 호 게이지 · 반짝임
 * - 좌표는 피그마 402px 화면 · 헤더 아래 기준 (가운데 정렬), 물결만 화면 전체 폭
 * - 칩 줄(MainChips)은 위 고정 영역에 있어서 그 높이만큼 위로 당겨 그림 (스크롤 0이면 시안과 같은 위치)
 */
function MainHero({
  theme,
  character,
  count,
  onMoodClick,
  heartBurstKey,
  onHeartBurstEnd,
  children,
}: MainHeroProps) {
  const { layout } = theme;

  return (
    <div
      className="relative shrink-0 overflow-x-clip"
      style={{ height: HERO_HEIGHT, marginTop: -CHIPS_HEIGHT }}
    >
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
    </div>
  );
}

export default MainHero;
