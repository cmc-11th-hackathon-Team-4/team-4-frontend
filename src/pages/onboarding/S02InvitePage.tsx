import { useNavigate } from 'react-router';
import { ONBOARDING_PATHS } from '@/routes/onboardingPaths';
import plusCircleIcon from '@/assets/icons/plus-circle.svg';
import { MAX_MEMBERS } from '@/types/group';
import BottomButton from './components/BottomButton';
import InfoText from './components/InfoText';
import OnboardingLayout from './components/OnboardingLayout';
import { ONBOARDING_STEP_TOTAL } from './constants';

/**
 * S-02 초대장 만들기 (권한: 방장)
 * - 혼자일 때는 아바타에 "나"만 보여요 (명세 빈 상태)
 * - TODO(API): 초대 코드 · 구성원 목록 조회 후 들어온 사람 표시
 * - TODO(API): [추가] · [초대장 보내기]는 초대 코드와 링크를 휴대폰 공유창으로 전송 (코드 발급 전까지 보류)
 * - × 빼기(방장 전용)는 부가 기능이라 보류
 */
function S02InvitePage() {
  const navigate = useNavigate();
  const memberLabels = ['나'];

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
      {/* 비주얼 시안: 구성원 아바타(둥근 사각형) 뒤에 추가 버튼 */}
      <ul className="mt-15 flex items-start gap-3">
        {memberLabels.map((label) => (
          <li key={label} className="flex w-20 flex-col items-center gap-2">
            <div aria-hidden className="size-20 rounded-[28px] bg-line-400" />
            <span
              className={`text-lg leading-[normal] font-semibold ${
                label === '나' ? 'text-primary-500' : 'text-gray-700'
              }`}
            >
              {label}
            </span>
          </li>
        ))}
        <li className="pt-1">
          <button type="button" disabled aria-label="구성원 추가" className="block size-18">
            <img src={plusCircleIcon} alt="" width={72} height={72} />
          </button>
        </li>
      </ul>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-500">등록한 구성원</p>
            <p className="text-2xl font-bold">{memberLabels.length}명</p>
          </div>
          <p className="text-sm text-neutral-500">최대 {MAX_MEMBERS}명</p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden>
          {Array.from({ length: MAX_MEMBERS }, (_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full ${i < memberLabels.length ? 'bg-neutral-900' : 'bg-neutral-200'}`}
            />
          ))}
        </div>
        <InfoText className="mt-3">
          최대 {MAX_MEMBERS}명까지 초대할 수 있어요. 들어온 사람은 바로 위 목록에 보여요.
        </InfoText>
      </section>
    </OnboardingLayout>
  );
}

export default S02InvitePage;
