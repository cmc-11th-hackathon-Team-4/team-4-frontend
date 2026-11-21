import { useNavigate } from 'react-router';
import addCircleIcon from '@/assets/icons/add-circle.svg';
import StateView from '@/components/common/StateView';
import { fromServerCharacter } from '@/constants/character';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useToastStore } from '@/stores/toast';
import { MAX_MEMBERS } from '@/types/group';
import { COMMON_ERROR, LOAD_ERROR, RETRY_LABEL } from './apiMessages';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import MemberAvatar from './components/MemberAvatar';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';
import { shareInvite } from './shareInvite';
import { useMyHouse } from './useMyHouse';

/** 구성원 합류를 보여주기 위한 다시 불러오기 간격 (대기실과 같음) */
const REFETCH_MS = 3000;

/**
 * S-02 초대장 만들기 (권한: 방장) — 피그마 비주얼 시안 기준
 * - GET /api/v1/houses/{id}: 초대 코드 · 구성원 목록 (들어온 사람은 바로 위 목록에 보이도록 주기적으로 다시 불러옴)
 * - [추가] · [초대장 보내기]: 휴대폰 공유창으로 초대 코드와 링크 전송, 공유창이 없으면 초대 코드 복사
 * - [초대장 보내기]는 보낸 뒤 S-03 대기실로
 * - × 빼기(방장 전용, DELETE members)는 부가 기능이라 보류
 */
function S02InvitePage() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const { house, isLoading, isError, refetch } = useMyHouse({ refetchInterval: REFETCH_MS });

  if (isLoading) return <StateView type="loading" />;
  if (isError || !house) {
    return (
      <StateView type="error" message={LOAD_ERROR} retryLabel={RETRY_LABEL} onRetry={refetch} />
    );
  }

  const maxMembers = house.maxMemberCount || MAX_MEMBERS;
  // 나를 맨 앞에
  const members = [...house.members].sort((a, b) => Number(b.isMe) - Number(a.isMe));

  const share = async (thenGoWaiting: boolean) => {
    const result = await shareInvite(house.inviteCode);
    if (result === 'copied') showToast('초대 코드를 복사했어요');
    if (result === 'failed') showToast(COMMON_ERROR);
    if (thenGoWaiting && (result === 'shared' || result === 'copied')) {
      navigate(ONBOARDING_PATHS.waiting);
    }
  };

  return (
    <OnboardingLayout
      title="초대장 만들기"
      step={{ current: 3, total: ONBOARDING_STEP_TOTAL }}
      heading="같이 사는 사람에게 초대장을 보내주세요"
      description="초대 코드를 받은 사람만 들어올 수 있어요."
      footer={<BottomButton onClick={() => share(true)}>초대장 보내기</BottomButton>}
    >
      {/* 비주얼 시안: [추가] → 나 → 들어온 사람 */}
      <ul className="mt-10 flex flex-wrap items-start gap-3">
        <li className="flex w-20 flex-col items-center">
          <button
            type="button"
            onClick={() => share(false)}
            aria-label="구성원 추가"
            className="mt-3 block size-15"
          >
            <img src={addCircleIcon} alt="" width={60} height={60} />
          </button>
          <span className="mt-[15px] text-lg leading-[normal] font-semibold text-gray-700">
            추가
          </span>
        </li>
        {members.map((m) => (
          <li key={m.userId} className="pt-0.5">
            <MemberAvatar
              label={m.isMe ? '나' : m.name}
              character={fromServerCharacter(m.characterType)}
              isMe={m.isMe}
            />
          </li>
        ))}
      </ul>

      <section className="mt-[52px] flex flex-col gap-5">
        <div className="flex items-center justify-between leading-[normal]">
          <p className="text-base font-semibold text-gray-800">등록된 구성원</p>
          <p className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-primary-500">{house.memberCount}명</span>
            <span className="text-[10px] font-medium text-gray-500">/ 최대 {maxMembers}명</span>
          </p>
        </div>
        <div className="flex h-1.5 gap-1.5" aria-hidden>
          {Array.from({ length: maxMembers }, (_, i) => (
            <span
              key={i}
              className={`flex-1 rounded-md ${i < house.memberCount ? 'bg-primary-500' : 'bg-line-600'}`}
            />
          ))}
        </div>
        <InfoText size="sm">가족구성원은 최대 {maxMembers}명까지 등록할 수 있어요.</InfoText>
      </section>
    </OnboardingLayout>
  );
}

export default S02InvitePage;
