import { useNavigate } from 'react-router';
import { WEEKLY_PATHS } from '@/routes/weeklyPaths';

/** S-10 못 한 일 이월 */
// 디자인 확정 전 뼈대. 스타일은 임시 무채색
function S10CarryOverPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-10 못 한 일 이월</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate(WEEKLY_PATHS.best)}
        >
          이월하기
        </button>
      </div>
    </div>
  );
}

export default S10CarryOverPage;
