/** 상대 상세: 게이지 아래 상대의 한마디 (V5-07) */
function MoodBubble({ text }: { text: string }) {
  return (
    <p className="mx-auto w-fit max-w-[80%] truncate rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs">
      {text}
    </p>
  );
}

export default MoodBubble;
