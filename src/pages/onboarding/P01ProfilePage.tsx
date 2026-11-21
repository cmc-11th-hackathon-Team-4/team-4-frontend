import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import StateView from '@/components/common/StateView';
import { useMyProfile, useSaveProfile } from '@/hooks/useProfile';
import { MYPAGE_PATHS } from '@/routes/mypagePaths';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { type Profile, useProfileStore } from '@/stores/profile';
import { useToastStore } from '@/stores/toast';
import type { CharacterId } from '@/types/member';
import BottomButton from './components/BottomButton';
import CharacterPicker from './components/CharacterPicker';
import OnboardingLayout from './components/OnboardingLayout';
import UnderlineInput from './components/UnderlineInput';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { INPUT_RULES, isValidText } from './validation';

/** 처음 보이는 캐릭터 (피그마 시안에서 선택된 보라 캐릭터) */
const DEFAULT_CHARACTER: CharacterId = '5';

interface P01ProfilePageProps {
  /** create: 프로필 만들기 (①, ④ 빈 프로필) / edit: 프로필 수정 (④ M-01) */
  mode?: 'create' | 'edit';
}

/**
 * P-01 프로필 만들기 · 수정 (권한: 모두, 만들기/수정 공용 화면) — 피그마 비주얼 시안 기준
 * - 만들기: S-14에서 ?next=create → S-01, ?next=join → S-13, M-01에서 ?next=my → 마이로 복귀
 * - 수정: 저장 후 마이로 복귀
 * - TODO(API): POST /api/v1/users (만들기) · PATCH /api/v1/users/me (수정)로 저장
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

  // 만들기에서 뒤로 왔다가 다시 들어오면 저장해 둔 캐릭터로 시작
  const storedCharacter = useProfileStore((s) => s.profile?.character);

  const [character, setCharacter] = useState<CharacterId>(
    initial?.character ?? storedCharacter ?? DEFAULT_CHARACTER,
  );
  const [name, setName] = useState(initial?.nickname ?? '');

  const canSubmit = isValidText(name, INPUT_RULES.profileName) && !save.isPending;

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
      step={isEdit ? undefined : { current: 1, total: ONBOARDING_STEP_TOTAL }}
      heading={
        isEdit ? (
          '나를 소개해요'
        ) : (
          <>
            집안일에 참여하기 전
            <br />
            <span className="text-primary-500">닉네임</span>과{' '}
            <span className="text-primary-500">캐릭터</span>를 정해주세요
          </>
        )
      }
      description={
        isEdit
          ? '바꾸면 우리 집 모두에게 보여요'
          : '정한 이름과 캐릭터는 우리 집 구성원에게 보여요.'
      }
      footer={
        <BottomButton disabled={!canSubmit} onClick={submit}>
          {isEdit ? '저장' : '다음'}
        </BottomButton>
      }
    >
      <div className="mt-8">
        <CharacterPicker value={character} onChange={setCharacter} />
      </div>

      <UnderlineInput
        className="mt-13"
        label="이름"
        value={name}
        onChange={setName}
        maxLength={INPUT_RULES.profileName.max}
        placeholder="이름을 정해주세요."
        helperText="0~10글자 · 메인에서 캐릭터와 함께 보여요."
      />
    </OnboardingLayout>
  );
}

export default P01ProfilePage;
