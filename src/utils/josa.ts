type JosaPair = '이/가' | '을/를' | '은/는' | '와/과' | '아/야';

/** 마지막 글자에 받침이 있는지 (한글이 아니면 받침 없음으로 처리) */
function hasBatchim(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}

/** 받침에 맞는 조사 붙이기: josa('수진', '이/가') → '수진이' */
export function josa(word: string, pair: JosaPair) {
  const [withBatchim, withoutBatchim] = pair.split('/');
  return word + (hasBatchim(word) ? withBatchim : withoutBatchim);
}
