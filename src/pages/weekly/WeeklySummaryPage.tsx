import { useNavigate } from 'react-router';

// S-08 주간 결산 — 디자인 확정 전 뼈대
function WeeklySummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="text-xl font-bold">S-08 주간 결산</h1>
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="rounded-xl bg-neutral-900 py-3 text-white"
          onClick={() => navigate('/weekly/result')}
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}

export default WeeklySummaryPage;
