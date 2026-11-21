import { CHARACTER_IMAGES } from '@/constants/character';
import type { CharacterId } from '@/types/member';

interface CharacterImageProps {
  id: CharacterId;
  /** 원 크기(px) */
  size: number;
  /** 이미지를 아래로 내리는 정도 (원 크기 대비). 시안: 선택 원 17/60, 미리보기 39/200 */
  offset?: number;
  className?: string;
}

/**
 * 원 안에 캐릭터 이미지 (피그마 P-01 "프로필 선택" 기준)
 * - 이미지는 원보다 크게(약 1.67배) 깔고 아래로 내려 몸통이 원 안에 차도록 자름
 */
function CharacterImage({ id, size, offset = 0.28, className = '' }: CharacterImageProps) {
  return (
    <span
      aria-hidden
      className={`relative block shrink-0 overflow-hidden rounded-full bg-line-400 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={CHARACTER_IMAGES[id]}
        alt=""
        className="absolute left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ width: size * 1.667, height: size * 1.667, top: `calc(50% + ${size * offset}px)` }}
      />
    </span>
  );
}

export default CharacterImage;
