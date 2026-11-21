import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '@/apis/error';
import { createUser, getMe } from '@/apis/onboarding';
import StateView from '@/components/common/StateView';
import { fromServerCharacter, toServerCharacter } from '@/constants/character';
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
import { errorMessage } from './apiMessages';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { onboardingKeys } from './queryKeys';
import { INPUT_RULES, isValidText } from './validation';

/** 처음 보이는 캐릭터 (피그마 시안에서 선택된 보라 캐릭터) */
const DEFAULT_CHARACTER: CharacterId = '5';

interface P01ProfilePageProps {
  /** create: 프로필 만들기 (①, ④ 빈 프로필) / edit: 프로필 수정 (④ M-01) */
  mode?: 'create' | 'edit';
}

/**
 * P-01 프로필 만들기 · 수정 (권한: 모두, 만들기/수정 공용 화면) — 피그마 비주얼 시안 기준
 * - 만들기: S-14에서 ?next=create → S-01, S-13-C에서 ?next=confirm&code= → S-13-C로 복귀, ?next=join → S-13, M-01에서 ?next=my → 마이로 복귀
 * - 수정: 저장 후 마이로 복귀
 * - 만들기: POST /api/v1/users 로 서버에 저장 (이미 등록된 기기면 서버 프로필을 그대로 사용)
 * - 수정: ④ 담당 useSaveProfile (PATCH /api/v1/users/me)
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
  const setProfile = useProfileStore((s) => s.setProfile);
  const queryClient = useQueryClient();

  // 만들기: 서버에 프로필 등록. 이미 등록된 기기(USER-409)면 서버에 있는 프로필을 불러와 이어서 진행
  const create = useMutation({
    mutationFn: async (input: Profile) => {
      try {
        const user = await createUser({
          name: input.nickname,
          characterType: toServerCharacter(input.character),
        });
        return { nickname: user.name, character: fromServerCharacter(user.characterType) };
      } catch (error) {
        if (error instanceof ApiError && error.code === 'USER-409') {
          const me = await getMe();
          return { nickname: me.name, character: fromServerCharacter(me.characterType) };
        }
        throw error;
      }
    },
    onSuccess: (profile) => {
      setProfile(profile);
      // ① 화면의 "프로필 있음?" 판단(GET /users/me)을 새로 받게 함
      queryClient.invalidateQueries({ queryKey: onboardingKeys.me });
    },
  });

  const [character, setCharacter] = useState<CharacterId>(
    initial?.character ?? storedCharacter ?? DEFAULT_CHARACTER,
  );
  const [name, setName] = useState(initial?.nickname ?? '');

  const canSubmit =
    isValidText(name, INPUT_RULES.profileName) && !save.isPending && !create.isPending;

  const afterSave = () => {
    if (isEdit) return navigate(-1);
    const next = searchParams.get('next');
    if (next === 'my') {
      showToast('프로필을 만들었어요');
      return navigate(MYPAGE_PATHS.my, { replace: true });
    }
    if (next === 'confirm') {
      // S-13-C 에서 참여 직전에 온 경우: 프로필을 만든 뒤 그 집 확인 화면으로 돌아감
      const code = searchParams.get('code') ?? '';
      return navigate(`${ONBOARDING_PATHS.joinConfirm}?code=${code}`, { replace: true });
    }
    navigate(next === 'join' ? ONBOARDING_PATHS.join : ONBOARDING_PATHS.create);
  };

  const submit = () => {
    if (!isEdit) {
      create.mutate(
        { nickname: name.trim(), character },
        { onSuccess: afterSave, onError: (error) => showToast(errorMessage(error)) },
      );
      return;
    }
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
          // 피그마 ④ P-01 프로필 수정
          <>
            닉네임과 캐릭터를
            <br />
            <span className="text-primary-500">바꿀 수 있어요</span>
          </>
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
          ? '바꾼 닉네임과 캐릭터는 우리 집 구성원에게 보여요.'
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
        label={isEdit ? '닉네임' : '이름'}
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
