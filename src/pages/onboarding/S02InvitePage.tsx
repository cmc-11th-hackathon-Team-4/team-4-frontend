import { useNavigate } from 'react-router';
import addCircleIcon from '@/assets/icons/add-circle.svg';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import { useProfileStore } from '@/stores/profile';
import { MAX_MEMBERS } from '@/types/group';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import MemberAvatar from './components/MemberAvatar';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';

/**
 * S-02 초대장 만들기 (권한: 방장) — 피그마 비주얼 시안 기준
 * - 혼자일 때는 아바타에 "나"만 보여요 (명세 빈 상태). "나"의 캐릭터는 프로필 스토어 값
 * - TODO(API): 초대 코드 · 구성원 목록 조회 후 들어온 사람 표시 (GET 집 정보)
 * - TODO(API): [추가] · [초대장 보내기]는 초대 코드와 링크를 휴대폰 공유창으로 전송 (코드 발급 전까지 보류)
 * - × 빼기(방장 전용)는 부가 기능이라 보류
 */
function S02InvitePage() {
  const navigate = useNavigate();
  // 내 캐릭터: P-01에서 저장한 프로필 (④ 프로필 스토어 공용)
  const myCharacter = useProfileStore((s) => s.profile?.character);
  const memberCount = 1; // TODO(API): 구성원 수

  return (
    <OnboardingLayout
      title="초대장 만들기"
      step={{ current: 3, total: ONBOARDING_STEP_TOTAL }}
      heading="같이 사는 사람에게 초대장을 보내주세요"
      description="초대 코드를 받은 사람만 들어올 수 있어요."
      footer={
        <BottomButton onClick={() => navigate(ONBOARDING_PATHS.waiting)}>
          초대장 보내기
        </BottomButton>
      }
    >
      {/* 비주얼 시안: [추가] → 나 → 들어온 사람 */}
      <ul className="mt-10 flex items-start gap-3">
        <li className="flex w-20 flex-col items-center">
          <button type="button" disabled aria-label="구성원 추가" className="mt-3 block size-15">
            <img src={addCircleIcon} alt="" width={60} height={60} />
          </button>
          <span className="mt-[15px] text-lg leading-[normal] font-semibold text-gray-700">
            추가
          </span>
        </li>
        <li className="pt-0.5">
          <MemberAvatar label="나" character={myCharacter} isMe />
        </li>
      </ul>

      <section className="mt-[52px] flex flex-col gap-5">
        <div className="flex items-center justify-between leading-[normal]">
          <p className="text-base font-semibold text-gray-800">등록된 구성원</p>
          <p className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-primary-500">{memberCount}명</span>
            <span className="text-[10px] font-medium text-gray-500">/ 최대 {MAX_MEMBERS}명</span>
          </p>
        </div>
        <div className="flex h-1.5 gap-1.5" aria-hidden>
          {Array.from({ length: MAX_MEMBERS }, (_, i) => (
            <span
              key={i}
              className={`flex-1 rounded-md ${i < memberCount ? 'bg-primary-500' : 'bg-line-600'}`}
            />
          ))}
        </div>
        <InfoText size="sm">가족구성원은 최대 {MAX_MEMBERS}명까지 등록할 수 있어요.</InfoText>
      </section>
    </OnboardingLayout>
  );
}

export default S02InvitePage;
