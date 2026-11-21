function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative mx-auto w-fit max-w-[80%] rounded-xl border border-neutral-300 bg-white px-3 py-2 text-center text-xs">
      {text}
      <span className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-neutral-300 bg-white" />
    </div>
  );
}

export default SpeechBubble;
