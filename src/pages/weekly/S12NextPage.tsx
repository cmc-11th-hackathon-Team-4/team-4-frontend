import { useNavigate } from 'react-router';
import { HOME_PATH } from '@/routes/weeklyPaths';

/** S-12 다음 주기 · 재배분 */
// 디자인 확정 전 뼈대. 스타일은 임시 무채색
function S12NextPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-12 다음 주기 · 재배분</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate(HOME_PATH)}
        >
          메인으로
        </button>
      </div>
    </div>
  );
}

export default S12NextPage;
