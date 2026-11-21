import checkboxSelectIcon from '@/assets/icons/checkbox-select.svg';
import { CHARACTER_IDS } from '@/constants/character';
import type { CharacterId } from '@/types/member';
import CharacterImage from './CharacterImage';

interface CharacterPickerProps {
  value: CharacterId;
  onChange: (id: CharacterId) => void;
}

/**
 * 캐릭터 선택: 큰 미리보기 + 5개 가로 선택 줄 (피그마 P-01 시안)
 * - P-01 프로필 만들기에서 사용. 프로필 수정(④ 마이)에서도 재사용 가능
 */
function CharacterPicker({ value, onChange }: CharacterPickerProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-full border-4 border-primary-300 bg-primary-100 shadow-[0px_1px_11px_0px_#d0c9f3]">
        <CharacterImage id={value} size={192} offset={0.2} className="bg-primary-100" />
      </div>

      <ul className="mt-4 flex w-full justify-between" role="radiogroup" aria-label="캐릭터 선택">
        {CHARACTER_IDS.map((id, index) => {
          const selected = id === value;
          return (
            <li key={id} className="relative">
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`캐릭터 ${index + 1}`}
                onClick={() => onChange(id)}
                className={`block rounded-full border-2 ${selected ? 'border-primary-500' : 'border-transparent'}`}
              >
                <CharacterImage id={id} size={56} />
              </button>
              {selected && (
                <span
                  aria-hidden
                  className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-primary-500"
                >
                  <img src={checkboxSelectIcon} alt="" width={20} height={20} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CharacterPicker;
