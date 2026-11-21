interface StateViewProps {
  type: 'loading' | 'error';
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

/** 로딩·에러 공용 화면 */
function StateView({ type, message, retryLabel, onRetry }: StateViewProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-sm text-neutral-500">
      {type === 'loading' ? (
        <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      ) : (
        <>
          <p>{message}</p>
          {onRetry && (
            <button type="button" className="rounded-lg border px-4 py-2" onClick={onRetry}>
              {retryLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default StateView;
