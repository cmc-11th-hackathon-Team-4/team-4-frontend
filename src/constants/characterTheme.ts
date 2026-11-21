import shadowOrange from '@/assets/main/shadow-orange.svg';
import shadowPurple from '@/assets/main/shadow-purple.svg';
import wave1Orange from '@/assets/main/wave1-orange.svg';
import wave1Purple from '@/assets/main/wave1-purple.svg';
import wave2Orange from '@/assets/main/wave2-orange.svg';
import wave2Purple from '@/assets/main/wave2-purple.svg';
import mood2Unwilling from '@/assets/moods/2-unwilling.png';
import mood5Tired from '@/assets/moods/5-tired.png';
import mood5Unwilling from '@/assets/moods/5-unwilling.png';
import { CHARACTER_IMAGES } from '@/constants/character';
import type { CharacterId, MemberStatus } from '@/types/member';

/**
 * 메인(② V5) 캐릭터별 화면 테마 — 피그마 "디자인 · ② 덜어주기 · 짐 올리기 · 완료"
 * - 보라(캐릭터 5): V5-01 내 메인 · 수아 / 주황(캐릭터 2): V5-07 상대 상세 · 민지
 * - TODO(디자인): 빨강(1) · 노랑(3) · 파랑(4) 시안이 나오면 추가. 그전엔 보라 테마
 */
export interface CharacterTheme {
  /** 화면 배경 (고정: 헤더 · 칩 뒤까지) */
  background: string;
  /**
   * 스크롤 내용 배경 (내용과 같이 움직임). 주황 시안의 크림 → 피치 경계선처럼
   * 화면에 고정되면 카드 위로 선이 지나가는 배경은 여기에
   */
  contentBackground?: string;
  /** primary/100 · 400 · 500 */
  c100: string;
  c400: string;
  c500: string;
  /** 칩 상자 아이콘 배경 */
  iconBg: string;
  /** 칩 그림자 색 */
  chipShadow: string;
  /** 구성원 아바타 안쪽 그림자 · 바깥 그림자 */
  avatarInset: string;
  avatarDrop: string;
  /** 게이지 색 */
  gauge: string;
  /** 게이지 손잡이 그림자 */
  gaugeGlow: string;
  wave1: string;
  wave2: string;
  shadow: string;
  /** 캐릭터 뒤 유리 원 (보라 시안만 있음) */
  glass: boolean;
  /** 시안 좌표 (헤더 아래 기준 px, 402px 폭 기준) */
  layout: {
    characterTop: number;
    /** 가운데에서 얼마나 옮기는지 */
    characterLeftOffset: number;
    shadowLeft: number;
    shadowTop: number;
    wave1Top: number;
    wave2Top: number;
    sparkle16: { left: number; top: number };
    sparkle10: { left: number; top: number };
  };
}

const PURPLE: CharacterTheme = {
  background: 'linear-gradient(180deg, #f0e8ff 0%, #d6c2ff 100%)',
  c100: '#f2efff',
  c400: '#a594f6',
  c500: '#7f68f1',
  iconBg: '#784be4',
  chipShadow: 'rgba(151,100,224,0.23)',
  avatarInset: '#ccc2ff',
  avatarDrop: '#cfc7e3',
  gauge: '#7f68f1',
  gaugeGlow: 'rgba(145,64,245,1)',
  wave1: wave1Purple,
  wave2: wave2Purple,
  shadow: shadowPurple,
  glass: true,
  layout: {
    characterTop: 36,
    characterLeftOffset: -6.5,
    shadowLeft: 92,
    shadowTop: 353,
    wave1Top: 237,
    wave2Top: 287,
    sparkle16: { left: 61, top: 71 },
    sparkle10: { left: 45, top: 104 },
  },
};

const ORANGE: CharacterTheme = {
  background: '#fff9f5',
  // 시안: 위 크림(#fff9f5) · 아래 피치(#ffe9da)가 바로 바뀜 (화면 y 460 = 헤더 위 398px = 스크롤 내용 282px)
  contentBackground: 'linear-gradient(180deg, #fff9f5 282px, #ffe9da 282px)',
  c100: '#fff2e9',
  c400: '#ff9658',
  c500: '#ff742c',
  iconBg: '#ff742c',
  chipShadow: 'rgba(213,150,99,0.23)',
  avatarInset: '#fb8c52',
  avatarDrop: '#ffcdb3',
  gauge: '#ff812f',
  gaugeGlow: 'rgba(213,150,99,1)',
  wave1: wave1Orange,
  wave2: wave2Orange,
  shadow: shadowOrange,
  glass: false,
  layout: {
    characterTop: 42,
    characterLeftOffset: -4.5,
    shadowLeft: 91,
    shadowTop: 343,
    wave1Top: 244,
    wave2Top: 292,
    sparkle16: { left: 68, top: 72 },
    sparkle10: { left: 52, top: 105 },
  },
};

const THEMES: Record<string, CharacterTheme> = { '2': ORANGE, '5': PURPLE };

export const themeOf = (character: CharacterId): CharacterTheme => THEMES[character] ?? PURPLE;

/**
 * 기분별 캐릭터 표정 (큰 캐릭터 · V5-02 말풍선 공용)
 * - 쌩쌩 = 기본 캐릭터 이미지 (시안 파일과 같음)
 * - 보라(5): 여유 · 지침 / 주황(2): 지침
 * - TODO(디자인): 나머지 표정 시안이 나오면 추가 (없으면 기본 이미지)
 */
const MOOD_FACES: Record<string, Partial<Record<MemberStatus, string>>> = {
  '2': { unwilling: mood2Unwilling },
  '5': { tired: mood5Tired, unwilling: mood5Unwilling },
};

export const characterFace = (character: CharacterId, status: MemberStatus) =>
  MOOD_FACES[character]?.[status] ?? CHARACTER_IMAGES[character];
