import { CHARACTER_IMAGES } from '@/constants/character';
import CharacterImage from '@/pages/onboarding/components/CharacterImage';
import type { CharacterId } from '@/types/member';

interface AvatarProps {
  /** 없거나 이미지가 없는 값이면 빈 원 */
  character?: CharacterId | null;
  /** 원 크기(px) */
  size?: number;
}

// 구성원 캐릭터 원 (①의 CharacterImage 사용)
function Avatar({ character, size = 40 }: AvatarProps) {
  if (character && CHARACTER_IMAGES[character]) {
    return <CharacterImage id={character} size={size} />;
  }
  return (
    <span
      aria-hidden
      className="block shrink-0 rounded-full border border-line-700 bg-white"
      style={{ width: size, height: size }}
    />
  );
}

export default Avatar;
