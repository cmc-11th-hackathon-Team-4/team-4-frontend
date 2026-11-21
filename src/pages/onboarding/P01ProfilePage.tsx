import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import StateView from '@/components/common/StateView';
import { useMyProfile, useSaveProfile } from '@/hooks/useProfile';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import type { Profile } from '@/stores/profile';
import { useToastStore } from '@/stores/toast';
import { CHARACTER_COUNT, type CharacterId } from '@/types/member';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import OnboardingLayout from './components/OnboardingLayout';
import UnderlineInput from './components/UnderlineInput';
import { INPUT_RULES, isValidText } from './validation';

/** 캐릭터 값 형식은 서버 확정 전까지 '1'~'4' */
const CHARACTERS: CharacterId[] = Array.from({ length: CHARACTER_COUNT }, (_, i) => String(i + 1));

interface P01ProfilePageProps {
  /** create: 프로필 만들기 (①, ④ 빈 프로필) / edit: 프로필 수정 (④ M-01) */
  mode?: 'create' | 'edit';
}

/**
 * P-01 프로필 만들기 · 수정 (권한: 모두, 만들기/수정 공용 화면)
 * - 만들기: S-14에서 ?next=create → S-01, ?next=join → S-13, M-01에서 ?next=my → 마이로 복귀
 * - 수정: 저장 후 마이로 복귀
 * - TODO(API): 프로필 저장 (지금은 프로필 스토어 + 목데이터)
 */
function P01ProfilePage({ mode = 'create' }: P01ProfilePageProps) {
  const { profile, isLoading } = useMyProfile();

  // 수정은 기존 값을 채운 뒤 폼을 그림
  if (mode === 'edit' && isLoading) return <StateView type="loading" />;

  return <ProfileForm mode={mode} initial={mode === 'edit' ? profile : null} />;
}

function ProfileForm({ mode, initial }: { mode: 'create' | 'edit'; initial: Profile | null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showToast = useToastStore((s) => s.show);
  const save = useSaveProfile();
  const isEdit = mode === 'edit';

  const [character, setCharacter] = useState<CharacterId | null>(initial?.character ?? null);
  const [name, setName] = useState(initial?.nickname ?? '');

  const canSubmit =
    character !== null && isValidText(name, INPUT_RULES.profileName) && !save.isPending;

  const afterSave = () => {
    if (isEdit) return navigate(-1);
    const next = searchParams.get('next');
    if (next === 'my') {
      showToast('프로필을 만들었어요');
      return navigate(MYPAGE_PATHS.my, { replace: true });
    }
    navigate(next === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create);
  };

  const submit = () => {
    if (character === null) return;
    save.mutate(
      { nickname: name.trim(), character },
      {
        onSuccess: afterSave,
        onError: () => showToast('저장하지 못했어요. 다시 시도해주세요'),
      },
    );
  };

  return (
    <OnboardingLayout
      title={isEdit ? '프로필 수정' : '프로필 만들기'}
      heading={isEdit ? '나를 소개해요' : '어떤 캐릭터로 함께할까요?'}
      description={isEdit ? '바꾸면 우리 집 모두에게 보여요' : '같은 캐릭터여도 이름으로 구분돼요.'}
      footer={
        <BottomButton disabled={!canSubmit} onClick={submit}>
          {isEdit ? '저장' : '프로필 만들고 계속하기'}
        </BottomButton>
      }
    >
      <div className="mt-6 grid grid-cols-2 gap-3">
        {CHARACTERS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={character === id}
            onClick={() => setCharacter(id)}
            className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 bg-neutral-100 text-sm ${
              character === id ? 'border-neutral-900' : 'border-transparent'
            }`}
          >
            캐릭터 {id}
          </button>
        ))}
      </div>

      <UnderlineInput
        className="mt-8"
        label="이름"
        value={name}
        onChange={setName}
        maxLength={INPUT_RULES.profileName.max}
        placeholder="수아"
      />
      <InfoText className="mt-2">1~10자 · 메인에서 캐릭터와 함께 보여요.</InfoText>
    </OnboardingLayout>
  );
}

export default P01ProfilePage;
