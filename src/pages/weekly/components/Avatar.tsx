// 캐릭터 자리. 캐릭터 이미지 확정 전 빈 원
function Avatar({ className = 'size-10' }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-full border border-neutral-300 bg-white ${className}`} />
  );
}

export default Avatar;
