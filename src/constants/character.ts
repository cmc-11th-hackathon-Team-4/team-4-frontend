import character1 from '@/assets/characters/character-1.png';
import character2 from '@/assets/characters/character-2.png';
import character3 from '@/assets/characters/character-3.png';
import character4 from '@/assets/characters/character-4.png';
import character5 from '@/assets/characters/character-5.png';
import type { CharacterId } from '@/types/member';

/**
 * 프로필 캐릭터 5종 (피그마 P-01 시안 순서: 빨강 · 주황 · 노랑 · 파랑 · 보라)
 * - 앱 값 '1'~'5', 서버 값 'CHARACTER_1'~ (아래 변환 함수 사용)
 */
export const CHARACTER_IDS: CharacterId[] = ['1', '2', '3', '4', '5'];

export const CHARACTER_IMAGES: Record<string, string> = {
  '1': character1,
  '2': character2,
  '3': character3,
  '4': character4,
  '5': character5,
};

/** 서버 캐릭터 값 (API: characterType). 앱 값 '1'~'5' ↔ 서버 'CHARACTER_1'~'CHARACTER_5' */
export const toServerCharacter = (id: CharacterId) => `CHARACTER_${id}`;
export const fromServerCharacter = (value: string): CharacterId => value.replace('CHARACTER_', '');
