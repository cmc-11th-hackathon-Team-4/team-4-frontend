import { useNavigate } from 'react-router';

// S-12 다음 주기 · 재배분 — 디자인 확정 전 뼈대
function WeeklyNextPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-12 다음 주기 · 재배분</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate('/')}
        >
          메인으로
        </button>
      </div>
    </div>
  );
}

export default WeeklyNextPage;
